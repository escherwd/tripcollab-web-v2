import { HereMultimodalRoute } from "@/app/api/routes/here_multimodal";
import { MapMarker, MapProject } from "./global_map";
import { Prisma } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { serverAddRoute } from "@/app/api/project/add_route";
import { RiLoaderFill } from "@remixicon/react";
import { TrashIcon } from "@heroicons/react/16/solid";
import ColorInput from "./color_input";
import { ProjectFunctionUpdateProject } from "@/app/(layout-map)/t/[slug]/content";
import { hereMultimodalRouteSectionsToFeatures } from "@/app/utils/backend/here_route_sections_to_features";

export default function RoutePlanningCustomizer({
  project,
  route,
  initialDBRoute,
  from,
  to,
  updateProject,
  updateRouteId,
}: {
  project: MapProject;
  route: HereMultimodalRoute;
  initialDBRoute?: Prisma.RouteGetPayload<any>;
  from: MapMarker;
  to: MapMarker;
  updateProject: ProjectFunctionUpdateProject;
  updateRouteId: (id: string) => void;
}) {
  const [dbRoute, setDbRoute] = useState<
    Prisma.RouteGetPayload<any> | undefined
  >(initialDBRoute);

  const [isAddingRoute, setIsAddingRoute] = useState(false);

  const [routeName, setRouteName] = useState(dbRoute?.name);
  const [routeColor, setRouteColor] = useState(dbRoute?.styleData?.color);

  const shouldIgnoreUpdates = useRef(false);

  const addRouteToProject = async (route: HereMultimodalRoute) => {
    if (!project.id || !from || !to) return;

    if (dbRoute) return;

    if (isAddingRoute) return; // Prevent multiple clicks
    setIsAddingRoute(true);

    try {
      const newDbRoute = await serverAddRoute(
        project.id,
        from,
        to,
        route.modality,
        route
      );
      setDbRoute(newDbRoute);
      // Update the name and color state
    //   shouldIgnoreUpdates.current = true;
    //   setRouteName(newDbRoute.name);
    //   setRouteColor(newDbRoute.styleData?.color);
    //     shouldIgnoreUpdates.current = false;

      // Update the project with the new route
      updateProject({
        ...project,
        routes: [...project.routes, newDbRoute],
      });

      // Display the newly added route (updates the id to match the dbRoute)
      updateRouteId(newDbRoute.id);
    } catch (err) {
      console.error("Error adding route to project:", err);
    }

    setIsAddingRoute(false);
  };

  useEffect(() => {
    if (shouldIgnoreUpdates.current) return;
    updateProject({
      ...project,
      // @ts-expect-error Complains about name and color being possibly undefined, but that's okay
      routes: project.routes.map((r) => {
        if (r.id === dbRoute?.id) {
          return {
            ...r,
            name: (routeName ?? "") == "" ? undefined : routeName,
            styleData: {
              ...r.styleData,
              color: routeColor ?? undefined,
            },
          };
        }
        return r;
      }),
    });
  }, [routeName, routeColor]);

  const placeHolderRouteName =
    (from.appleMapsPlace?.name &&
      to.appleMapsPlace?.name &&
      `${from.appleMapsPlace?.name} to ${to.appleMapsPlace?.name}`) ||
    "New Route";

  const deleteRoute = () => {
    console.log("Deleting route from project:", dbRoute?.id);
    // These have to go before updateProject to ensure the project instance 
    // without the route is the last thing the controller receives
    // shouldIgnoreUpdates.current = true;
    // setRouteColor(undefined);
    // setRouteName(undefined);
    // shouldIgnoreUpdates.current = false;
    // Update the project to remove the route
    updateProject({
      ...project,
      routes: project.routes.filter((r) => r.id !== dbRoute?.id),
    });
    setDbRoute(undefined);

    setTimeout(() => {
      updateRouteId("route-deleted");
    }, 100);
  };

  if (!dbRoute)
    return (
      <div className="p-4 border-t border-gray-100 flex-none">
        <button
          onClick={() => {
            addRouteToProject(route);
          }}
          disabled={isAddingRoute}
          className="tc-button tc-button-primary w-full"
        >
          {isAddingRoute ? (
            <RiLoaderFill className="animate-spin size-4" />
          ) : (
            "Add to Project"
          )}
        </button>
      </div>
    );

  return (
    <div className="p-4 border-t border-gray-100 flex flex-col gap-4 flex-none">
      <div className="tc-input-group">
        <div className="tc-input-group-label">Route Name</div>
        <input
          type="text"
          defaultValue={dbRoute.name}
          placeholder={placeHolderRouteName}
          onChange={(e) => setRouteName(e.target.value)}
        />
      </div>
      <ColorInput
        initialColor={routeColor}
        onColorChange={(c) => setRouteColor(c ?? undefined)}
      />
      <div className="border-b border-dashed border-gray-200"></div>
      <button
        onClick={deleteRoute}
        className="tc-button tc-button-destructive w-full"
      >
        <TrashIcon className="size-4" />
        Remove from Project
      </button>
    </div>
  );
}
