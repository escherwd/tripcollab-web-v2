import { getUser } from "@/backend/auth/get_user";
import Navbar from "@/components/navbar";

export default async function PageLayout({ children }: { children: React.ReactNode }) {

    const user = await getUser();

    return (
        <>
            <style>{`body { --page-bg-color: white }`}</style>
            <Navbar notFloating user={user} />
            <div className="h-full relative pt-navbar">
                <main className="p-2 pt-0">
                    {children}
                </main>
            </div>
        </>
    );
}