import React from 'react';
import { Waypoint } from '../types';
import { Play, Pause, ChevronLeft, ChevronRight, ListOrdered } from 'lucide-react';

interface TimelineBarProps {
  waypoints: Waypoint[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  isPlayingTour: boolean;
  onTogglePlayTour: () => void;
}

export const TimelineBar: React.FC<TimelineBarProps> = ({
  waypoints,
  selectedIndex,
  onSelectIndex,
  isPlayingTour,
  onTogglePlayTour,
}) => {
  return (
    <nav
      aria-label="Хронологический путь эскадрильи"
      id="combat-timeline-bar"
      className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6 z-[1000] bg-stone-900/95 backdrop-blur-md border border-amber-600/40 rounded-xl p-2.5 shadow-2xl flex flex-col gap-2"
    >
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePlayTour}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow cursor-pointer ${
              isPlayingTour
                ? 'bg-amber-500 text-stone-950 animate-pulse'
                : 'bg-red-800 hover:bg-red-700 text-white'
            }`}
            title={isPlayingTour ? 'Остановить воспроизведение полета' : 'Запустить экскурсию по боевому пути'}
          >
            {isPlayingTour ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Остановить полет</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Взлет: Маршрут полета</span>
              </>
            )}
          </button>

          <span className="hidden sm:inline-flex text-xs font-semibold text-stone-300 items-center gap-1">
            <ListOrdered className="w-3.5 h-3.5 text-amber-400" />
            Хронология 1942–1945 гг.
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelectIndex(Math.max(0, selectedIndex - 1))}
            disabled={selectedIndex === 0}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-stone-200 rounded-lg transition-colors cursor-pointer"
            title="Предыдущий пункт"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-amber-400 px-2 font-bold">
            {selectedIndex + 1} / {waypoints.length}
          </span>

          <button
            type="button"
            onClick={() => onSelectIndex(Math.min(waypoints.length - 1, selectedIndex + 1))}
            disabled={selectedIndex === waypoints.length - 1}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-stone-200 rounded-lg transition-colors cursor-pointer"
            title="Следующий пункт"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal timeline track */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scroll-smooth">
        {waypoints.map((wp, idx) => {
          const isActive = idx === selectedIndex;
          return (
            <button
              key={wp.id}
              onClick={() => onSelectIndex(idx)}
              className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                isActive
                  ? 'bg-amber-600 text-white border-amber-400 shadow-md scale-105'
                  : 'bg-stone-950/80 hover:bg-stone-800 text-stone-300 border-stone-800 hover:border-amber-700/50'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                  isActive ? 'bg-stone-950 text-amber-400' : 'bg-stone-800 text-stone-400'
                }`}
              >
                {idx + 1}
              </span>
              <div className="flex flex-col text-left">
                <span className="font-bold text-xs truncate max-w-[120px]">{wp.name}</span>
                <span className={`text-[10px] ${isActive ? 'text-amber-100' : 'text-stone-500'}`}>
                  {wp.dateRange.split('—')[0]?.trim()}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
