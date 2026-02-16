import { MapPin, MapProject, MapRoute } from "@/components/global_map";
import { DateTime } from "luxon";

export const calendarDayDifference = (a: DateTime, b: DateTime) => {
  let [start, end, inverse, acc] = [a, b, false, 1];
  if (b.diff(a, "milliseconds").milliseconds < 0)
    [start, end, inverse, acc] = [b, a, true, -1];

  while (
    !start.hasSame(end, "day") ||
    !start.hasSame(end, "month") ||
    !start.hasSame(end, "year")
  ) {
    acc += 1;
    start = start.plus({ days: 1 });
  }

  return inverse ? 0 - acc : acc;
};

export const firstDateForProject = (project: MapProject | undefined): DateTime | undefined => {
  if (!project) return;
  const firstActivity = [...project.pins, ...project.routes].sort((a, b) => {
    if (a.dateStart && b.dateStart) {
      return a.dateStart.getTime() - b.dateStart.getTime();
    } else if (a.dateStart) {
      return -1;
    } else if (b.dateStart) {
      return 1;
    } else {
      return 0;
    }
  })[0];
  if (!firstActivity?.dateStart) return;
  return DateTime.fromJSDate(firstActivity.dateStart, { zone: (firstActivity as MapPin).zoneName ?? (firstActivity as MapRoute).zoneStart })
};
