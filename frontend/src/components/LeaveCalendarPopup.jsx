import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

/*
  LeaveCalendarPopup
  ------------------
  Hover over an employee to show their leave calendar.

  leaveStart = "2026-08-22"
  leaveEnd   = "2026-08-27"

  National/public holidays are configurable below.
*/

const NATIONAL_HOLIDAYS = {
  "2026-01-26": "Republic Day",
  "2026-03-04": "Holi",
  "2026-04-03": "Good Friday",
  "2026-04-14": "Ambedkar Jayanti",
  "2026-05-01": "May Day",
  "2026-08-15": "Independence Day",
  "2026-10-02": "Gandhi Jayanti",
  "2026-10-20": "Dussehra",
  "2026-11-08": "Diwali",
  "2026-11-24": "Guru Nanak Jayanti",
  "2026-12-25": "Christmas",
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isDateBetween(date, start, end) {
  if (!start || !end) return false;

  const current = formatDate(date);

  return current >= start && current <= end;
}

function CalendarMonth({
  monthDate,
  leaveStart,
  leaveEnd,
}) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startingDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const cells = [];

  // Empty cells before month starts
  for (let i = 0; i < startingDay; i++) {
    cells.push(
      <div
        key={`empty-${i}`}
        className="h-8 w-8"
      />
    );
  }

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    const dateKey = formatDate(date);

    const isLeave = isDateBetween(
      date,
      leaveStart,
      leaveEnd
    );

    const holidayName =
      NATIONAL_HOLIDAYS[dateKey];

    const isHoliday = Boolean(holidayName);

    const isToday =
      formatDate(new Date()) === dateKey;

    cells.push(
      <div
        key={dateKey}
        title={
          isLeave
            ? "Employee Leave"
            : isHoliday
            ? holidayName
            : ""
        }
        className={`
          relative h-8 w-8
          flex items-center justify-center
          rounded-full text-xs
          transition-all duration-150
          cursor-default

          ${
            isLeave
              ? "bg-red-500 text-white font-semibold shadow-sm"
              : isHoliday
              ? "bg-blue-500 text-white font-semibold"
              : isToday
              ? "border border-primary-500 text-primary-600 font-semibold"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
          }
        `}
      >
        {day}

        {isHoliday && !isLeave && (
          <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-white" />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map(
          (day, index) => (
            <div
              key={`${day}-${index}`}
              className="h-7 w-8 flex items-center justify-center text-[10px] font-semibold text-gray-400"
            >
              {day}
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells}
      </div>
    </div>
  );
}

export default function LeaveCalendarPopup({
  employee,
  leaveStart,
  leaveEnd,
}) {
  const [monthDate, setMonthDate] = useState(
    leaveStart
      ? new Date(`${leaveStart}T00:00:00`)
      : new Date()
  );

  const monthName = useMemo(
    () =>
      monthDate.toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      }),
    [monthDate]
  );

  const previousMonth = () => {
    setMonthDate(
      new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setMonthDate(
      new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        1
      )
    );
  };

  return (
    <div
      className="
        absolute
        left-0
        top-full
        mt-2
        z-[100]
        w-[290px]
        rounded-2xl
        border
        border-gray-200
        dark:border-white/10
        bg-white
        dark:bg-[#111827]
        shadow-2xl
        p-4
        animate-in
        fade-in
        zoom-in-95
        duration-150
      "
      onMouseEnter={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays
              size={16}
              className="text-primary-600"
            />

            <p className="font-semibold text-sm text-gray-800 dark:text-white">
              {employee?.name || "Employee"}
            </p>
          </div>

          <p className="text-[11px] text-gray-400 mt-1">
            Leave calendar
          </p>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={previousMonth}
          className="
            p-1.5
            rounded-lg
            hover:bg-gray-100
            dark:hover:bg-white/10
            text-gray-500
          "
        >
          <ChevronLeft size={16} />
        </button>

        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {monthName}
        </p>

        <button
          type="button"
          onClick={nextMonth}
          className="
            p-1.5
            rounded-lg
            hover:bg-gray-100
            dark:hover:bg-white/10
            text-gray-500
          "
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Calendar */}
      <CalendarMonth
        monthDate={monthDate}
        leaveStart={leaveStart}
        leaveEnd={leaveEnd}
      />

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/10">
        <div className="flex items-center gap-4 text-[10px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span>Leave</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span>Holiday</span>
          </div>
        </div>
      </div>

      {/* Leave information */}
      {leaveStart && leaveEnd && (
        <div className="mt-3 rounded-xl bg-red-50 dark:bg-red-500/10 p-2.5">
          <p className="text-[10px] font-medium text-red-500">
            Leave Period
          </p>

          <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
            {new Date(
              `${leaveStart}T00:00:00`
            ).toLocaleDateString("en-IN")}{" "}
            →{" "}
            {new Date(
              `${leaveEnd}T00:00:00`
            ).toLocaleDateString("en-IN")}
          </p>
        </div>
      )}
    </div>
  );
}