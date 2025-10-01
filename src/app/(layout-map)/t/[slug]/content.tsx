"use client";

import { projectEmitter } from "@/app/utils/controllers/project_controller";
import { mapController, MapMarker, MapProject } from "@/components/global_map";
import ItineraryComponent from "@/components/itinerary_component";
import RoutePlanningComponent from "@/components/route_planning_component";
import GeneralSearchComponent from "@/components/search_general";
import { EasingOptions } from "mapbox-gl";
import { useEffect, useState } from "react";

export default function ProjectPageContent({
  project,
}: {
  project: MapProject;
}) {

  const [routePlannerOrigin, setRoutePlannerOrigin] = useState<MapMarker | null>(null);

  useEffect(() => {
    mapController.setProject(project);

    mapController.flyTo({
      center: [4.996, 52.26],
      zoom: 10,
      bearing: 0,
      pitch: 0,
      duration: 5000,
      padding: {
        top: 64,
        left: 0,
        right: 8 + 272 + 8,
        bottom: 0,
      },
    });

    const openRoutePlanner = (event: CustomEventInit<MapMarker | null>) => {
      console.log("open-route-planner", event.detail);
      setRoutePlannerOrigin(event.detail ?? null);
    };

    projectEmitter.addEventListener("open-route-planner", openRoutePlanner);

    return () => {
      projectEmitter.removeEventListener(
        "open-route-planner",
        openRoutePlanner
      );
    };
  }, [project]);

  return (
    <>
      <div className="fixed size-full pointer-events-none [&>*]:pointer-events-auto fade-in">
        <GeneralSearchComponent hide={routePlannerOrigin != null} project={project} />
        <ItineraryComponent project={project} />
        {routePlannerOrigin && (
          <RoutePlanningComponent project={project} initialFrom={routePlannerOrigin} />
        )}
      </div>
    </>
  );
}
