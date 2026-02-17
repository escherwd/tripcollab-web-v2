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
  date?: string, // ISO string
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

  const dateObj = date ? DateTime.fromISO(date, { setZone: true }) : undefined;

  console.log(date, dateObj?.zoneName);

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
          4,
        )}, ${origin.coordinate.lng.toFixed(4)})`,
      destLat: destination.coordinate.lat,
      destLng: destination.coordinate.lng,
      destName:
        destination.appleMapsPlace?.name ??
        `Pin at (${destination.coordinate.lat.toFixed(
          4,
        )}, ${destination.coordinate.lng.toFixed(4)})`,
      name:
        route.customName ??
        (origin.appleMapsPlace?.name && destination.appleMapsPlace?.name
          ? `${origin.appleMapsPlace.name} to ${destination.appleMapsPlace.name}`
          : "New Route"),
      originAppleMapsMuid: origin.appleMapsPlace?.muid,
      originMapboxFeatureId: origin.mapboxFeatureId,
      destAppleMapsMuid: destination.appleMapsPlace?.muid,
      destMapboxFeatureId: destination.mapboxFeatureId,
      originExtendedMetadata: {
        address: origin.appleMapsPlace?.address,
        categoryId: origin.appleMapsPlace?.categoryId,
        categoryName: origin.appleMapsPlace?.categoryName,
      },
      destExtendedMetadata: {
        address: destination.appleMapsPlace?.address,
        categoryId: destination.appleMapsPlace?.categoryId,
        categoryName: destination.appleMapsPlace?.categoryName,
      },
      modality: route.modality,
      segments: route.sections,
      dateStart: dateObj?.toJSDate(),
      // timeStart: dateObj ? dateObj.diff(dateObj.startOf("day")).as("minutes") : null, // Store timeStart as minutes from midnight
      // zoneName: dateObj?.zoneName || 'utc',
      zoneStart: route.zones.start,
      zoneEnd: route.zones.end,
      duration: route.sections.reduce(
        (acc, section) =>
          acc +
          (DateTime.fromISO(section.arrival.time)
            .diff(DateTime.fromISO(section.departure.time))
            .as("minutes") ?? 0),
        0,
      ),
      styleData: {},
    },
  });

  return newRoute;
};
