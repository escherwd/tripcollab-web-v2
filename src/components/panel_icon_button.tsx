"use client";

export default function PanelIconButton({
  icon,
  onClick,
  className,
  disabled
}: {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer text-gray-400 bg-gray-100 hover:bg-gray-200 rounded-full size-6 flex-none flex items-center justify-center whitespace-nowrap transition-colors [&>*]:size-4 ${className} ${disabled ? 'cursor-not-allowed! opacity-20' : ''}`}
    >
      {icon}
    </button>
  );
}
