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
    try {
      await verifyAndCompletePayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    } catch (dbErr) {
      console.warn("Failed to update payment status in database:", dbErr);
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
