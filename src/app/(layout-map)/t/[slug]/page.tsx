'use server'

import prisma from "@/backend/prisma";
import ProjectPageContent from "./content";
import { getUser } from "@/backend/auth/get_user";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import MapHome from "@/components/global_map";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    const user = await getUser()

    const project = await prisma.project.findUnique({
        where: {
            slug,
            userId: user?.id
        },
        include: {
            pins: true,
            user: true,
            routes: true,
        }
    })

    if (!project) {
        redirect('/')
    }

    return (
        // <Home params={params} />
        <>
            <ProjectPageContent user={user} project={project} />
        </>
    );
}