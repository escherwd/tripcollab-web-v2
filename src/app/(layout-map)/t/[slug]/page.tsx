"use server";

import prisma from "@/backend/prisma";
import ProjectPageContent from "./content";
import { AppUser, getUser } from "@/backend/auth/get_user";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import MapHome from "@/components/global_map";
import { bbox, points } from "@turf/turf";
import { HereMultimodalRouteSection } from "@/app/api/routes/here_multimodal";
import { decode } from "@here/flexpolyline";
import { LngLatBounds } from "mapbox-gl";
import padBbox from "@/app/utils/geo/pad_bbox";

const getProject = async (slug: string, user: AppUser | null) => {
  const project = await prisma.project.findUnique({
    where: {
      slug,
    },
    include: {
      pins: true,
      user: true,
      routes: true,
      projectShares: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!project) {
    return;
  }

  if (
    !project.public &&
    project.userId != user?.id &&
    !project.projectShares.find((ps) => ps.userId == user?.id)
  ) {
    return;
  }

  return project;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const user = await getUser();

  const project = await getProject(slug, user);

  return {
    title: project?.name,
    description: `Created by ${project?.user.firstName}`
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const user = await getUser();

  const project = await getProject(slug, user);

  if (!project) redirect('/404');

  // Calculate the initial map bounds (server side)
  const projectAllPoints = points([
    ...project.pins.map((pin) => [pin.longitude, pin.latitude]),
    ...project.routes.flatMap((route) =>
      (route.segments as HereMultimodalRouteSection[]).flatMap((seg) =>
        decode(seg.polyline).polyline.map((coord) => [coord[1], coord[0]]),
      ),
    ),
  ]);

  let initialMapBounds: number[] | undefined = undefined;

  if (projectAllPoints.features.length > 0) {
    const boundingBox = padBbox(bbox(projectAllPoints), 0.1);

    initialMapBounds = [
      boundingBox[0],
      boundingBox[1],
      boundingBox[2],
      boundingBox[3],
    ];
  }

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
