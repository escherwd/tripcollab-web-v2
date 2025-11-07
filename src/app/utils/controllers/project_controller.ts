'use client'

import { MapMarker } from "@/components/global_map";
import { Prisma } from "@prisma/client";

// Create a global event emitter for projects
export const projectEmitter = new EventTarget();

class ProjectController {
  openRoutePlanner(fromOrigin: MapMarker | null) {
    projectEmitter.dispatchEvent(
      new CustomEvent("open-route-planner", { detail: fromOrigin })
    );
  }

  openExistingRoute(dbRoute: Prisma.RouteGetPayload<any>) {
    projectEmitter.dispatchEvent(
      new CustomEvent("open-existing-route", { detail: dbRoute })
    );
  }
}

// Simply acts as an interface between components and the current ProjectPage instance (whatever (if any) is currently mounted)
export const projectController = new ProjectController();