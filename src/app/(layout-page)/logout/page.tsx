'use client'

import { signOut } from "@workos-inc/authkit-nextjs";
import { useEffect } from "react";

export default function LogOutPage() {

    const doSignOut = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await signOut({ returnTo: '/' })
    }

    useEffect(() => {
        doSignOut();
    }, []);

    return (
        <div className="fixed p-4 text-center flex items-center size-full justify-center">
            Logging Out...
        </div>
    );
}