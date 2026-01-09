"use server";

import { getUser } from "@/backend/auth/get_user";
import prisma from "@/backend/prisma";
import { Prisma } from "@prisma/client";

export const serverUpdateRoute = async (
  routeId: string,
  route: Prisma.RouteGetPayload<any>,
) => {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const existingRoute = await prisma.route.findUnique({
    where: { id: routeId },
  });

  if (!existingRoute) {
    throw new Error("Route not found");
  }

  const project = await prisma.project.findUnique({
    where: { id: existingRoute.projectId, userId: user.id },
  });

  if (!project) {
    throw new Error("Project not found or you do not have access to it.");
  }

  route = await prisma.route.update({
    where: { id: routeId },
    data: route as any,
  });

  return route;
};
