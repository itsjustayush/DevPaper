'use client';

import React from 'react';
import { listFrames } from '@/registries/frames';
import { Check } from 'lucide-react';

interface FrameSelectorProps {
  currentFrameId: string;
  onSelectFrame: (frameId: string) => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  currentFrameId,
  onSelectFrame,
}) => {
  const frames = listFrames();

  return (
    <div className="space-y-1.5">
      {frames.map((frame) => {
        const isSelected = frame.id === currentFrameId;
        return (
          <button
            key={frame.id}
            onClick={() => onSelectFrame(frame.id)}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition text-xs ${
              isSelected
                ? 'border-emerald-400 bg-white/10 text-white font-medium'
                : 'border-white/5 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <div>
              <div className="font-medium text-white">{frame.name}</div>
              <div className="text-[10px] text-white/40">{frame.description}</div>
            </div>
            {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
};
