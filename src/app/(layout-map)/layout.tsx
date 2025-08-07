import GlobalAppMap from "@/components/global_map";

export default function NoneLayout({children}: {children: React.ReactNode}) {
    return (
        <>
            <div className="fixed size-full">
                <GlobalAppMap />
            </div>
            {children}
        </>
    );
}