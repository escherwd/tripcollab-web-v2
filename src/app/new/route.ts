import { getUser } from "@/backend/auth/get_user";
import prisma from "@/backend/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: This should be server function logic or something
  return NextResponse.json({ error: "Temporarily disabled" });

  // const user = await getUser();

  // if (!user) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // // Create a new project
  // const project = await prisma.project.create({
  //   data: {
  //     name: "Untitled Trip",
  //     userId: user.id,
  //     slug: crypto.randomUUID().slice(0, 8),
  //   },
  // });

  // return NextResponse.redirect(new URL(`/t/${project.slug}`, request.url));
}
