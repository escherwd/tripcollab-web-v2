"use server";

import { getUser } from "@/backend/auth/get_user";
import prisma from "@/backend/prisma";
import { MapProject } from "@/components/global_map";

/**
 * Update a project on the server
 * @param using the project instance
 *
 * Note: Routes and pins are stripped from the database update. Use route/pin specific functions for that.
 */
export const serverUpdateProject = async (using: MapProject) => {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findUnique({
    where: { id: using.id, userId: user.id },
  });

  if (!project) {
    throw new Error("Project not found or you do not have access to it.");
  }

  await prisma.project.update({
    where: {
        id: project.id
    },
    data: {
        name: using.name,
        slug: using.slug,
        description: using.description
    }
  })
};
