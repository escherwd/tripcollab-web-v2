'use client'

import { MapMarker, MapProject } from "@/components/global_map";
import { Prisma } from "@prisma/client";

// Create a global event emitter for projects
export const projectEmitter = new EventTarget();

// class ProjectController {
//   openRoutePlanner(fromOrigin: MapMarker | null) {
//     projectEmitter.dispatchEvent(
//       new CustomEvent("open-route-planner", { detail: fromOrigin })
//     );
//   }

//   openExistingRoute(dbRoute: Prisma.RouteGetPayload<any>) {
//     projectEmitter.dispatchEvent(
//       new CustomEvent("open-existing-route", { detail: dbRoute })
//     );
//   }
// }

// // Simply acts as an interface between components and the current ProjectPage instance (whatever (if any) is currently mounted)
// export const projectController = new ProjectController();

export type MapRightClickEvent = {
  x: number,
  y: number, 
  lat: number,
  lng: number,
}

class ProjectEventReceiver {

  didClickExistingRoute(dbRoute: Prisma.RouteGetPayload<any>) {
    projectEmitter.dispatchEvent(
      new CustomEvent("open-existing-route", { detail: dbRoute })
    );
  }

  didClickRoutePlanner(fromOrigin: MapMarker | null, toDestination: MapMarker | null = null) {
    projectEmitter.dispatchEvent(
      new CustomEvent("open-route-planner", { detail: { fromOrigin, toDestination } })
    );
  }

  didUpdateProject(updatedProject: MapProject) {
    projectEmitter.dispatchEvent(
      new CustomEvent("update-project", { detail: updatedProject })
    );
  }

  didUpdateMapRotation(rotation: number) {
    projectEmitter.dispatchEvent(
      new CustomEvent("rotate-map", { detail: rotation })
    );
  }

  didRightClickMap(event: MapRightClickEvent) {
    projectEmitter.dispatchEvent(
      new CustomEvent("map-right-click", { detail: event})
    )
  }
}

export const projectEventReceiver = new ProjectEventReceiver();