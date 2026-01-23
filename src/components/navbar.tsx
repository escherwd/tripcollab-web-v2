import { AppUser } from "@/backend/auth/get_user";
import Link from "next/link";

export default function Navbar({
    children,
    user,
  }: Readonly<{
    children?: React.ReactNode;
    user: AppUser | null
  }>) {

    return (
        <div className="absolute h-navbar inset-0 z-50 w-full p-2 flex items-center justify-stretch">
            <div id="navbar" className="tc-panel size-full gap-2  flex items-center px-1">
                <Link href="/" className="tc-nav-button !text-base font-display font-semibold !px-4 text-black">
                    tripcollab
                </Link>
                <div className="flex-1 min-w-0">
                    {children}
                </div>
                {
                    user ?
                        <>
                            <Link href="/profile" className="tc-nav-button flex items-center gap-4">
                                <span className="whitespace-nowrap">Hello, {user.firstName}</span>
                                <div id="profile-photo" className="size-6 shrink-0 block rounded-full bg-gray-200 overflow-hidden">
                                    {
                                        user.profilePictureUrl && <img src={user.profilePictureUrl} alt="" className="size-full object-cover" />
                                    }

                                </div>
                            </Link>
                        </>
                        :
                        <Link href="/login" className="tc-nav-button">
                            Login
                        </Link>
                }

            </div>
        </div>
    );
}