import prisma from '@/backend/prisma';
import { handleAuth } from '@workos-inc/authkit-nextjs';

// Redirect the user to `/` after successful sign in
// The redirect can be customized: `handleAuth({ returnPathname: '/foo' })`
export const GET = handleAuth({
    async onSuccess(data) {

        // Find the local copy of this user
        const user = await prisma.user.findUnique({
            where: {
                workosId: data.user.id,
            },
        });

        if (!user) {
            // Create a new user
            const newUser = await prisma.user.create({
                data: {
                    workosId: data.user.id,
                    firstName: data.user.firstName ?? 'Traveler',
                    email: data.user.email,
                    username: data.user.metadata.username ?? data.user.email.split('@')[0],
                    profilePictureUrl: data.user.profilePictureUrl ?? '',
                },
            });

            console.log('New user created with id: ', newUser.id, ' and workosId: ', newUser.workosId);
        }
    },
});
