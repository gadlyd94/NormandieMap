import React, { useRef } from 'react';
import { MapThemeId, LabelSize } from '../types';
import {
  Compass,
  Edit3,
  Eye,
  Plus,
  Download,
  Upload,
  Palette,
  Type,
  RotateCcw,
} from 'lucide-react';

interface HeaderNavProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  mapTheme: MapThemeId;
  onChangeMapTheme: (theme: MapThemeId) => void;
  labelSize: LabelSize;
  onChangeLabelSize: (size: LabelSize) => void;
  onAddWaypoint: () => void;
  onExportJson: () => void;
  onImportJson: (jsonData: string) => void;
  onResetData: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  isEditMode,
  onToggleEditMode,
  mapTheme,
  onChangeMapTheme,
  labelSize,
  onChangeLabelSize,
  onAddWaypoint,
  onExportJson,
  onImportJson,
  onResetData,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportJson(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header
      id="main-app-header"
      className="absolute top-3 left-3 right-3 sm:left-6 sm:right-6 z-[1000] bg-stone-900/95 backdrop-blur-md border border-amber-600/40 rounded-xl px-3 sm:px-5 py-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-stone-100"
    >
      {/* Title & Badge */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-800 to-amber-700 flex items-center justify-center shadow border border-amber-500/40 shrink-0">
          <Compass className="w-5 h-5 text-amber-200" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-serif font-bold text-stone-100 tracking-wide">
              Нормандия — Неман
            </h1>
            <span className="hidden md:inline-flex text-[11px] px-2 py-0.5 rounded-full bg-red-900/60 text-amber-300 border border-red-700/60 font-semibold">
              Боевой путь 1942–1945
            </span>
          </div>
          <p className="text-[11px] text-stone-400 hidden sm:block">
            Интерактивная карта для проекта «Герои Нормандии — Неман цифровому поколению»
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Mode switcher: View vs Edit */}
        <div className="flex items-center bg-stone-950 p-1 rounded-lg border border-stone-800">
          <button
            type="button"
            onClick={() => isEditMode && onToggleEditMode()}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              !isEditMode
                ? 'bg-amber-600 text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Просмотр</span>
          </button>
          <button
            type="button"
            onClick={() => !isEditMode && onToggleEditMode()}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              isEditMode
                ? 'bg-red-800 text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Редактирование</span>
          </button>
        </div>

        {/* Label Size Dropdown (Requirement: "Пункты боевого пути подписать крупнее") */}
        <div className="flex items-center gap-1 bg-stone-950/80 px-2.5 py-1 rounded-lg border border-stone-800 text-xs">
          <Type className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-stone-400 hidden md:inline text-[11px]">Шрифт:</span>
          <select
            value={labelSize}
            onChange={(e) => onChangeLabelSize(e.target.value as LabelSize)}
            title="Размер шрифта названий пунктов боевого пути"
            className="bg-transparent text-stone-200 focus:outline-none cursor-pointer font-medium text-xs"
          >
            <option value="normal" className="bg-stone-900 text-stone-100">Шрифт: Обычный</option>
            <option value="large" className="bg-stone-900 text-stone-100">Шрифт: Крупный</option>
            <option value="huge" className="bg-stone-900 text-stone-100">Шрифт: Очень крупный</option>
          </select>
        </div>

        {/* Map Theme Selector (Requirement: "переделать цветовую палитру") */}
        <div className="flex items-center gap-1 bg-stone-950/80 px-2.5 py-1 rounded-lg border border-stone-800 text-xs">
          <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-stone-400 hidden md:inline text-[11px]">Палитра:</span>
          <select
            value={mapTheme}
            onChange={(e) => onChangeMapTheme(e.target.value as MapThemeId)}
            title="Цветовая палитра карты"
            className="bg-transparent text-stone-200 focus:outline-none cursor-pointer font-medium text-xs"
          >
            <option value="vintage" className="bg-stone-900 text-stone-100">Винтажная атласная</option>
            <option value="dark" className="bg-stone-900 text-stone-100">Тёмная тактическая</option>
            <option value="light" className="bg-stone-900 text-stone-100">Светлая картографическая</option>
            <option value="satellite" className="bg-stone-900 text-stone-100">Спутник / Рельеф</option>
          </select>
        </div>

        {/* Add point button (in edit mode) */}
        {isEditMode && (
          <button
            type="button"
            onClick={onAddWaypoint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow"
            title="Добавить новый пункт боевого пути"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить точку</span>
          </button>
        )}

        {/* Export / Import & Reset actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onExportJson}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Скачать проект карты (JSON)"
          >
            <Download className="w-4 h-4" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Загрузить сохраненный проект (JSON)"
          >
            <Upload className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Сбросить карту к исходным историческим данным? Все добавленные изменения будут сброшены.')) {
                onResetData();
              }
            }}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-amber-400 rounded-lg transition-colors cursor-pointer"
            title="Сбросить к исходным историческим данным"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
