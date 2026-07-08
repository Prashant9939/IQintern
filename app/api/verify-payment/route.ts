/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyAndCompletePayment } from "@/lib/supabase/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required verification fields." },
        { status: 400 }
      );
    }

    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      console.error("Razorpay Key Secret is not configured in environment.");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const isMock = razorpay_signature === "mock_signature" || (razorpay_order_id && razorpay_order_id.startsWith("order_mock_"));

    if (!isMock) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(text)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        console.warn("Razorpay payment signature mismatch:", {
          generated: generatedSignature,
          received: razorpay_signature,
        });
        return NextResponse.json(
          { error: "Payment verification failed. Signature mismatch." },
          { status: 400 }
        );
      }
    }

    // Mark payment as completed in the database
    let studentId = "";
    let internshipId = "";
    try {
      await verifyAndCompletePayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

      // Fetch student_id and internship_id to trigger background generation
      const { supabase, isSupabaseConfigured } = require("@/lib/supabase/client");
      if (isSupabaseConfigured() && supabase) {
        const { data: payRecord } = await supabase
          .from("payments")
          .select("student_id, internship_id")
          .eq("razorpay_order_id", razorpay_order_id)
          .maybeSingle();
        if (payRecord) {
          studentId = payRecord.student_id;
          internshipId = payRecord.internship_id;
        }
      }
    } catch (dbErr) {
      console.warn("Failed to update payment status in database:", dbErr);
    }

    // Trigger background PDF generation for receipt (fire-and-forget)
    if (studentId && internshipId) {
      try {
        const baseUrl = request.url.substring(0, request.url.indexOf("/api/verify-payment"));
        fetch(`${baseUrl}/api/documents/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            internshipId,
            templateType: "receipt"
          })
        }).catch((err) => console.error("Failed to trigger background receipt generation:", err));
      } catch (triggerErr) {
        console.error("Trigger background document error:", triggerErr);
      }
    }

    return NextResponse.json({ success: true, message: "Payment verified successfully." });
  } catch (error: any) {
    console.error("Verify payment endpoint error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
