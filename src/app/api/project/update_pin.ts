"use server";

import { getUser } from "@/backend/auth/get_user";
import prisma from "@/backend/prisma";
import { Prisma } from "@/generated/client";

export const updatePin = async (
  pinId: string,
  pin: Prisma.PinGetPayload<{}>,
) => {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const existingPin = await prisma.pin.findUnique({
    where: { id: pinId },
  });

  if (!existingPin) {
    throw new Error("Pin not found");
  }

  const project = await prisma.project.findUnique({
    where: { id: existingPin.projectId, userId: user.id },
  });

  if (!project) {
    throw new Error("Project not found or you do not have access to it.");
  }

  pin = await prisma.pin.update({
    where: { id: pinId },
    data: pin as any,
  });

  return pin;
};
