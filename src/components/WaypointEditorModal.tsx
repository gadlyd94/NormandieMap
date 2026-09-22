import React, { useState } from 'react';
import { Waypoint, CombatPhase } from '../types';
import { AudioRecorder } from './AudioRecorder';
import {
  X,
  Save,
  Trash2,
  MapPin,
  Quote,
  Mail,
  Plane,
  Calendar,
  FileText,
  Layers,
} from 'lucide-react';

interface WaypointEditorModalProps {
  isOpen: boolean;
  waypoint: Waypoint | null;
  isNew?: boolean;
  onClose: () => void;
  onSave: (updatedWaypoint: Waypoint) => void;
  onDelete?: (id: string) => void;
}

const PHASES: { id: CombatPhase; label: string }[] = [
  { id: 'formation', label: '1942–1943: Формирование в Иваново и первые бои' },
  { id: 'kursk_orel', label: '1943: Курская битва и Орловская дуга' },
  { id: 'smolensk', label: '1943–1944: Освобождение Смоленщины' },
  { id: 'niemen', label: '1944: Операция «Багратион» и река Неман' },
  { id: 'prussia', label: '1944–1945: Восточная Пруссия и штурм Кёнигсберга' },
  { id: 'triumph', label: '1945: Москва и триумф в Париже' },
];

