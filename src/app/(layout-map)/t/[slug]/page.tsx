"use server";

import prisma from "@/backend/prisma";
import ProjectPageContent from "./content";
import { getUser } from "@/backend/auth/get_user";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import MapHome from "@/components/global_map";
import { bbox, points } from "@turf/turf";
import { HereMultimodalRouteSection } from "@/app/api/routes/here_multimodal";
import { decode } from "@here/flexpolyline";
import { LngLatBounds } from "mapbox-gl";
import padBbox from "@/app/utils/geo/pad_bbox";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const user = await getUser();

  const project = await prisma.project.findUnique({
    where: {
      slug,
      userId: user?.id,
    },
    include: {
      pins: true,
      user: true,
      routes: true,
    },
  });

  if (!project) {
    redirect("/");
  }

  // Calculate the initial map bounds (server side)
  const projectAllPoints = points([
    ...project.pins.map((pin) => [pin.longitude, pin.latitude]),
    ...project.routes.flatMap((route) =>
      (route.segments as HereMultimodalRouteSection[]).flatMap((seg) =>
        decode(seg.polyline).polyline.map((coord) => [coord[1], coord[0]])
      )
    ),
  ]);

  const boundingBox = padBbox(bbox(projectAllPoints), 0.1);

  console.log(
    "Calculated bounding box with ",
    projectAllPoints.features.length,
    " points"
  );

  const initialMapBounds = [
    boundingBox[0],
    boundingBox[1],
    boundingBox[2],
    boundingBox[3],
  ];

  return (
    // <Home params={params} />
    <>
      <ProjectPageContent
        user={user}
        project={project}
        initialMapBounds={initialMapBounds}
      />
    </>
  );
}
