'use client'

import { MapMarker } from "@/components/global_map";

// Create a global event emitter for projects
export const projectEmitter = new EventTarget();

class ProjectController {
  openRoutePlanner(fromOrigin: MapMarker | null) {
    projectEmitter.dispatchEvent(
      new CustomEvent("open-route-planner", { detail: fromOrigin })
    );
  }
}

// Simply acts as an interface between components and the current ProjectPage instance (whatever (if any) is currently mounted)
export const projectController = new ProjectController();