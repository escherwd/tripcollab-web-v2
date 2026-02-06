import GlobalAppMap from "@/components/global_map";

export default function NoneLayout({children}: {children: React.ReactNode}) {
    return (
        <>
            <style>{`body { --page-bg-color: #092644; --bprogress-color: #fff }`}</style>
            <div className="fixed size-full">
                <GlobalAppMap />
            </div>
            {children}
        </>
    );
}