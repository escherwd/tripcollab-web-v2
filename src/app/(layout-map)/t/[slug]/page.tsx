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
            <div className="fade-in fixed top-0 left-0 right-0 z-40">
                <Navbar>
                    <div className="flex gap-4 justify-between items-center -ml-2">
                        <span className="font-mono text-sm font-medium text-gray-400">/</span>
                        <span className="text-gray-500">{project.name}</span>
                        <div className="flex-1">
                        </div>
                        <div className="tc-nav-button tc-nav-button-primary">
                            Share
                        </div>
                    </div>
                </Navbar>
            </div>

            <ProjectPageContent project={project} />
        </>
    );
}