"use server";

import { getUser } from "@/backend/auth/get_user";
import prisma from "@/backend/prisma";
import TcButton from "@/components/button";
import { redirect } from "next/navigation";
import { MdArrowOutward, MdArrowUpward, MdEdit, MdFlag, MdLanguage, MdLink, MdLocationPin, MdPublic } from "react-icons/md";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const user = await prisma.user.findUnique({
    where: {
      username: slug,
    },
  });

  if (!user) {
    redirect("/404");
  }

  const me = await getUser();

  return (
    <>
      {true && (
        <div className="h-48 w-full max-w-3xl mx-auto bg-gray-100 rounded-lg overflow-hidden -mb-24">
          <img
            src="/images/germany1.jpg"
            alt=""
            className="size-full object-cover"
          />
        </div>
      )}

      <div className="border-b border-gray-100 py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="flex flex-col gap-8 items-start">
            <div className="flex gap-10 justify-between items-end w-full">
              <div className="size-24 outline-6 outline-white mt-2 flex-none rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt={`Profile Image for ${user.firstName}`}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="text-5xl font-medium text-gray-400">
                    {user.firstName.slice(0, 1)}
                  </div>
                )}
              </div>
              <div>
                {user.id === me?.id && (
                  <TcButton href="/settings">
                    <MdEdit />
                    Edit Profile
                  </TcButton>
                )}
              </div>
            </div>

            <div className="">
              <h1 className="text-3xl font-display font-bold tracking-tight">
                {user.firstName}
              </h1>
              <div className="text-gray-500 text-lg">@{user.username}</div>
              <div className="mt-4 text-gray-500">{user.bio}</div>
              <div className="flex gap-8 mt-5 text-gray-500">
                {user.location && (
                  <div className="flex gap-2 items-center">
                    <MdLocationPin />
                    <span>{user.location}</span>
                  </div>
                )}

                {user.website && (
                  <div className="flex gap-2 items-center">
                    <MdLink className="-rotate-45" />
                    <a target="_blank" className="hover:underline" href={user.website}>{new URL(user.website).host}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
