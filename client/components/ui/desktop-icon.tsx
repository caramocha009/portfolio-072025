import React from "react";

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  title?: string;
}

export function DesktopIcon({
  icon,
  label,
  onClick,
  className = "",
  title,
}: DesktopIconProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex flex-col items-center gap-2 p-2 hover:opacity-80 transition-opacity ${className}`}
    >
      <div className="w-24 h-24 flex items-center justify-center">{icon}</div>
      <div
        className="bg-desktop-azure px-2 py-1 rounded text-black text-center min-w-[100px]"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "16px",
          fontWeight: "700",
        }}
      >
        {label}
      </div>
    </button>
  );
}
