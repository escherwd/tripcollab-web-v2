import { DateTime } from "luxon";

export const calendarDayDifference = (a: DateTime, b: DateTime) => {
  let [start, end, inverse, acc] = [a, b, false, 1];
  if (b.diff(a, "milliseconds").milliseconds < 0) [start, end, inverse, acc] = [b, a, true, -1];

  while (
    !start.hasSame(end, "day") ||
    !start.hasSame(end, "month") ||
    !start.hasSame(end, "year")
  ) {
    acc += 1;
    start = start.plus({ days: 1 });
  }

  return inverse ? (0 - acc) : acc;
};
