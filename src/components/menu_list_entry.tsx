import Link from "next/link";
import { MouseEvent, MouseEventHandler } from "react";
import { MdChevronRight } from "react-icons/md";

export default function MenuListEntry({
  link,
  title,
  children,
  className,
  onClick,
  chevron = false,
  active = false,
}: {
  link?: string;
  title: string;
  children?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  chevron?: boolean;
  active?: boolean;
}) {

  if (link)
    return (
      <Link
        href={link}
        className={`pl-2 pr-1 py-1 hover:bg-gray-100 flex gap-0.5 w-full items-center p-1 rounded text-gray-800 text-sm ${className} ${active ? "bg-gray-100" : ""}`}
      >
        <span className="flex-1">{title}</span>
        <div className="text-gray-400">{children}</div>
        {chevron && <MdChevronRight className="text-gray-400 size-5" />}
      </Link>
    );
  else
    return (
      <button
        onClick={onClick}
        className={`pl-2 pr-1 py-1 hover:bg-gray-100 cursor-pointer flex gap-0.5 w-full text-left items-center p-1 rounded text-gray-800 text-sm ${className} ${active ? "bg-gray-100" : ""}`}
      >
        <span className="flex-1">{title}</span>
        <div className="text-gray-400">{children}</div>
        {chevron && <MdChevronRight className="text-gray-400 size-5" />}
      </button>
    );
}
