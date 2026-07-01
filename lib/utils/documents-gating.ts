export type DocumentStatus = 'locked' | 'generating' | 'ready' | 'failed';

export interface InternDocument {
  id: 'offer_letter' | 'payment_receipt' | 'attendance_record'
    | 'assessment_marksheet' | 'internship_report' | 'internship_certificate';
  title: string;
  status: DocumentStatus;
  unlockCondition?: string;        // e.g. "Pass the assessment to unlock"
  generatedAt?: string;
  downloadUrl?: string;            // present only when status === 'ready'
}

export interface InternshipProgress {
  internshipId: string;            // e.g. "INT-2026-A5F86E"
  programName: string;
  active: boolean;
  paymentStatus: 'paid' | 'unpaid' | 'pending';
  assessmentStatus: 'not_attempted' | 'passed' | 'failed';
  assessmentPassMark: number;
  internshipPeriod: { completed: boolean; endDate: string };
  documentsReadyCount: number;
  documentsTotalCount: number;
  documents: InternDocument[];
}

export function getDocumentStatus(doc: InternDocument, progress: InternshipProgress): DocumentStatus {
  const docId = doc.id.toLowerCase();
  
  // Offer Letter & Payment Receipt are unlocked when payment is completed
  if (docId === 'offer_letter' || docId === 'payment_receipt' || docId === 'receipt') {
    return progress.paymentStatus === 'paid' ? 'ready' : 'locked';
  }
  
  // Attendance Record, Assessment Marksheet, Internship Report, and Internship Certificate are unlocked when assessment is passed
  if (
    docId === 'attendance_record' ||
    docId === 'attendance_sheet' ||
    docId === 'assessment_marksheet' ||
    docId === 'marksheet' ||
    docId === 'internship_report' ||
    docId === 'internship_certificate' ||
    docId === 'certificate'
  ) {
    return progress.assessmentStatus === 'passed' ? 'ready' : 'locked';
  }
  
  return 'locked';
}
