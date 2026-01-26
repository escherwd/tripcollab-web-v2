"use server";

import prisma from "@/backend/prisma";

export const serverSearchUsers = async (
  query: string,
  exludingUserIds: string[] = [],
) => {
  if (query.length < 2) return null;

  const results = prisma.user.findMany({
    where: {
      AND: [
        {
            id: {
                notIn: exludingUserIds
            }
        },
        {
          OR: [
            {
              username: {
                startsWith: query,
              },
            },
            {
              firstName: {
                startsWith: query,
              },
            },
            {
              firstName: {
                startsWith: query[0].toUpperCase() + query.slice(1),
              },
            },
            {
              email: {
                equals: query,
              },
            },
          ],
        },
      ],
    },
  });

  return results;
};
