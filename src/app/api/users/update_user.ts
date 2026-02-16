"use server";

import { getUser } from "@/backend/auth/get_user";
import prisma from "@/backend/prisma";
import { Prisma } from "@prisma/client";

export const serverUpdateUser = async (
  changes: Partial<Prisma.UserGetPayload<any>>,
) => {
  const user = await getUser();

  if (!user) throw "You are not authorized to perform this action.";

  if (changes.bio?.trim() === "") changes.bio = null;
  if (changes.location?.trim() === "") changes.location = null;
  if (changes.website?.trim() === "") changes.website = null;

  if (changes.firstName?.trim() === "") changes.firstName = undefined;
  if (changes.username?.trim() === "") changes.username = undefined;

  if (changes.username && changes.username.length < 3)
    throw "Username must be 3+ characters";
  if (changes.username && changes.username.length > 24)
    throw "Username must be less than 24 characters";

  if (changes.firstName && changes.firstName.length > 32)
    throw "Display name must be less than 32 characters";

  if (changes.location && changes.location.length > 64)
    throw "Location must be less than 64 characters";
  if (changes.website && changes.website.length > 128)
    throw "Website must be less than 128 characters";
  if (changes.website && !changes.website.startsWith("https://"))
    throw "Websites must be prepended with https://";

  const usernameRegex = /^[a-zA-Z0-9_-]*$/gm;
    
  if (changes.username) {
    if (!usernameRegex.exec(changes.username)) {
      throw "Username can only contain letters, numbers, underscores, and dashes.";
    }
    const usernameCheck = await prisma.user.findFirst({
      where: {
        username: changes.username,
      },
    });

    if (usernameCheck && usernameCheck.id != user.id)
      throw "That username is already taken";
  }

  changes.bio = changes.bio?.slice(0, 400);

  const results = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: changes,
  });
  return results;
};
