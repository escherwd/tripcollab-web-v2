export default function TcButton({ onClick, children, primary, className }: { onClick?: () => void; children: React.ReactNode; primary?: boolean; className?: string }) {
    return (
        <button className={`tc-button ${primary ? "tc-button-primary" : ""} ${className ?? ""}`} onClick={onClick}>{children}</button>
    );
}