'use server'

import { getUser } from "@/backend/auth/get_user";
import { redirect } from "next/navigation";
import UserSettingsContent from "./content";

export default async function UserSettingsPage() {

    const user = await getUser()

    if (!user)
        redirect('/404')

    return (
        <UserSettingsContent user={user} />
    );
}