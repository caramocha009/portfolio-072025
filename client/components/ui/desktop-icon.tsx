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
      className={`flex flex-col items-center gap-1 p-1 hover:opacity-80 transition-opacity ${className}`}
    >
      <div className="w-20 h-20 flex items-center justify-center">{icon}</div>
      <div
        className="bg-desktop-azure px-2 py-1 rounded text-black text-center min-w-[100px]"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "12px",
          fontWeight: "700",
        }}
      >
        {label}
      </div>
    </button>
  );
}
