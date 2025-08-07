import Navbar from "@/components/navbar";

export default function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <div className="h-full relative">
                {children}
            </div>
        </>
    );
}