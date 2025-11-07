import { HereMultimodalRoute } from "@/app/api/routes/here_multimodal";
import { MapMarker, MapProject } from "./global_map";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { serverAddRoute } from "@/app/api/project/add_route";
import { RiLoaderFill } from "@remixicon/react";

export default function RoutePlanningCustomizer({ project, route, initialDBRoute, from, to }: { project: MapProject, route: HereMultimodalRoute, initialDBRoute?: Prisma.RouteGetPayload<any>, from: MapMarker, to: MapMarker }) {


    const [dbRoute, setDbRoute] = useState<Prisma.RouteGetPayload<any> | undefined>(initialDBRoute);

    const [isAddingRoute, setIsAddingRoute] = useState(false);

    const addRouteToProject = async (route: HereMultimodalRoute) => {
        if (!project.id || !from || !to) return;

        if (dbRoute) return;

        if (isAddingRoute) return; // Prevent multiple clicks
        setIsAddingRoute(true);

        try {
            const newDbRoute = await serverAddRoute(project.id, from, to, route.modality, route)
            setDbRoute(newDbRoute);
        } catch (err) {
            console.error("Error adding route to project:", err);
        }


    }

    return (
        <div className="p-4 border-t border-gray-100 flex-none">
            <button onClick={() => { addRouteToProject(route) }} disabled={isAddingRoute} className="tc-button tc-button-primary w-full">
                {isAddingRoute ? <RiLoaderFill className="animate-spin size-4" /> : "Add to Project"}
            </button>
        </div>
    );
}