import { withAuth } from '@workos-inc/authkit-nextjs';
import prisma from '../prisma';

export const getUser = async () => {
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