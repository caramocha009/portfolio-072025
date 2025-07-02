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
      <div
        className="font-chicago text-app bg-icon-background text-icon-foreground aria-[selected='true']:bg-icon-background-selected aria-[selected='true']:text-icon-foreground-selected flex h-[26px] items-center pt-[3px] pr-[6px] pb-[1px] pl-[8px] leading-[22px] transition-colors group-hover:brightness-[95%] group-focus-visible:brightness-[80%] group-active:brightness-[80%]"
        style={{
          fontFamily:
            '"FA Sysfont C", "Courier New", "Monaco", "Lucida Console", monospace',
          fontWeight: "normal",
          textRendering: "pixelated",
          WebkitFontSmoothing: "none",
          MozOsxFontSmoothing: "none",
        }}
      >
        {label}
      </div>
    </button>
  );
}
