'use server'

import { getUser } from "@/backend/auth/get_user";
import { redirect } from "next/navigation";
import UnitSettingsContent from "./content";

export default async function UnitSettingsPage() {

    const user = await getUser()

    if (!user)
        redirect('/404')

    return (
        <UnitSettingsContent user={user} />
    );
}