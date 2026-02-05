import Link from "next/link";

export default function TcButton({
  onClick,
  children,
  primary,
  className,
  href,
  disabled = false
}: {
  onClick?: () => void;
  children: React.ReactNode;
  primary?: boolean;
  className?: string;
  href?: string;
  disabled?: boolean
}) {
  if (href) {
    return (
      <Link
        href={href}
        className={`tc-button ${primary ? "tc-button-primary" : ""} ${className ?? ""}`}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`tc-button ${primary ? "tc-button-primary" : ""} ${className ?? ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
