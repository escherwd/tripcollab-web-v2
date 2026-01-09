import { getUser } from "@/backend/auth/get_user";
import Navbar from "@/components/navbar";

export default async function PageLayout({ children }: { children: React.ReactNode }) {

    const user = await getUser();

    return (
        <>
            <Navbar user={user} />
            <div className="h-full relative">
                {children}
            </div>
        </>
    );
}