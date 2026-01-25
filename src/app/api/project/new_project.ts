'use server'

import { getUser } from "@/backend/auth/get_user";
import prisma from "@/backend/prisma";

export const serverCreateNewProject = async () => {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.create({
    data: {
        userId: user.id,
        name: "Untitled Project",
        slug: crypto.randomUUID().slice(0, 8),
    }
  })

  return project;
};
