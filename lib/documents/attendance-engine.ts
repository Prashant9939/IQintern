/**
 * Attendance Generation Engine
 * Handles working days calculation, weekend/holiday exclusions,
 * and forward/backward date range calculations.
 */

export function formatDateToYYYYMMDD(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function isNonWorkingDay(date: Date, holidaysList: string[]): boolean {
  // Sunday is index 0
  if (date.getDay() === 0) return true;

  const dateStr = formatDateToYYYYMMDD(date);
  return holidaysList.includes(dateStr);
}

export function getRequiredWorkingDays(durationStr: string): number {
  if (!durationStr) return 24;
  const match = durationStr.match(/(\d+)\s*(Hrs|Hours)/i);
  if (match) {
    const hours = parseInt(match[1], 10);
    // Assuming 5 hours per working day (e.g. 120 Hrs / 5 = 24 working days)
    return Math.ceil(hours / 5);
  }
  return 24;
}

export function generateAttendanceDays(
  baseDate: Date,
  mode: 'start_date' | 'completion_date',
  workingDaysCount: number,
  holidaysList: string[]
): { dates: Date[]; startDate: Date; endDate: Date } {
  const dates: Date[] = [];
  let currentDate = new Date(baseDate.getTime());

  if (mode === 'start_date') {
    // Start Date Mode: Loop forward
    while (dates.length < workingDaysCount) {
      if (!isNonWorkingDay(currentDate, holidaysList)) {
        dates.push(new Date(currentDate.getTime()));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const startDate = dates[0] || baseDate;
    const endDate = dates[dates.length - 1] || baseDate;
    return { dates, startDate, endDate };
  } else {
    // Completion Date Mode: Loop backward
    while (dates.length < workingDaysCount) {
      if (!isNonWorkingDay(currentDate, holidaysList)) {
        dates.unshift(new Date(currentDate.getTime())); // Prepend to preserve chronological order
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    const startDate = dates[0] || baseDate;
    const endDate = dates[dates.length - 1] || baseDate;
    return { dates, startDate, endDate };
  }
}
