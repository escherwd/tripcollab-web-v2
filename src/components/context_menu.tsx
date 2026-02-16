import React from "react";

export default function ContextMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white z-10 relative tc-panel h-min w-full rounded-lg !shadow-xl overflow-hidden origin-top-right divide-y divide-gray-100 *:p-1">
      {children}
    </div>
  );
}
