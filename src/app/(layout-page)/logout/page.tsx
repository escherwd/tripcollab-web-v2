'use client'

import { serverLogOut } from "@/app/api/auth/logout";
import { useEffect } from "react";

export default function LogOutPage() {

    const doSignOut = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await serverLogOut();
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