"use client";

import { serverDeleteRoute } from "@/app/api/project/delete_route";
import { serverUpdatePin } from "@/app/api/project/update_pin";
import { serverUpdateProject } from "@/app/api/project/update_project";
import { serverUpdateRoute } from "@/app/api/project/update_route";
import { HereMultimodalRouteSection } from "@/app/api/routes/here_multimodal";
import { MAP_UI_PADDING_VALUES } from "@/app/utils/consts";
import { projectEmitter } from "@/app/utils/controllers/project_controller";
import { allEqual } from "@/app/utils/logic/all_equal";
import { AppUser } from "@/backend/auth/get_user";
import { mapController, MapMarker, MapProject } from "@/components/global_map";
import ItineraryComponent from "@/components/itinerary_component";
import MapControlsComponent from "@/components/map_controls_component";
import Navbar from "@/components/navbar";
import ProjectNavbarComponent from "@/components/project_navbar_component";
import ProjectSharePopup from "@/components/project_share_popup";
import RoutePlanningComponent from "@/components/route_planning_component";
import GeneralSearchComponent from "@/components/search_general";
import { decode } from "@here/flexpolyline";
import { Prisma } from "@prisma/client";
import { RiLoaderFill } from "@remixicon/react";
import { bbox, points } from "@turf/turf";
import _, { initial, set } from "lodash";
import { LngLatBounds } from "mapbox-gl";
import { Metadata } from "next";
import { useEffect, useState } from "react";

export const metadata: Metadata = {
  title: "",
}

export type ProjectFunctionOpenRoutePlanner = (from: MapMarker | null) => void;
export type ProjectFunctionOpenExistingRoute = (
  route: Prisma.RouteGetPayload<any>,
) => void;
export type ProjectFunctionUpdateProject = (
  updatedProject: MapProject | ((existing: MapProject) => MapProject),
) => void;

const clientThrottleTimeMs = 200;
const serverThrottleTimeMs = 1000;

let serverUpdateKey = 1;
let clientUpdateKey = 1;

let projectLastServerCopy: MapProject | null = null;

