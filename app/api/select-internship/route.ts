import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { sendEmail } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    const { internshipId, studentId } = await req.json();

    if (!internshipId || !studentId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (isSupabaseConfigured() && supabase) {
      // 1. Find the unused credit
      const { data: payments, error: fetchError } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', studentId)
        .eq('internship_id', 'general_credit_unused')
        .eq('status', 'completed')
        .limit(1);

      if (fetchError || !payments || payments.length === 0) {
        return NextResponse.json({ success: false, error: "No unused credit found." }, { status: 400 });
      }

      const creditId = payments[0].id;

      // 2. Update the credit to lock the internship
      const { error: updateError } = await supabase
        .from('payments')
        .update({ internship_id: internshipId })
        .eq('id', creditId);

      if (updateError) {
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }

      // 3. Get student profile for email
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', studentId)
        .single();

      // 4. Get internship details for email
      const { data: internship } = await supabase
        .from('internships')
        .select('title')
        .eq('id', internshipId)
        .single();

      if (profile && internship) {
        // Send confirmation email
        const emailHtml = `
          <h2>Registration & Internship Locked Successfully!</h2>
          <p>Hi <strong>${profile.full_name}</strong>,</p>
          <p>Your payment has been verified and your internship is now locked in.</p>
          <ul>
            <li><strong>Registration ID:</strong> ${studentId}</li>
            <li><strong>Payment Status:</strong> Completed</li>
            <li><strong>Internship Name:</strong> ${internship.title}</li>
            <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</li>
          </ul>
          <p>You can now start your assessment.</p>
          <br>
          <p>Regards,<br>IQ Intern Team</p>
        `;
        
        // This runs asynchronously in background
        sendEmail({
          to: profile.email,
          subject: "IQ Intern Registration Confirmation",
          html: emailHtml,
          studentId: studentId
        }).catch(console.error);
      }
    } else {
      // MOCK MODE: Just send a mock email
      const emailHtml = `
        <h2>Registration & Internship Locked Successfully!</h2>
        <p>Hi Student,</p>
        <p>Your payment has been verified and your internship is now locked in.</p>
        <ul>
          <li><strong>Registration ID:</strong> ${studentId}</li>
          <li><strong>Payment Status:</strong> Completed</li>
          <li><strong>Internship ID:</strong> ${internshipId}</li>
          <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</li>
        </ul>
        <p>You can now start your assessment.</p>
        <br>
        <p>Regards,<br>IQ Intern Team</p>
      `;
      sendEmail({
        to: "test@example.com", // Mock email
        subject: "IQ Intern Registration Confirmation",
        html: emailHtml,
        studentId: studentId
      }).catch(console.error);
    }

    // Trigger background PDF generation for Offer Letter and Attendance Sheet (fire-and-forget)
    try {
      const baseUrl = req.url.substring(0, req.url.indexOf("/api/select-internship"));
      fetch(`${baseUrl}/api/documents/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          internshipId,
          templateType: ["offer_letter", "attendance_sheet"]
        })
      }).catch((err) => console.error("Failed to trigger background document generation on selection:", err));
    } catch (triggerErr) {
      console.error("Trigger background selection documents error:", triggerErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in select-internship API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
