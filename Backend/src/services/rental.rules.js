const DAY_MS = 24 * 60 * 60 * 1000;
export const MAX_RENTAL_DAYS = 30;

const parseUtcDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? null
    : date;
};

export const isValidCalendarDate = (value) => parseUtcDate(value) !== null;

export const rentalDayCount = (startDate, endDate) => {
  const start = parseUtcDate(startDate);
  const end = parseUtcDate(endDate);
  if (!start || !end || end < start) return null;
  return Math.floor((end.getTime() - start.getTime()) / DAY_MS) + 1;
};

export const rentalRangesOverlap = (first, second) =>
  first.startDate <= second.endDate && first.endDate >= second.startDate;

export const validateRentalDates = ({ startDate, endDate, today = new Date() }) => {
  const start = parseUtcDate(startDate);
  const end = parseUtcDate(endDate);
  if (!start || !end) return "Rental dates must be valid calendar dates in YYYY-MM-DD format.";
  if (end < start) return "Rental end date must be on or after the start date.";

  const todayDate = typeof today === "string"
    ? parseUtcDate(today)
    : parseUtcDate(today.toISOString().slice(0, 10));
  if (!todayDate) return "Current date is invalid.";
  if (start < todayDate) return "Rental start date cannot be in the past.";

  const days = rentalDayCount(startDate, endDate);
  if (days < 1) return "A rental must be at least one day.";
  if (days > MAX_RENTAL_DAYS) return `A rental cannot exceed ${MAX_RENTAL_DAYS} days.`;
  return null;
};