export const WaypointEditorModal: React.FC<WaypointEditorModalProps> = ({
  isOpen,
  waypoint,
  isNew = false,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen || !waypoint) return null;

  const [formData, setFormData] = useState<Waypoint>({ ...waypoint });
  const [activeTab, setActiveTab] = useState<'general' | 'quotes' | 'audio'>('general');

  const handleChange = (
    field: keyof Waypoint,
    value: string | number | boolean | object
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuoteChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      quote: {
        author: prev.quote?.author || '',
        text: prev.quote?.text || '',
        role: prev.quote?.role || '',
        source: prev.quote?.source || '',
        [field]: value,
      },
    }));
  };

  const handleLetterChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      letter: {
        author: prev.letter?.author || '',
        text: prev.letter?.text || '',
        recipient: prev.letter?.recipient || '',
        date: prev.letter?.date || '',
        archiveReference: prev.letter?.archiveReference || '',
        [field]: value,
      },
    }));
  };

  const handleAudioSave = (dataUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      audio: {
        type: 'recorded',
        dataUrl,
        title: prev.audio?.title || `Воспоминания: ${prev.name}`,
        speaker: prev.audio?.speaker || 'Запись учителя',
        transcript: prev.audio?.transcript || '',
      },
    }));
  };

  const handleAudioRemove = () => {
    setFormData((prev) => ({
      ...prev,
      audio: undefined,
    }));
  };

  const handleAudioTranscriptChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      audio: {
        type: prev.audio?.type || 'speech',
        dataUrl: prev.audio?.dataUrl,
        url: prev.audio?.url,
        title: prev.audio?.title || `Воспоминания: ${prev.name}`,
        speaker: prev.audio?.speaker || '',
        transcript: prev.audio?.transcript || '',
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      id="waypoint-editor-backdrop"
      className="fixed inset-0 z-[2500] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div
        id="waypoint-editor-dialog"
        className="relative w-full max-w-3xl bg-stone-900 border border-amber-600/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-stone-950 p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-100">
                {isNew ? 'Добавить новую точку боевого пути' : `Редактирование: ${formData.name}`}
              </h2>
              <p className="text-xs text-stone-400">
                Заполните исторические данные, цитаты из мемуаров и прикрепите аудиозапись
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 px-6 bg-stone-950/70 border-b border-stone-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'general'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Основные сведения
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'quotes'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Цитаты пилотов и письма
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'audio'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Аудиозапись воспоминаний
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Название пункта боевого пути *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Например: Иваново, Смоленск, р. Неман"
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Подзаголовок / Аэродром
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    placeholder="Например: Аэродром Дубровка, освобождение Белоруссии"
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Coordinates & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Широта (Latitude) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.lat}
                    onChange={(e) => handleChange('lat', parseFloat(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Долгота (Longitude) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.lng}
                    onChange={(e) => handleChange('lng', parseFloat(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Порядковый номер в пути
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => handleChange('order', parseInt(e.target.value) || 1)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Date & Aircraft */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Даты пребывания / боев
                  </label>
                  <input
                    type="text"
                    value={formData.dateRange}
                    onChange={(e) => handleChange('dateRange', e.target.value)}
                    placeholder="Например: 29 ноября 1942 — март 1943"
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-amber-400" />
                    Самолеты полка
                  </label>
                  <input
                    type="text"
                    value={formData.aircraft || ''}
                    onChange={(e) => handleChange('aircraft', e.target.value)}
                    placeholder="Например: Як-1Б, Як-9Т, Як-3"
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Phase */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Этап боевого пути
                </label>
                <select
                  value={formData.phase}
                  onChange={(e) => {
                    const selected = PHASES.find((p) => p.id === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      phase: e.target.value as CombatPhase,
                      phaseTitle: selected?.label.split(':')[1]?.trim() || prev.phaseTitle,
                    }));
                  }}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  {PHASES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Историческая справка *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Опишите события, происходившие на этом пункте боевого пути..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Show label checkbox */}
              <div className="flex items-center gap-2 p-3 bg-stone-950/60 rounded-lg border border-stone-800">
                <input
                  type="checkbox"
                  id="show-label-toggle"
                  checked={formData.showLabel !== false}
                  onChange={(e) => handleChange('showLabel', e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="show-label-toggle" className="text-stone-300 text-xs cursor-pointer">
                  <strong>Отображать постоянную крупную подпись на карте</strong> (требование Ирины Павловны к
                  читабельности пунктов)
                </label>
              </div>
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="space-y-5">
              {/* Pilot Quote */}
              <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Quote className="w-4 h-4" />
                  <span>Цитата из мемуаров пилота</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-400 text-xs mb-1">Имя пилота / автора</label>
                    <input
                      type="text"
                      value={formData.quote?.author || ''}
                      onChange={(e) => handleQuoteChange('author', e.target.value)}
                      placeholder="Например: Ролан де ла Пуап, Марсель Альбер"
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 text-xs mb-1">Звание / должность</label>
                    <input
                      type="text"
                      value={formData.quote?.role || ''}
                      onChange={(e) => handleQuoteChange('role', e.target.value)}
                      placeholder="Например: Герой Советского Союза, командир эскадрильи"
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-stone-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 text-xs mb-1">Текст цитаты</label>
                  <textarea
                    rows={3}
                    value={formData.quote?.text || ''}
                    onChange={(e) => handleQuoteChange('text', e.target.value)}
                    placeholder="Вставьте фрагмент из книги или воспоминаний пилота..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-stone-100 leading-relaxed italic"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-xs mb-1">Источник (книга, мемуары)</label>
                  <input
                    type="text"
                    value={formData.quote?.source || ''}
                    onChange={(e) => handleQuoteChange('source', e.target.value)}
                    placeholder="Например: Книга «В небе России», «Эпопея Нормандии — Неман»"
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-stone-100"
                  />
                </div>
              </div>

              {/* Archive Letter */}
              <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-stone-300 font-bold text-sm">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Архивное фронтовое письмо / документ</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-400 text-xs mb-1">Автор письма</label>
                    <input
                      type="text"
                      value={formData.letter?.author || ''}
                      onChange={(e) => handleLetterChange('author', e.target.value)}
                      placeholder="Например: Альбер Пресьози"
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-xs mb-1">Кому адресовано</label>
                    <input
                      type="text"
                      value={formData.letter?.recipient || ''}
                      onChange={(e) => handleLetterChange('recipient', e.target.value)}
                      placeholder="Например: Семье во Францию, Шарлю де Голлю"
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-xs mb-1">Дата письма</label>
                    <input
                      type="text"
                      value={formData.letter?.date || ''}
                      onChange={(e) => handleLetterChange('date', e.target.value)}
                      placeholder="Например: Январь 1943 г."
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-stone-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 text-xs mb-1">Текст письма</label>
                  <textarea
                    rows={3}
                    value={formData.letter?.text || ''}
                    onChange={(e) => handleLetterChange('text', e.target.value)}
                    placeholder="Вставьте цитату из письма французского авиатора..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-stone-100 leading-relaxed italic"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-4">
              <AudioRecorder
                initialAudioDataUrl={formData.audio?.dataUrl}
                onAudioSave={handleAudioSave}
                onAudioRemove={handleAudioRemove}
              />

              <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800 space-y-3">
                <h4 className="font-bold text-stone-200 text-xs uppercase tracking-wider">
                  Настройки озвучки и расшифровка
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-400 text-xs mb-1">Название аудиодорожки</label>
                    <input
                      type="text"
                      value={formData.audio?.title || ''}
                      onChange={(e) => handleAudioTranscriptChange('title', e.target.value)}
                      placeholder="Например: Голос памяти: бой над Смоленском"
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 text-xs mb-1">Кто читает / чтец</label>
                    <input
                      type="text"
                      value={formData.audio?.speaker || ''}
                      onChange={(e) => handleAudioTranscriptChange('speaker', e.target.value)}
                      placeholder="Например: Записано учителем истории А. И. Петровым"
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-stone-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 text-xs mb-1">
                    Текст для озвучки / расшифровка аудиозаписи
                  </label>
                  <textarea
                    rows={4}
                    value={formData.audio?.transcript || ''}
                    onChange={(e) => handleAudioTranscriptChange('transcript', e.target.value)}
                    placeholder="Этот текст используется для субтитров и автоматической озвучки роботом, если запись с микрофона еще не добавлена..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-stone-100 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form action buttons */}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
            {!isNew && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Удалить точку боевого пути «${formData.name}»?`)) {
                    onDelete(formData.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Удалить точку</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-lg transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Сохранить точку</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
