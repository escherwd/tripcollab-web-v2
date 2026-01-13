"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import { MapProject } from "./global_map";
import PanelIconButton from "./panel_icon_button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";

const offset = (arr: any[], offset: number) => [
  ...arr.slice(offset),
  ...arr.slice(0, offset),
];

export default function CalendarComponent({
  project,
  dense = false,
  initialAnchorDate = DateTime.now().startOf("month"),
  allowRange = false,
  date = null,
  initialNumDays = 0,
  onDateChange,
  // onNumDaysChange,
  readonly = false,
}: {
  project?: MapProject | null;
  dense?: boolean;
  initialAnchorDate?: DateTime;
  allowRange?: boolean;
  date?: DateTime | null;
  initialNumDays?: number;
  onDateChange?: (date?: DateTime | null, numDays?: number) => void;
  // onNumDaysChange?: (numDays: number) => void;
  readonly?: boolean;
}) {
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  useEffect(() => {
    if (!project) return;
    // Calculate the date range based on pins
    const pinDates = project.pins
      .map((pin) => {
        if (!pin.dateStart) return [];
        if (pin.duration && pin.duration > 0)
          return [
            DateTime.fromJSDate(pin.dateStart),
            DateTime.fromJSDate(pin.dateStart).plus({ minutes: pin.duration }),
          ];
        else return [DateTime.fromJSDate(pin.dateStart)];
      })
      .flat()
      .sort((a, b) => a.toMillis() - b.toMillis());

    if (
      pinDates.length > 1 &&
      !pinDates[0].hasSame(pinDates[pinDates.length - 1], "day")
    ) {
      const start = pinDates[0].toISODate();
      const end = pinDates[pinDates.length - 1].toISODate();
      if (start && end) setDateRange({ start, end });
    }
  }, [project]);

  const [anchorDate, setAnchorDate] = useState(initialAnchorDate);

  const [selectedDate, setSelectedDate] = useState<DateTime | null>(date);

  const locale = new Intl.Locale("en-US");

  const localeWeekStart = useCallback(() => {
    try {
      // @ts-expect-error - getWeekInfo is almost baseline, I think Firefox is the only browser that doesn't support it
      return locale.getWeekInfo()?.firstDay ?? 7;
    } catch (_) {
      return 7;
    }
  }, []);

  const dayArray = useMemo(() => {
    const firstOfMonth = anchorDate.startOf("month");
    const previousMonth = anchorDate.minus({ months: 1 }).startOf("month");

    const firstWeekday = firstOfMonth.weekday + ((7 - localeWeekStart()) % 7);

    return [
      ...Array.from(
        { length: firstWeekday },
        (_, index) => (previousMonth.daysInMonth ?? 31) - index
      )
        .reverse()
        .map((day) => ({
          day,
          primaryMonth: false,
          isoDate: previousMonth.plus({ days: day - 1 }).toISODate(),
        })),
      ...Array.from(
        { length: firstOfMonth.daysInMonth ?? 31 },
        (_, index) => index + 1
      ).map((day) => ({
        day,
        primaryMonth: true,
        isoDate: firstOfMonth.plus({ days: day - 1 }).toISODate(),
      })),
      ...Array.from(
        { length: 42 - (firstOfMonth.daysInMonth ?? 31) - (firstWeekday ?? 0) },
        (_, index) => index + 1
      ).map((day) => ({
        day,
        primaryMonth: false,
        isoDate: firstOfMonth.plus({ days: day - 1, months: 1 }).toISODate(),
      })),
    ];
  }, [anchorDate, localeWeekStart]);

  const setDate = (isoDate: string | null) => {
    if (readonly) return;
    setSelectedDate(isoDate ? DateTime.fromISO(isoDate) : null);
    if (onDateChange) {
      onDateChange(isoDate ? DateTime.fromISO(isoDate) : null);
    }
  };

  const [isoDateDragStart, setIsoDateDragStart] = useState<string | null>(null);
  const [numDays, setNumDays] = useState<number>(initialNumDays);

  const startDrag = (isoDate: string) => {
    console.log("calendar drag start");
    setIsoDateDragStart(isoDate);
    if (allowRange) {
      setDate(isoDate);
      setNumDays(0);
    }
  };

  const whileDrag = (isoDate: string, up: boolean = false) => {
    if (allowRange && isoDateDragStart) {
      const start = DateTime.fromISO(isoDateDragStart);
      const end = DateTime.fromISO(isoDate);
      const numDays = end.diff(start, "days").days;
      setNumDays(numDays);
      console.log(
        "Selected ",
        numDays,
        " days from ",
        isoDateDragStart,
        " to ",
        isoDate
      );
    }
    if (up) {
      let selectedDate = isoDateDragStart
        ? DateTime.fromISO(isoDateDragStart)
        : DateTime.fromISO(isoDate);
      let localNumDays = numDays;
      if (allowRange && isoDateDragStart && numDays < 0) {
        // Swap start and end
        const start = DateTime.fromISO(isoDate);

        localNumDays = -numDays;
        setNumDays(localNumDays);
        setDate(start.toISODate());
        selectedDate = start;
      }
      setIsoDateDragStart(null);
      if (onDateChange) onDateChange(selectedDate, localNumDays);
      console.log("calendar drag end");
      return;
    }
  };

  const dateClasses = useCallback(
    (isoDate: string) => {
      if (!selectedDate) return "";
      if (!allowRange || numDays === 0) {
        return isoDate === selectedDate.toISODate()
          ? "bg-gray-950 text-white"
          : "";
      }
      const diff = DateTime.fromISO(isoDate).diff(selectedDate).as("days");
      const leftSideCap =
        "bg-gray-950 text-white rounded-l-full rounded-none w-full";
      const rightSideCap =
        "bg-gray-950 text-white rounded-r-full rounded-none w-full";
      const middle = "bg-gray-950 text-white rounded-none w-full";
      // Positive direction range
      if (diff >= 0 && diff <= numDays) {
        if (diff === 0) {
          return leftSideCap;
        } else if (diff === numDays) {
          return rightSideCap;
        } else {
          return middle;
        }
      }
      // Negative direction range
      if (diff <= 0 && diff >= numDays) {
        if (diff === 0) {
          return rightSideCap;
        } else if (diff === numDays) {
          return leftSideCap;
        } else {
          return middle;
        }
      }
      return "";
    },
    [selectedDate, numDays, allowRange]
  );

  return (
    <div className="flex-grow-0 w-full h-full flex flex-col !pointer-events-auto select-none">
      <div
        className={`tc-panel-header ${dense ? "tc-panel-header-dense" : ""}`}
      >
        <div
          className={`tc-panel-title ${
            dense ? "tc-panel-title-dense" : ""
          } flex-1`}
        >
          {anchorDate.toLocaleString({ month: "long" })}
        </div>
        <div className={`font-display text-gray-500 ${dense ? "text-sm" : ""}`}>
          {anchorDate.year}
        </div>
        <div className="flex gap-1">
          <PanelIconButton
            className={`${dense ? "" : ""}`}
            icon={<ArrowLeftIcon />}
            onClick={() => {
              setAnchorDate(anchorDate.minus({ months: 1 }));
            }}
          />
          <PanelIconButton
            className={`${dense ? "" : ""}`}
            icon={<ArrowRightIcon />}
            onClick={() => {
              setAnchorDate(anchorDate.plus({ months: 1 }));
            }}
          />
        </div>
      </div>
      <div
        className={`grid grid-cols-7 text-center ${
          dense ? "pt-1 pb-0.5" : "pt-2 pb-1"
        }`}
      >
        {offset(
          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          localeWeekStart() - 1
        ).map((weekday) => (
          <div key={weekday} className="text-xs font-display text-gray-400">
            {weekday}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 size-full cursor-pointer relative gap-y-0.5">
        {dayArray.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-center relative"
            // onClick={() => setDate(day.isoDate)}
            onMouseDown={() => startDrag(day.isoDate!)}
            onMouseEnter={() => whileDrag(day.isoDate!)}
            onMouseUp={() => whileDrag(day.isoDate!, true)}
          >
            <div
              className={`text-xs font-mono rounded-full flex items-center justify-center  z-10 ${dateClasses(
                day.isoDate!
              )} ${day.primaryMonth ? "text-gray-500" : "text-gray-400"} ${
                dense ? "size-6" : "size-7"
              }`}
            >
              {day.day}
            </div>
            {dateRange &&
              (day.isoDate ?? "") >= dateRange.start &&
              (day.isoDate ?? "") <= dateRange.end && (
                <div
                  className={`absolute inset-x-0 inset-y-auto h-6 bg-gray-200/50 ${
                    day.isoDate === dateRange.start ? "rounded-l-full" : ""
                  } ${day.isoDate === dateRange.end ? "rounded-r-full" : ""}`}
                />
              )}
          </div>
        ))}
      </div>
      {allowRange && (
        <div className="text-xs italic text-gray-400 pt-0.5 pb-1.5 text-center">
          Tip: drag for multiple days
        </div>
      )}
    </div>
  );
}
