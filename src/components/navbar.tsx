import { AppUser } from "@/backend/auth/get_user";
import Link from "next/link";
import NavBarProfileComponent from "./navbar_profile";

export default function Navbar({
  children,
  user,
  notFloating = false
}: Readonly<{
  children?: React.ReactNode;
  user: AppUser | null;
  notFloating?: boolean
}>) {
  return (
    <div className="absolute h-navbar inset-0 z-50 w-full p-2 flex items-center justify-stretch">
      <div
        id="navbar"
        className={`tc-panel overflow-visible! size-full gap-2  flex items-center px-1 ${notFloating ? 'shadow-none!' : ''}`}
      >
        <Link
          href="/"
          className="tc-nav-button !text-base font-display font-semibold !px-4 text-black"
        >
          tripcollab
        </Link>
        <div className="flex-1 min-w-0">{children}</div>
        {user ? (
          <NavBarProfileComponent user={user} />
        ) : (
          <Link href="/login" className="tc-nav-button">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
