import { NextResponse } from 'next/server';
import { generateDocument } from '@/lib/documents/generator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.checkMissing) {
      const studentId = body.studentId;
      if (!studentId) {
        return NextResponse.json({ success: false, error: 'Missing studentId' }, { status: 400 });
      }

      // Start background check and generation (non-blocking)
      (async () => {
        try {
          const { supabase, isSupabaseConfigured } = require("@/lib/supabase/client");
          if (!isSupabaseConfigured() || !supabase) return;

          // Fetch payments
          const { data: payments } = await supabase
            .from("payments")
            .select("internship_id, status")
            .eq("student_id", studentId)
            .eq("status", "completed");

          if (!payments || payments.length === 0) return;

          // Fetch test results
          const { data: testResults } = await supabase
            .from("test_results")
            .select("internship_id, passed, percentage")
            .eq("student_id", studentId);

          const { origin } = new URL(req.url);
          const isValidUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

          // For each payment, determine which documents we need to check
          for (const payment of payments) {
            const internshipId = payment.internship_id;
            
            // 1. Every completed payment gets a receipt
            await generateDocument(studentId, internshipId, 'receipt', false, origin);

            if (isValidUuid(internshipId)) {
              // 2. Locked internships get offer_letter and attendance_sheet
              await generateDocument(studentId, internshipId, 'offer_letter', false, origin);
              await generateDocument(studentId, internshipId, 'attendance_sheet', false, origin);

              // 3. Check if passed assessment for certificate, marksheet, project_report
              const passedTest = testResults?.some(
                (t: any) => t.internship_id === internshipId && (t.passed === true || (t.percentage && t.percentage >= 40))
              );

              if (passedTest) {
                await generateDocument(studentId, internshipId, 'certificate', false, origin);
                await generateDocument(studentId, internshipId, 'marksheet', false, origin);
                await generateDocument(studentId, internshipId, 'project_report', false, origin);
              }
            }
          }
        } catch (checkErr) {
          console.error('[Check Missing Worker] Failed to check missing docs:', checkErr);
        }
      })();

      return NextResponse.json({ success: true, message: 'Lightweight background check started.' });
    }

    const { studentId, internshipId, templateType } = body;

    if (!studentId || !internshipId || !templateType) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    const { origin } = new URL(req.url);
    const types = Array.isArray(templateType) ? templateType : [templateType];

    // Trigger PDF generation in the background (fire-and-forget)
    // Spawns asynchronous promises so the request completes immediately without waiting for Puppeteer
    (async () => {
      for (const type of types) {
        try {
          console.log(`[Background Worker] Triggering PDF generation for: studentId=${studentId}, internshipId=${internshipId}, template=${type}`);
          const res = await generateDocument(studentId, internshipId, type, false, origin);
          if (res.success) {
            console.log(`[Background Worker] PDF generated successfully: ${type}`);
          } else {
            console.error(`[Background Worker] PDF generation failed for ${type}:`, res.error);
          }
        } catch (err) {
          console.error(`[Background Worker] Unhandled generation exception for ${type}:`, err);
        }
      }
    })();

    return NextResponse.json({ 
      success: true, 
      message: `Document generation enqueued for templates: ${types.join(', ')}` 
    });
  } catch (error: any) {
    console.error('Document generator worker endpoint error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
