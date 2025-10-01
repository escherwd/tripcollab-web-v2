

import { getUser } from "@/backend/auth/get_user";
import prisma from "@/backend/prisma";
import GlobalAppMap from "@/components/global_map";
import HomePageMapAnimator from "@/components/home_page_map_animator";
import Navbar from "@/components/navbar";
import ProjectCard from "@/components/project_card";
import { PlusIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {

  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: user.id
    }
  })

  return (
    <>
    <Navbar />
    <HomePageMapAnimator />
    <div className="h-screen tc-page-padding flex flex-col items-center justify-start fade-in">

      <style>{`
        #navbar {
          background: transparent;
          border: none;
          box-shadow: none;
          filter: invert(1);
          outline: none;
        }

        #profile-photo {
          filter: invert(1);
        }
      `}</style>

      <div className="flex pt-[10%] flex-col items-start justify-center w-full max-w-xl gap-12 relative">
        <div>
          <h1 className="text-4xl font-bold font-display text-white">
            Welcome Back, {user?.firstName}.
          </h1>
          <p className="text-lg mt-3 text-white/50">
            Let&apos;s plan your next trip.
          </p>
        </div>


        <div className="w-full">
          <div className="tc-small-heading tc-small-heading-white">Upcoming Trips</div>
          <div className="grid grid-cols-3 gap-2 w-full items-stretch">
            {
              projects.map((project, i) => {
                return <ProjectCard key={i} project={project} />;
              })
            }
            <Link href="/new" className="bg-white/15 hover:bg-white/20 transition-colors flex items-center justify-center rounded">
              <PlusIcon className="text-white/60 size-6" />
            </Link>
          </div>
        </div>
      </div>
    </div >
    </>
  );
}
