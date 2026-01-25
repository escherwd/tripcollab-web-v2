import { MapProject } from "@/components/global_map";

export const calculateStartFor = (project: MapProject) =>
  [...project.pins, ...project.routes].reduce(
    (acc, entry) => {
      if (!acc) return entry.dateStart?.getTime();
      if (!entry.dateStart) return acc;
      return entry.dateStart?.getTime() < acc
        ? entry.dateStart?.getTime()
        : acc;
    },
    undefined as number | undefined,
  );
