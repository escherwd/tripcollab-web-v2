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
            // Check if username is taken
            let newUsername = data.user.metadata.username ?? data.user.firstName?.toLowerCase() ?? 'mapper';
            while (true) {
                const existingUser = await prisma.user.findUnique({
                    where: {
                        username: newUsername,
                    },
                });
                if (!existingUser) {
                    break;
                }
                // Append a random number to the username
                const randomNum = Math.floor(Math.random() * 1000);
                newUsername = `${newUsername}-${randomNum}`;
            }
            // Create a new user
            const newUser = await prisma.user.create({
                data: {
                    workosId: data.user.id,
                    firstName: data.user.firstName ?? 'Traveler',
                    email: data.user.email,
                    username: newUsername,
                    profilePictureUrl: data.user.profilePictureUrl ?? '',
                },
            });

            const newUserShareProjectId = process.env.NEW_USER_SHARE_PROJECT_ID
            if (newUserShareProjectId) {
                await prisma.projectShare.create({
                    data: {
                        userId: newUser.id,
                        projectId: newUserShareProjectId,
                        canEdit: false
                    }
                })
            }

            console.log('New user created with id: ', newUser.id, ' and workosId: ', newUser.workosId);
        }
    },
});
