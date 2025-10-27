"use server";

import { MapMarker } from "@/components/global_map";
import {
  HereMultimodalRoute,
  HereMultimodalRouteModality,
} from "../routes/here_multimodal";
import { getUser } from "@/backend/auth/get_user";
import prisma from "@/backend/prisma";
import { DateTime } from "luxon";

export type ServerRoute = {
  origin: MapMarker;
  destination: MapMarker;
  route: HereMultimodalRoute;
};

export const serverAddRoute = async (
  projectId: string,
  origin: MapMarker,
  destination: MapMarker,
  modality: HereMultimodalRouteModality,
  route: HereMultimodalRoute,
  date?: DateTime
) => {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Find the project
  const project = await prisma.project.findUnique({
    where: { id: projectId, userId: user.id },
    include: {
      pins: true,
    },
  });

  if (!project) {
    throw new Error("Project not found or you do not have access to it.");
  }

  // Create the route
  const newRoute = await prisma.route.create({
    data: {
      projectId: project.id,
      userId: user.id,
      originLat: origin.coordinate.lat,
      originLng: origin.coordinate.lng,
      originName:
        origin.appleMapsPlace?.name ??
        `Pin at (${origin.coordinate.lat.toFixed(
          4
        )}, ${origin.coordinate.lng.toFixed(4)})`,
      destLat: destination.coordinate.lat,
      destLng: destination.coordinate.lng,
      destName:
        destination.appleMapsPlace?.name ??
        `Pin at (${destination.coordinate.lat.toFixed(
          4
        )}, ${destination.coordinate.lng.toFixed(4)})`,
      originAppleMapsMuid: origin.appleMapsPlace?.muid,
      originMapboxFeatureId: origin.mapboxFeatureId,
      destAppleMapsMuid: destination.appleMapsPlace?.muid,
      destMapboxFeatureId: destination.mapboxFeatureId,
      modality: route.modality,
      segments: route.sections,
      dateStart: date?.toJSDate(),
      timeStart: date ? date?.diff(date.startOf("day")).as("minutes") : null, // Store timeStart as minutes from midnight
      duration: route.sections.reduce(
        (acc, section) =>
          acc +
          (DateTime.fromISO(section.arrival.time)
            .diff(DateTime.fromISO(section.departure.time))
            .as("minutes") ?? 0),
        0
      ),
    },
  });
};
