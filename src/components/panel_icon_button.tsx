"use client";

export default function PanelIconButton({
  icon,
  onClick,
  className
}: {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer text-gray-400 bg-gray-100 hover:bg-gray-200 rounded-full size-6 flex-none flex items-center justify-center whitespace-nowrap transition-colors [&>*]:size-4 ${className}`}
    >
      {icon}
    </button>
  );
}
