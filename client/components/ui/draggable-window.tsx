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
  zIndex?: number;
  onBringToFront?: () => void;
  title?: string;
  resizable?: boolean;
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
  zIndex = 10,
  onBringToFront,
  title,
  resizable = false,
}: DraggableWindowProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Keep window within viewport bounds
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        const newWidth = Math.max(
          minWidth,
          Math.min(maxWidth, resizeStart.width + deltaX),
        );
        const newHeight = Math.max(
          minHeight,
          Math.min(maxHeight, resizeStart.height + deltaY),
        );

        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];

      if (isDragging) {
        const newX = touch.clientX - dragStart.x;
        const newY = touch.clientY - dragStart.y;

        // Keep window within viewport bounds
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }

      if (isResizing) {
        const deltaX = touch.clientX - resizeStart.x;
        const deltaY = touch.clientY - resizeStart.y;

        const newWidth = Math.max(
          minWidth,
          Math.min(maxWidth, resizeStart.width + deltaX),
        );
        const newHeight = Math.max(
          minHeight,
          Math.min(maxHeight, resizeStart.height + deltaY),
        );

        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
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
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    setIsDragging(true);
    if (onBringToFront) {
      onBringToFront();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
    setIsDragging(true);
    if (onBringToFront) {
      onBringToFront();
    }
  };

  const handleWindowClick = () => {
    if (onBringToFront) {
      onBringToFront();
    }
  };

  return (
    <div
      ref={windowRef}
      className="absolute border-2 border-black shadow-lg select-none"
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
        zIndex,
      }}
      onClick={handleWindowClick}
    >
      {/* Window Header */}
      <div
        className="h-8 border-b-2 border-black relative cursor-move"
        style={{ backgroundColor: headerColor }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Full-width horizontal lines */}
        <div className="absolute inset-0 flex flex-col justify-center gap-1 px-2">
          <div className="w-full h-0.5 bg-black" />
          <div className="w-full h-0.5 bg-black" />
          <div className="w-full h-0.5 bg-black" />
        </div>

        {/* Window Title */}
        {title && (
          <div className="absolute inset-0 flex items-center justify-center px-8">
            <div
              className="text-black text-sm font-bold chicago-font text-center bg-opacity-90 px-2 rounded-sm"
              style={{ backgroundColor: headerColor }}
            >
              {title}
            </div>
          </div>
        )}

        {/* Close button */}
        {onClose && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onClose();
              }}
              className="w-6 h-6 flex items-center justify-center hover:bg-black hover:bg-opacity-10 bg-opacity-90 rounded-sm"
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
          </div>
        )}
      </div>

      {/* Window Content */}
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
