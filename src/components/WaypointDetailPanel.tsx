import React from 'react';
import { Waypoint } from '../types';
import { AudioPlayerSection } from './AudioPlayerSection';
import {
  X,
  Plane,
  Calendar,
  Quote,
  Mail,
  Edit3,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle,
} from 'lucide-react';

interface WaypointDetailPanelProps {
  waypoint: Waypoint;
  totalWaypoints: number;
  currentIndex: number;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  onEditWaypoint: (waypoint: Waypoint) => void;
}

export const WaypointDetailPanel: React.FC<WaypointDetailPanelProps> = ({
  waypoint,
  totalWaypoints,
  currentIndex,
  onClose,
  onSelectIndex,
  onEditWaypoint,
}) => {
  return (
    <aside
      id="waypoint-detail-panel"
      className="absolute top-20 right-4 bottom-24 z-[1000] w-full max-w-md bg-stone-900/95 backdrop-blur-md border border-amber-600/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-100 animate-in slide-in-from-right duration-300"
    >
      {/* Header bar */}
      <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 p-4 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold font-mono">
            {currentIndex + 1} / {totalWaypoints}
          </span>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            {waypoint.phaseTitle}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEditWaypoint(waypoint)}
            className="p-1.5 text-stone-300 hover:text-amber-300 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            title="Редактировать эту точку"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content scrollable area */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-sm leading-relaxed">
        {/* City Title & Dates */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-2xl font-serif font-bold text-stone-50 leading-tight">
              {waypoint.name}
            </h2>
            {waypoint.aircraft && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-stone-800 border border-stone-700 text-stone-200 rounded-lg shrink-0">
                <Plane className="w-3.5 h-3.5 text-amber-400" />
                {waypoint.aircraft}
              </span>
            )}
          </div>
          <p className="text-xs text-amber-200/90 font-medium mt-0.5">{waypoint.subtitle}</p>
          <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-2">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{waypoint.dateRange}</span>
          </div>
        </div>

        {/* Audio Player / Speech Section */}
        <AudioPlayerSection
          audio={waypoint.audio}
          quoteText={waypoint.quote?.text}
          authorName={waypoint.quote?.author}
        />

        {/* Main description */}
        <div className="bg-stone-950/50 p-3.5 rounded-xl border border-stone-800 text-stone-300 text-xs sm:text-sm">
          {waypoint.description}
        </div>

        {/* Quote from Memoirs */}
        {waypoint.quote && (
          <div className="relative bg-gradient-to-br from-stone-950 via-stone-900 to-red-950/30 p-4 rounded-xl border border-amber-700/40 space-y-2">
            <Quote className="w-6 h-6 text-amber-400/50 absolute top-3 right-3" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
              Цитата из мемуаров летчиков
            </span>
            <p className="italic text-stone-200 text-xs sm:text-sm leading-relaxed">
              {waypoint.quote.text}
            </p>
            <div className="pt-1">
              <span className="font-semibold text-stone-100 text-xs block">
                {waypoint.quote.author}
              </span>
              {waypoint.quote.role && (
                <span className="text-[11px] text-stone-400 block">{waypoint.quote.role}</span>
              )}
              {waypoint.quote.source && (
                <span className="text-[10px] text-amber-300/80 block mt-0.5">
                  {waypoint.quote.source}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Letter from Archive */}
        {waypoint.letter && (
          <div className="bg-stone-950/70 p-3.5 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Архивные письма и документы</span>
            </div>
            <p className="text-xs text-stone-300 italic">{waypoint.letter.text}</p>
            <div className="text-[11px] text-stone-400 flex flex-wrap gap-x-2">
              <span className="font-medium text-stone-200">{waypoint.letter.author}</span>
              {waypoint.letter.recipient && <span>→ {waypoint.letter.recipient}</span>}
              {waypoint.letter.date && <span>({waypoint.letter.date})</span>}
            </div>
          </div>
        )}

        {/* Historical facts */}
        {waypoint.historicalFacts && waypoint.historicalFacts.length > 0 && (
          <div className="bg-stone-950/40 p-3 rounded-xl border border-stone-800 space-y-1.5">
            <span className="text-xs font-bold text-stone-300 block">Исторические факты:</span>
            <ul className="space-y-1 text-xs text-stone-400">
              {waypoint.historicalFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Coordinates */}
        <div className="text-[10px] text-stone-500 font-mono flex items-center gap-1">
          <MapPin className="w-3 h-3 text-stone-600" />
          <span>
            {waypoint.lat.toFixed(4)}° N, {waypoint.lng.toFixed(4)}° E
          </span>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-stone-950 p-3 border-t border-stone-800 flex items-center justify-between">
        <button
          onClick={() => onSelectIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-medium text-stone-200 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        <span className="text-xs text-stone-400">
          Точка {currentIndex + 1} из {totalWaypoints}
        </span>

        <button
          onClick={() => onSelectIndex(Math.min(totalWaypoints - 1, currentIndex + 1))}
          disabled={currentIndex === totalWaypoints - 1}
          className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-medium text-white transition-colors cursor-pointer"
        >
          <span>Далее</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
