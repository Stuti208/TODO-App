import { tz } from '@date-fns/tz';
import { addDays, endOfWeek, format, isSameDay, startOfDay, startOfWeek } from 'date-fns';

const IST = tz('Asia/Kolkata');
const IST_OFFSET = '+05:30';
const WEEK_OPTIONS = { weekStartsOn: 1, in: IST }; 
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;


// backend expects plain UTC ISO strings
const toUtcIso = (date) => new Date(date.getTime()).toISOString();

// Monday 00:00 to Sunday 23:59:59.999 in Indian time
export const getWeekRange = (date) => ({
  from: toUtcIso(startOfWeek(date, WEEK_OPTIONS)),
  to: toUtcIso(endOfWeek(date, WEEK_OPTIONS)),
});


// Consecutive days around a centre date 
export const getDateRange = (centerDate, daysBefore, daysAfter) => {
  const rangeStart = addDays(startOfDay(centerDate, { in: IST }), -daysBefore);
  return Array.from({ length: daysBefore + daysAfter + 1 }, (_, index) =>
    addDays(rangeStart, index)
  );
};


export const isSameISTDay = (first, second) =>
  isSameDay(new Date(first), new Date(second), { in: IST });

export const formatIST = (date, pattern) =>
  format(new Date(date), pattern, { in: IST });

export const toISTDateKey = (date) => formatIST(date, 'yyyy-MM-dd');



export const parseISTDate = (dateKey, time = '00:00') => {
  if (!DATE_KEY_PATTERN.test(dateKey)) return null;
  const date = new Date(`${dateKey}T${time}:00${IST_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date;
};