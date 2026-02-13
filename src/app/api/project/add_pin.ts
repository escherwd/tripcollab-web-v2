"use server";

import { getUser } from "@/backend/auth/get_user";
import prisma from "@/backend/prisma";
import { MapMarker } from "@/components/global_map";
import { AppleMapsPlace } from "../maps/place";
import {
  getMapIconFromAppleMapsCategoryId,
  mapIcons,
} from "@/components/map_place_icon";

export const addPin = async (
  projectId: string,
  marker: MapMarker<AppleMapsPlace>,
) => {
  // Grab the user
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

  let icon = mapIcons.address;
  if (marker.appleMapsPlace?.categoryId) {
    icon = getMapIconFromAppleMapsCategoryId(marker.appleMapsPlace.categoryId);
  }

  // Determine the type of the pin
  // Options:
  // - place
  // - lodging
  // - activity (most things will be this)
  let type = "activity";
  if (
    marker.appleMapsPlace?.categoryId?.startsWith(
      "travel_and_leisure.travel_accommodation",
    )
  ) {
    type = "lodging";
  } else if (marker.appleMapsPlace?.categoryId?.startsWith("territories")) {
    type = "place";
  }

  // Create the pin
  const pin = await prisma.pin.create({
    data: {
      projectId: project.id,
      latitude: marker.coordinate.lat,
      longitude: marker.coordinate.lng,
      name: marker.appleMapsPlace?.name ?? "Dropped Pin",
      userId: user.id,
      appleMapsMuid: marker.appleMapsPlace?.muid,
      mapboxFeatureId: marker.mapboxFeatureId,
      zoneName:
        marker.appleMapsPlace?.timeZone ??
        "utc",
      type: type,
      extendedMetadata: {
        address: marker.appleMapsPlace?.address,
        text: marker.appleMapsPlace?.textBlock,
        images: marker.appleMapsPlace?.photos?.slice(0, 4),
        categoryId: marker.appleMapsPlace?.categoryId,
        categoryName: marker.appleMapsPlace?.categoryName,
      },
      styleData: {
        iconId: icon.categoryId,
        // iconColor: icon.color,
      },
    },
  });

  return pin;
};
