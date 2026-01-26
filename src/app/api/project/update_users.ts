"use server";

import { getUser } from "@/backend/auth/get_user";
import prisma from "@/backend/prisma";

export const serverUpdateProjectUsers = async (
  projectId: string,
  users: { id: string; canEdit: boolean }[],
) => {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findFirst({
    where: {
      OR: [
        { id: projectId, userId: user.id },
        {
          id: projectId,
          projectShares: {
            some: {
              userId: user.id,
              canEdit: true,
            },
          },
        },
      ],
    },
    include: {
      projectShares: true,
    },
  });

  if (!project) {
    throw new Error("Project not found or you do not have access to it.");
  }

  //   This one big transaction should be able to add, delete, and update the necessary users
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      projectShares: {
        updateMany: users
          .filter((u) => project.projectShares.find((ps) => ps.userId == u.id))
          .map((u) => ({
            where: {
              userId: u.id,
            },
            data: {
              canEdit: u.canEdit,
            },
          })),
        create: users
          .filter((u) => !project.projectShares.find((ps) => ps.userId == u.id))
          .map((u) => ({
            userId: u.id,
            canEdit: u.canEdit,
          })),
        delete: project.projectShares
          .filter((ps) => !users.find((u) => ps.userId == u.id))
          .map((u) => ({
            id: u.id,
          })),
      },
    },
    include: {
        projectShares: {
            include: {
                user: true
            }
        }
    }
  });

  return updatedProject.projectShares
};
