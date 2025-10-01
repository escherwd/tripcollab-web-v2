'use server'

import { getUser } from "@/backend/auth/get_user"
import prisma from "@/backend/prisma"

export const deletePin = async (projectId: string, pinId: string) => {

    // Grab the user
    const user = await getUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    // Find the project
    const project = await prisma.project.findUnique({
        where: { id: projectId, userId: user.id },
        include: {
            pins: true,
        },
    })

    if (!project) {
        throw new Error("Project not found or you do not have access to it.")
    }

    await prisma.pin.delete({
        where: { id: pinId },
    })
}