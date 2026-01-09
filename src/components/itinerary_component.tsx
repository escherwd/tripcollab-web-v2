"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import { MapProject } from "./global_map";
import PanelIconButton from "./panel_icon_button";
import CalendarComponent from "./calendar_component";
import ActivityListComponent from "./activity_list_component";
import { ProjectFunctionOpenExistingRoute } from "@/app/(layout-map)/t/[slug]/content";
import { DateTime } from "luxon";

export default function ItineraryComponent({
  project,
  openExistingRoute,
}: {
  project?: MapProject | null;
  openExistingRoute: ProjectFunctionOpenExistingRoute;
}) {
  if (!project) return <></>;

  const firstPin = project.pins.sort((a, b) => {
    if (a.dateStart && b.dateStart) {
      return a.dateStart.getTime() - b.dateStart.getTime();
    } else if (a.dateStart) {
      return -1;
    } else if (b.dateStart) {
      return 1;
    } else {
      return 0;
    }
  })[0]

  const anchorDate = DateTime.fromJSDate(firstPin?.dateStart ?? new Date());

  return (
    <div className="absolute flex flex-col gap-2 bottom-9 top-navbar right-2 w-68 !pointer-events-none">
      <div className="flex-1 min-h-0">
        <ActivityListComponent project={project} openExistingRoute={openExistingRoute} />
      </div>
      <div className="tc-panel flex-shrink-0 h-68">
        <CalendarComponent project={project} initialAnchorDate={anchorDate} />
      </div>
    </div>
  );
}
