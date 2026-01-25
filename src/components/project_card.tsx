import { Prisma } from "@prisma/client";
import { DateTime } from "luxon";
import Link from "next/link";
import { MapProject } from "./global_map";
import UserAvatars from "./user_avatars";

export default function ProjectCard({ project }: { project: MapProject }) {
  const start = [...project.pins, ...project.routes].reduce(
    (acc, entry) => {
      if (!acc) return entry.dateStart?.getTime();
      if (!entry.dateStart) return acc;
      return entry.dateStart?.getTime() < acc
        ? entry.dateStart?.getTime()
        : acc;
    },
    undefined as number | undefined,
  );

  const startDate = start ? DateTime.fromMillis(start) : null;

  return (
    <Link
      href={`/t/${project.slug}`}
      className="overflow-hidden bg-white rounded shadow-lg hover:bg-gray-100 transition-colors"
    >
      {/* <div className="aspect-square rounded overflow-hidden transition-none relative m-2 mb-0 size-16">
        <img
          src="/images/paris.jpg"
          alt={project.name}
          className="size-full object-cover"
        />
      </div> */}
      <div className="px-4 py-3 text-gray-900 flex flex-col h-full">
        <div className="font-medium text-lg -mx-4 px-4 mb-2 pb-4 border-b border-gray-100 flex-1 leading-6 min-h-20">
          {project.name}
        </div>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="text-sm text-gray-500">
              {startDate?.toLocaleString(DateTime.DATE_MED) ?? "—"}
            </div>
            <div className="text-sm text-gray-500">
              {project.pins.length} locations
            </div>
          </div>
          <div className="flex-0 h-8">
            <UserAvatars overlap={12} users={[project.user].concat(project.projectShares.map(p => p.user))} />
          </div>
        </div>
      </div>
    </Link>
  );
}
