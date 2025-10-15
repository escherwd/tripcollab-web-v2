import { Prisma } from "@/generated/client";
import Link from "next/link";

export default function ProjectCard({
  project,
}: {
  project: Prisma.ProjectGetPayload<null>;
}) {
  return (
    <Link
      href={`/t/${project.slug}`}
      className="overflow-hidden bg-[#FB2C36] odd:bg-blue-500 rounded shadow-lg hover:brightness-90 transition-all"
    >
      <div className="aspect-[3/2]  relative">
        <img
          src="/images/dither.png"
          className="size-full object-cover mix-blend-lighten"
        />
      </div>
      <div className="px-4 py-3 text-white">
        <div className="font-medium">London</div>
        <div className="text-sm text-white/50">March 5th – 14th</div>
      </div>
    </Link>
  );
}
