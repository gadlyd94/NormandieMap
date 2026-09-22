import React from 'react';
import { NormandieEmblem } from './NormandieEmblem';
import { Info, Sparkles } from 'lucide-react';

interface EmblemBadgeProps {
  onClick: () => void;
  isOpen?: boolean;
}

export const EmblemBadge: React.FC<EmblemBadgeProps> = ({ onClick, isOpen }) => {
  return (
    <div
      id="emblem-container"
      className="absolute bottom-40 sm:bottom-48 left-4 sm:left-6 z-[1000] flex flex-col items-start gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <button
        id="emblem-regiment-btn"
        onClick={onClick}
        type="button"
        title="Эмблема полка «Нормандия — Неман» — нажать для открытия досье"
        className={`group relative flex items-center gap-3 p-2 sm:p-2.5 pr-4 sm:pr-5 bg-stone-900/95 hover:bg-stone-850 backdrop-blur-md border ${
          isOpen ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-amber-600/70 hover:border-amber-400'
        } rounded-2xl shadow-2xl transition-all duration-300 text-left cursor-pointer transform hover:-translate-y-1`}
      >
        {/* Pulsing beacon indicator */}
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border border-stone-900"></span>
        </span>

        {/* Guaranteed visible vector heraldic emblem */}
        <div className="w-14 h-18 sm:w-16 sm:h-20 shrink-0 relative flex items-center justify-center bg-stone-950 rounded-xl p-1 border border-amber-600/40 shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
          <NormandieEmblem className="w-full h-full object-contain filter drop-shadow-md" />
        </div>

        {/* Text and Call to Action */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Эмблема полка</span>
            <Info className="w-3.5 h-3.5 text-amber-300/80" />
          </div>
          <span className="font-serif font-bold text-sm sm:text-base text-stone-100 leading-tight mt-0.5">
            «Нормандия — Неман»
          </span>
          <span className="text-[11px] text-amber-200/80 group-hover:text-amber-100 transition-colors mt-0.5">
            Нажмите, чтобы открыть досье
          </span>
        </div>
      </button>
    </div>
  );
};
