import { withAuth } from "@workos-inc/authkit-nextjs";
import Link from "next/link";

export default async function Navbar({
    children,
  }: Readonly<{
    children?: React.ReactNode;
  }>) {

    const { user } = await withAuth();

    return (
        <div className="absolute h-navbar inset-0 z-50 w-full p-2 flex items-center justify-stretch">
            <div id="navbar" className="tc-floating size-full gap-2  flex items-center px-1">
                <Link href="/" className="tc-nav-button !text-base font-display font-medium !px-4 text-black">
                    tripcollab
                </Link>
                <div className="flex-1">
                    {children}
                </div>
                {
                    user ?
                        <>
                            <Link href="/profile" className="tc-nav-button flex items-center gap-4">
                                <span>Hello, {user.firstName}</span>
                                <div id="profile-photo" className="size-6 block rounded-full bg-gray-200 overflow-hidden">
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