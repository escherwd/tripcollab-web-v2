'use server'

import { signOut } from "@workos-inc/authkit-nextjs";

export async function serverLogOut() {
    // Any server-side logout logic can go here, such as clearing cookies or sessions
    // For WorkOS AuthKit, the client-side signOut function handles the logout process

    await signOut({ returnTo: '/welcome' });

    return;
}