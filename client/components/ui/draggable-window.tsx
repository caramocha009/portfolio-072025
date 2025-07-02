import React, { useState, useRef, useEffect, ReactNode } from "react";

interface DraggableWindowProps {
  children: ReactNode;
  initialX?: number;
  initialY?: number;
  backgroundColor?: string;
  headerColor?: string;
  onClose?: () => void;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export function DraggableWindow({
  children,
  initialX = 100,
  initialY = 100,
  backgroundColor = "#F2B973",
  headerColor = "#E68C4F",
  onClose,
  width = 300,
  height = 300,
  minWidth = 200,
  minHeight = 200,
  maxWidth = 600,
  maxHeight = 600,
}: DraggableWindowProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Keep window within viewport bounds
      const maxX = window.innerWidth - width;
      const maxY = window.innerHeight - height;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;

      // Keep window within viewport bounds
      const maxX = window.innerWidth - width;
      const maxY = window.innerHeight - height;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, dragStart, width, height]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  return (
    <div
      ref={windowRef}
      className="absolute border-2 border-black shadow-lg z-10 select-none"
      style={{
        left: position.x,
        top: position.y,
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${minWidth}px`,
        minHeight: `${minHeight}px`,
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
        backgroundColor,
      }}
    >
      {/* Window Header */}
      <div
        className="h-8 border-b-2 border-black flex items-center justify-between px-1 cursor-move"
        style={{ backgroundColor: headerColor }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex-1" />

        {/* Window controls - horizontal lines */}
        <div className="flex flex-col items-center gap-1 mx-2">
          <div className="w-70 h-0.5 bg-black" style={{ width: "280px" }} />
          <div className="w-70 h-0.5 bg-black" style={{ width: "280px" }} />
          <div className="w-70 h-0.5 bg-black" style={{ width: "280px" }} />
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-7 flex items-center justify-center hover:bg-black hover:bg-opacity-10"
            style={{ backgroundColor: headerColor }}
          >
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
              <path
                d="M0.699951 3.7H13.3V16.3H0.699951V3.7Z"
                fill={headerColor}
                stroke="black"
                strokeWidth="1.4"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.38963 4.4H11.6097L6.99966 9.00984L2.38963 4.4ZM1.4 5.39026V14.6093L6.00969 9.99976L1.4 5.39026ZM6.99966 10.9897L2.38916 15.6H11.6101L6.99966 10.9897ZM12.6 14.6099V5.38958L7.98966 9.99976L12.6 14.6099ZM1.4 3H0V4.4V15.6V17H1.4H12.6H14V15.6V4.4V3H12.6H1.4Z"
                fill="black"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Window Content */}
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
