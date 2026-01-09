'use server'

import { getUser } from "@/backend/auth/get_user"
import prisma from "@/backend/prisma"

export const serverDeleteRoute = async (projectId: string, routeId: string) => {

    // Grab the user
    const user = await getUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    // Find the project
    const project = await prisma.project.findUnique({
        where: { id: projectId, userId: user.id },
        include: {
            routes: true,
        },
    })

    if (!project) {
        throw new Error("Project not found or you do not have access to it.")
    }

    await prisma.route.delete({
        where: { id: routeId },
    })
}