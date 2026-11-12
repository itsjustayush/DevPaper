'use client';

import React, { useEffect, useRef } from 'react';

interface DockPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export const DockPopover: React.FC<DockPopoverProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'w-80',
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 ${width} bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 text-white z-50 animate-in fade-in zoom-in-95 duration-150`}
    >
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-xs font-semibold text-white/70">
        <span>{title}</span>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition text-xs p-1"
        >
          ✕
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto space-y-3 custom-scrollbar pr-1">
        {children}
      </div>
    </div>
  );
};

