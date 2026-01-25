import { withAuth } from '@workos-inc/authkit-nextjs';
import prisma from '../prisma';
import { Prisma } from '@prisma/client';
import { User } from '@workos-inc/node';

export type AppUser = Prisma.UserGetPayload<{ include: { pins: false, projects: false } }> & { workos: User }
export type ProjectUser = Prisma.UserGetPayload<{ include: { pins: false, projects: false } }>

export const getUser = async (): Promise<AppUser | null> => {
    try {
        const { user } = await withAuth({ ensureSignedIn: true });

        if (!user) {
            return null;
        }

        const localUser = await prisma.user.findUnique({
            where: {
                workosId: user.id,
            },
        });

        if (!localUser) {
            return null;
        }

        return {
            ...localUser,
            workos: user,
        };
    } catch (error) {
        return null;
    }
}