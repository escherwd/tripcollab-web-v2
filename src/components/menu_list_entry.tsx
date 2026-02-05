import Link from "next/link";
import { MdChevronRight } from "react-icons/md";

export default function MenuListEntry({
  link,
  title,
  children,
  className,
  chevron = false,
  active = false,
}: {
  link: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
  chevron?: boolean;
  active?: boolean;
}) {
  return (
    <Link
      href={link}
      className={`pl-2 pr-1 py-1 hover:bg-gray-100 flex gap-0.5 w-full items-center p-1 rounded text-gray-800 text-sm ${className} ${active ? 'bg-gray-100' : ''}`}
    >
      <span className="flex-1">{title}</span>
      <div className="text-gray-400">{children}</div>
      {chevron && <MdChevronRight className="text-gray-400 size-5" />}
    </Link>
  );
}
