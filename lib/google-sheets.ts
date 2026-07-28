// lib/google-sheets.ts

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbx5_1yP2R9XQkP7Yw86X296bHn67zS0Vd6QO33Lp-54s5Vb4kS-9yUoI9Qp62q4QYxU/exec';

interface SheetData {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    university: string;
    college: string;
    course: string;
    department: string;
    semester: string;
    batch: string;
    rollNumber: string;
    regNumber: string;
    emergName: string;
    emergPhone: string;
    emergRelation: string;
    termsAgreed: boolean;
    updatesAgreed: boolean;
}

/**
 * Sends registration data to Google Sheets.
 * Fire-and-forget — doesn't block the main flow.
 * Errors are logged to console but don't affect user experience.
 */
export async function logRegistrationToSheet(data: SheetData): Promise<void> {
    try {
        await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        console.log('✅ Registration logged to Google Sheets');
    } catch (error) {
        // Silent fail — don't break the registration flow
        console.error('⚠️ Failed to log to Google Sheets:', error);
    }
}