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
    <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
      {frames.map((frame) => {
        const isSelected = frame.id === currentFrameId;
        return (
          <button
            key={frame.id}
            onClick={() => onSelectFrame(frame.id)}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition text-xs ${
              isSelected
                ? 'border-emerald-500/50 bg-emerald-500/10 text-zinc-100 font-medium'
                : 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-850 hover:text-white'
            }`}
          >
            <div>
              <div className="font-medium text-zinc-100">{frame.name}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">{frame.description}</div>
            </div>
            {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
};
