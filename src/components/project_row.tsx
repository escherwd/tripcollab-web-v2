import Link from "next/link";
import { MapProject } from "./global_map";
import {
  MdChevronRight,
  MdLocationPin,
  MdPin,
  MdPinDrop,
} from "react-icons/md";
import { DateTime } from "luxon";
import UserAvatars from "./user_avatars";

export default function ProjectRow({ project }: { project: MapProject }) {
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
      key={project.id}
      className="flex gap-2 items-center py-3 px-4 hover:bg-gray-100 transition-colors"
    >
      <div className="flex-1 font-medium">{project.name}</div>
      <div className="text-gray-500 text-sm">
        {startDate?.toLocaleString(DateTime.DATE_SHORT)}
      </div>
      <div className="text-gray-500 text-sm w-14 justify-end flex items-center gap-1">
        {project.pins.length} <MdLocationPin />
      </div>
      <div className="w-12 h-5 relative flex justify-end">
        
          <UserAvatars users={[project.user].concat(project.projectShares.map(ps => ps.user)).slice(0,3)} />

      </div>
      <div>
        <MdChevronRight className="text-gray-500 size-5" />
      </div>
    </Link>
  );
}