export default function ProjectPageContent({
  project,
  user,
  initialMapBounds,
}: {
  project: MapProject;
  user: AppUser | null;
  initialMapBounds?: number[];
}) {
  // TODO: This should always be the most up-to-date instance of the project
  const [currentProject, setCurrentProject] = useState<MapProject>(project);

  const [serverOperationsInProgress, setServerOperationsInProgress] =
    useState<number>(0);

  const [routePlannerOrigin, setRoutePlannerOrigin] =
    useState<MapMarker | null>(null);

  const [routePlannerExistingRoute, setRoutePlannerExistingRoute] =
    useState<Prisma.RouteGetPayload<any> | null>(null);

  const [mapRotation, setMapRotation] = useState<number>(0);

  const [sideBarOpen, setSidebarOpen] = useState<boolean>(true);

  

  useEffect(() => {
    // Update the map padding
    mapController.setPadding((p) => ({
      ...p,
      right: sideBarOpen ? MAP_UI_PADDING_VALUES.ITINERARY_PANEL : 0,
    }));
  }, [sideBarOpen]);

  const openRoutePlanner: ProjectFunctionOpenRoutePlanner = (
    from: MapMarker | null,
  ) => {
    setRoutePlannerExistingRoute(null);
    setRoutePlannerOrigin(from);
  };

  const openExistingRoute: ProjectFunctionOpenExistingRoute = (
    route: Prisma.RouteGetPayload<any>,
  ) => {
    setRoutePlannerOrigin(null);
    setRoutePlannerExistingRoute(route);
  };

  const clientUpdate = (updatedProject: MapProject) => {
    setCurrentProject(updatedProject);
    mapController.setProject(updatedProject);
    console.log("updating project");
  };

  const serverUpdate = async (updatedProject: MapProject) => {
    if (_.isEqual(projectLastServerCopy, updatedProject)) {
      return;
    }

    setServerOperationsInProgress((v) => v + 1);
    console.log("Syncing project to server...");

    try {
      // General Project Updates
      if (
        !allEqual(
          [projectLastServerCopy, updatedProject].map((c) => ({
            name: c?.name,
            description: c?.description,
            public: c?.public
          })),
        )
      ) {
        console.log("Updating project information");
        await serverUpdateProject(updatedProject);
      }
      // Determine changes to pins
      for (const updatedPin of updatedProject.pins) {
        const lastPin = projectLastServerCopy?.pins.find(
          (p) => p.id === updatedPin.id,
        );
        if (lastPin && !_.isEqual(lastPin, updatedPin)) {
          // Sync this pin to the server
          console.log("Updating pin on the server:", updatedPin.name);
          await serverUpdatePin(updatedPin.id, updatedPin);
        }
      }
      // TODO: Handle deleting pins
      // Handle Updating Routes
      for (const updatedRoute of updatedProject.routes) {
        const lastRoute = projectLastServerCopy?.routes.find(
          (r) => r.id === updatedRoute.id,
        );
        if (lastRoute && !_.isEqual(lastRoute, updatedRoute)) {
          // Sync this route to the server
          console.log("Updating route on the server:", updatedRoute.name);
          await serverUpdateRoute(updatedRoute.id, updatedRoute);
        }
      }
      // Handle Deleting Routes
      for (const lastRoute of projectLastServerCopy?.routes || []) {
        const updatedRoute = updatedProject.routes.find(
          (r) => r.id === lastRoute.id,
        );
        if (!updatedRoute) {
          // This route was deleted
          console.log("Deleting route on the server:", lastRoute.name);
          // await serverDeleteRoute(lastRoute.id);
          await serverDeleteRoute(updatedProject.id, lastRoute.id);
        }
      }
    } catch (err) {
      console.error("Error syncing project to server:", err);
    }

    console.log("Finished syncing project to server");
    setServerOperationsInProgress((v) => v - 1);
    // console.log(JSON.stringify(updatedProject));
    // console.log(JSON.stringify(projectLastServerCopy));
    projectLastServerCopy = updatedProject;
  };

  const updateProject = (
    updates: MapProject | ((existing: MapProject) => MapProject),
  ) => {
    // console.log("Updating project in ProjectPageContent", updatedProject);
    // TODO: This is where we sync with the map controller as well

    const updatedProjectObj: MapProject =
      typeof updates === "function" ? updates(currentProject) : updates;

    console.log("updating project", updatedProjectObj);

    clientUpdateKey = (clientUpdateKey + 1) % 0xfff;
    const clientKey = clientUpdateKey;
    setTimeout(() => {
      if (clientKey === clientUpdateKey) clientUpdate(updatedProjectObj);
    }, clientThrottleTimeMs);

    serverUpdateKey += (clientUpdateKey + 1) % 0xfff;
    const serverKey = serverUpdateKey;
    setTimeout(() => {
      if (serverKey === serverUpdateKey) serverUpdate(updatedProjectObj);
    }, serverThrottleTimeMs);
  };

  useEffect(() => {
    projectLastServerCopy = project;

    mapController.setProject(project);

    // Set initial map padding
    mapController.setPadding(() => ({
      right: MAP_UI_PADDING_VALUES.ITINERARY_PANEL,
      left: 0,
      top: MAP_UI_PADDING_VALUES.NAVBAR,
      bottom: 0,
    }));

    if (initialMapBounds) {
      if (
        initialMapBounds[0] == initialMapBounds[2] &&
        initialMapBounds[1] == initialMapBounds[3]
      ) {
        mapController.flyTo(
          {
            center: [initialMapBounds[0], initialMapBounds[1]],
            zoom: 8,
            pitch: 0,
            bearing: 0,
            duration: 5000
          }
        );
      } else {
        mapController.flyToBounds(
          new LngLatBounds(
            [initialMapBounds[0], initialMapBounds[1]],
            [initialMapBounds[2], initialMapBounds[3]],
          ),
          5000,
        );
      }
    } else {
      // Default pan
      mapController.flyTo({
        center: [0, 0],
        zoom: 2,
        bearing: 0,
        pitch: 0,
        duration: 5000,
      });
    }

    // Listen for project events
    // These events will only be dispatched from the map component and its children
    // because they exist in a different context and cannot directly call functions here
    const openExistingRouteProxy = (event: Event) => {
      const customEvent = event as CustomEvent;
      openExistingRoute(customEvent.detail);
    };
    projectEmitter.addEventListener(
      "open-existing-route",
      openExistingRouteProxy,
    );

    const openRoutePlannerProxy = (event: Event) => {
      const customEvent = event as CustomEvent;
      openRoutePlanner(customEvent.detail);
    };
    projectEmitter.addEventListener(
      "open-route-planner",
      openRoutePlannerProxy,
    );

    const didUpdateProjectProxy = (event: Event) => {
      const customEvent = event as CustomEvent;
      updateProject(customEvent.detail);
    };
    projectEmitter.addEventListener("update-project", didUpdateProjectProxy);

    const didUpdateRotationProxy = (event: Event) => {
      const customEvent = event as CustomEvent;
      setMapRotation(customEvent.detail);
    };
    projectEmitter.addEventListener("rotate-map", didUpdateRotationProxy);

    return () => {
      projectEmitter.removeEventListener(
        "open-existing-route",
        openExistingRouteProxy,
      );
      projectEmitter.removeEventListener(
        "open-route-planner",
        openRoutePlannerProxy,
      );
      projectEmitter.removeEventListener(
        "update-project",
        didUpdateProjectProxy,
      );
      projectEmitter.removeEventListener("rotate-map", didUpdateRotationProxy);
    };
  }, [project]);

  // Functions that this component provides to its children
  // - updateProject
  // - setProject
  // - openRoutePlanner
  // - closeRoutePlanner
  // - openExistingRoute
  // - closeExistingRoute

  return (
    <>
      
      <div className="fade-in fixed top-0 left-0 right-0 z-40">
        <Navbar user={user}>
          <ProjectNavbarComponent
            currentUser={user ?? undefined}
            project={currentProject}
            serverOperationsInProgress={serverOperationsInProgress}
            updateProject={updateProject}
          />
        </Navbar>
      </div>

      <div className="fixed size-full pointer-events-none fade-in">
        <div
          className="absolute size-full pointer-events-none transition-transform duration-300"
          style={{
            transform: sideBarOpen
              ? "translateX(0)"
              : "translateX(calc(272px + 8px))",
          }}
        >
          <MapControlsComponent
            mapRotation={mapRotation}
            setSidebarOpen={setSidebarOpen}
            sidebarOpen={sideBarOpen}
          />
          <div
            className={`transition-opacity ${
              sideBarOpen ? "opacity-100" : "opacity-0 delay-150"
            }`}
          >
            <ItineraryComponent
              project={currentProject}
              openExistingRoute={openExistingRoute}
            />
          </div>
        </div>

        <GeneralSearchComponent
          hide={routePlannerOrigin != null || routePlannerExistingRoute != null}
          project={currentProject}
        />
        {(routePlannerOrigin || routePlannerExistingRoute) && (
          <RoutePlanningComponent
            key={`${routePlannerOrigin?.id}-${routePlannerExistingRoute?.id}`}
            project={currentProject}
            initialFrom={routePlannerOrigin ?? undefined}
            showingDbRoute={routePlannerExistingRoute ?? undefined}
            openRoutePlanner={openRoutePlanner}
            updateProject={updateProject}
          />
        )}
      </div>
    </>
  );
}
