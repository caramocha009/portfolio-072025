import React from "react";

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function DesktopIcon({
  icon,
  label,
  onClick,
  className = "",
}: DesktopIconProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-2 hover:bg-white hover:bg-opacity-10 rounded transition-colors ${className}`}
    >
      <div className="w-24 h-24 flex items-center justify-center">{icon}</div>
      <div className="bg-desktop-azure px-2 py-1 rounded text-black text-sm font-normal text-center min-w-[100px]">
        {label}
      </div>
    </button>
  );
}
