import { useState } from "react";
import { ChevronLeft, ChevronRight } from "./icons";
import { toDateStr, MONTHS_ES, DAYS_ES } from "../../shared/utils/dateHelpers";

interface MiniCalendarProps {
  label: string;
  selected: string;
  rangeStart: string;
  rangeEnd: string;
  onSelect: (date: string) => void;
  initYear: number;
  initMonth: number;
}

export function MiniCalendar({
  label,
  selected,
  rangeStart,
  rangeEnd,
  onSelect,
  initYear,
  initMonth,
}: MiniCalendarProps) {
  const [viewYear, setViewYear] = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);

  const today = new Date();
  const todayStr = toDateStr(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayRaw = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const firstDayMon = (firstDayRaw + 6) % 7; // 0=Mon

  const cells: (number | null)[] = [
    ...Array(firstDayMon).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  return (
    <div className="flex flex-col gap-2 w-[200px]">
      {/* Label */}
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
        {label}
      </span>

      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-all focus:outline-none"
        >
          <ChevronLeft />
        </button>
        <span className="text-sm font-semibold text-slate-900 select-none">
          {MONTHS_ES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-all focus:outline-none"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7">
        {DAYS_ES.map((d, i) => (
          <div
            key={i}
            className="h-7 flex items-center justify-center text-xs font-medium text-slate-400 select-none"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="h-8" />;
          const dateStr = toDateStr(viewYear, viewMonth, day);
          const isSelected = selected === dateStr;
          const isToday = dateStr === todayStr;
          const inRange =
            rangeStart &&
            rangeEnd &&
            dateStr > rangeStart &&
            dateStr < rangeEnd;
          const isRangeStart = rangeStart && dateStr === rangeStart && rangeEnd;
          const isRangeEnd = rangeEnd && dateStr === rangeEnd && rangeStart;

          return (
            <div
              key={i}
              className={`h-8 flex items-center justify-center
              ${inRange ? "bg-blue-50" : ""}
              ${isRangeStart ? "bg-blue-50 rounded-l-full" : ""}
              ${isRangeEnd ? "bg-blue-50 rounded-r-full" : ""}
            `}
            >
              <button
                type="button"
                onClick={() => onSelect(dateStr)}
                className={`w-8 h-8 flex items-center justify-center text-sm rounded-full transition-all focus:outline-none
                  ${
                    isSelected
                      ? "bg-blue-600 text-white font-semibold"
                      : isToday
                        ? "border border-blue-400 text-blue-600 font-medium hover:bg-blue-50"
                        : "text-slate-700 hover:bg-slate-100"
                  }`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
