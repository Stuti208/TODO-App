import { useEffect, useMemo, useRef } from 'react';
import { formatIST, getDateRange, toISTDateKey } from '../../utils/date';

const DAYS_BEFORE = 90;
const DAYS_AFTER = 90;

const WeekStrip = ({ selectedDate, onSelectDate }) => {
  const calendarDays = useMemo(
    () =>
      getDateRange(new Date(), DAYS_BEFORE, DAYS_AFTER).map((date) => ({
        key: toISTDateKey(date),
        date,
        weekday: formatIST(date, 'EEE'),
        dayOfMonth: formatIST(date, 'dd'),
      })),
    []
  );

  const selectedKey = toISTDateKey(selectedDate);
  const selectedTileRef = useRef(null);
  const hasScrolledRef = useRef(false);

  // Keep the selected day centred: jump on first load, glide afterwards.
  useEffect(() => {
    selectedTileRef.current?.scrollIntoView({
      behavior: hasScrolledRef.current ? 'smooth' : 'auto',
      inline: 'center',
      block: 'nearest',
    });
    hasScrolledRef.current = true;
  }, [selectedKey]);

  return (
    <section aria-label="Calendar">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900">
          {formatIST(selectedDate, 'MMMM yyyy')}
        </p>
        <button
          type="button"
          onClick={() => onSelectDate(new Date())}
          className="text-xs font-medium text-primary"
        >
          Today
        </button>
      </div>

      <ul className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {calendarDays.map(({ key, date, weekday, dayOfMonth }) => {
          const isSelected = key === selectedKey;

          return (
            <li key={key} className="shrink-0">
              <button
                type="button"
                ref={isSelected ? selectedTileRef : null}
                onClick={() => onSelectDate(date)}
                aria-pressed={isSelected}
                className={`flex w-12 flex-col items-center gap-1 rounded-lg py-2 transition-colors ${
                  isSelected ? 'bg-primary text-white' : 'text-gray-400'
                }`}
              >
                <span className="text-[10px]">{weekday}</span>
                <span className="text-sm font-medium">{dayOfMonth}</span>
                <span
                  className={`size-1 rounded-full ${isSelected ? 'bg-white' : 'bg-transparent'}`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default WeekStrip;