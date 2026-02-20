import { AppUser } from "@/backend/auth/get_user";
import Link from "next/link";
import NavBarProfileComponent from "./navbar_profile";

export default function Navbar({
  children,
  user,
  notFloating = false,
}: Readonly<{
  children?: React.ReactNode;
  user: AppUser | null;
  notFloating?: boolean;
}>) {
  return (
    <div
      className={`fixed top-0 h-navbar inset-0 z-50 w-full p-2 flex items-center justify-stretch ${notFloating ? "bg-white border-b border-gray-100" : ""}`}
    >
      <div
        id="navbar"
        className={`tc-panel overflow-visible! size-full gap-2 flex items-center px-1 ${notFloating ? "shadow-none! max-w-3xl !rounded-none mx-auto" : ""}`}
      >
        <Link
          href="/"
          className="tc-nav-button !text-base font-display font-semibold !px-4 text-black! flex gap-2 items-center"
        >
          {/* <img
            className="w-[22px]"
            src="/tripcollab-logo.svg"
            alt="tripcollab logo"
          /> */}
          <span className="-mt-[3px]">tripcollab</span>
        </Link>
        <div className="flex-1 min-w-0">{children}</div>
        {user ? (
          <NavBarProfileComponent user={user} />
        ) : (
          <Link href="/login" className="tc-nav-button px-4!">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
