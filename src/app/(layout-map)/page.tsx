import { getUser } from "@/backend/auth/get_user";
import prisma from "@/backend/prisma";
import TcButton from "@/components/button";
import GlobalAppMap, { MapProject } from "@/components/global_map";
import HomePageMapAnimator from "@/components/home_page_map_animator";
import Navbar from "@/components/navbar";
import NewProjectButton from "@/components/new_project_button";
import ProjectCard from "@/components/project_card";
import ProjectRow from "@/components/project_row";
import { PlusIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MdArrowForward, MdChevronRight, MdMap } from "react-icons/md";
import { calculateStartFor } from "../utils/logic/calculate_dates";
import { DateTime, Settings } from "luxon";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    redirect("/welcome");
  }

  Settings.defaultLocale = user.localeSettings.time == 12 ? "en-US" : "en-GB";

  const welcomeMessage = () => {
    // const date = DateTime.now()
    // if (date.hour > 17) return `Good Evening, ${user.firstName}`;
    // if (date.hour > 12) return `Good Afternoon, ${user.firstName}`;
    // return `Good Morning, ${user.firstName}`;
    if (DateTime.fromJSDate(user.createdAt).diffNow("days").negate().days < 3) {
      return `Welcome, ${user.firstName}!`;
    } else {
      return `Welcome Back, ${user.firstName}`;
    }
  };

  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    include: {
      pins: true,
      routes: true,
      user: true,
      projectShares: {
        include: {
          user: true,
        },
      },
    },
  });

  const sharedProjects = await prisma.projectShare.findMany({
    where: {
      userId: user.id,
    },
    include: {
      project: {
        include: {
          pins: true,
          routes: true,
          user: true,
          projectShares: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  const projectsOrderedByDate = projects
    .concat(sharedProjects.map((p) => p.project))
    .map((p) => ({ startTime: calculateStartFor(p), ...p }))
    .filter((p) => p.startTime && p.startTime > Date.now())
    .sort((a, b) => {
      return (
        Date.now() - (a.startTime ?? 0) - (Date.now() - (b.startTime ?? 0))
      );
    });

  return (
    <>
      <style>{`
        #navbar {
          background: transparent;
          border: none;
          box-shadow: none;
          filter: invert(1);
          outline: none;
        }

        #nav-menu {
          filter: invert(1);
        }
        #profile-photo {
          filter: invert(1);
        }
      `}</style>

      <HomePageMapAnimator />

      <div className="fixed w-full z-20">
        <Navbar user={user} />
      </div>

      <div className="fixed size-full overflow-scroll fade-in">
        <div className="tc-page-padding flex flex-col items-center justify-start">
          <div className="flex pt-[10%] flex-col items-start justify-center w-full max-w-xl gap-12 relative">
            <div>
              <h1 className="text-4xl font-bold font-display text-white">
                {welcomeMessage()}
              </h1>
              <p className="text-lg mt-3 text-white/50">
                Let&apos;s plan your next trip.
              </p>
            </div>

            <div className="w-full">
              <div className="tc-small-heading inline-block tc-small-heading-white tc-blurred-bg-element">
                Upcoming Trips
              </div>
              <div className="grid grid-cols-3 gap-2 w-full items-stretch">
                {projectsOrderedByDate.slice(0, 5).map((project) => {
                  return <ProjectCard key={project.id} project={project} />;
                })}
                <NewProjectButton />
              </div>
            </div>

            {sharedProjects.length > 0 && (
              <div className="w-full mt-6">
                <div className="tc-small-heading inline-block tc-small-heading-white tc-blurred-bg-element">
                  Shared With Me
                </div>
                <div className="rounded-lg shadow-lg bg-white divide-y divide-gray-100 overflow-hidden">
                  {sharedProjects.map((share) => {
                    return (
                      <ProjectRow key={share.id} project={share.project} />
                    );
                  })}
                </div>
                <div className="flex items-center justify-center pt-6">
                  <TcButton className="!bg-white !px-6 hover:!bg-gray-100 shadow-lg">
                    All Shared Projects
                    <MdArrowForward />
                  </TcButton>
                </div>
              </div>
            )}

            <div className="w-full mt-6">
              <div className="tc-small-heading inline-block tc-small-heading-white tc-blurred-bg-element">
                My Projects
              </div>
              {projects.length > 0 ? (
                <>
                  <div className="rounded-lg shadow-lg bg-white divide-y divide-gray-100 overflow-hidden">
                    {projects.map((project) => {
                      return <ProjectRow key={project.id} project={project} />;
                    })}
                  </div>
                  <div className="flex items-center justify-center pt-6">
                    <TcButton className="!bg-white !px-6 hover:!bg-gray-100 shadow-lg">
                      Manage All Projects
                      <MdArrowForward />
                    </TcButton>
                  </div>
                </>
              ) : (
                <div className="rounded-lg shadow-lg bg-white px-4 py-10 w-full flex flex-col items-center justify-center gap-4">
                  <MdMap className="size-10 text-gray-300" />
                  <span className="text-gray-400">
                    Looks like you don&apos;t have any projects yet!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
