import React, { useState } from 'react';
import {
  REGIMENT_AIRCRAFT,
  REGIMENT_HEROES,
  REGIMENT_OVERVIEW,
} from '../data/regimentInfo';
import { NormandieEmblem } from './NormandieEmblem';
import { X, Award, Plane, BookOpen, Shield, Users, Trophy } from 'lucide-react';

interface RegimentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegimentModal: React.FC<RegimentModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'emblem' | 'heroes' | 'planes' | 'stats'>('history');

  if (!isOpen) return null;

  return (
    <div
      id="regiment-modal-backdrop"
      className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="regiment-modal-content"
        className="relative w-full max-w-4xl bg-stone-900 border border-amber-600/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header with Emblem */}
        <div className="relative bg-gradient-to-r from-stone-950 via-stone-900 to-red-950/80 p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-20 sm:w-20 sm:h-24 shrink-0 bg-stone-950/90 rounded-lg p-1.5 border border-amber-500/40 shadow-xl flex items-center justify-center">
              <NormandieEmblem className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-900/40 text-amber-300 border border-red-700/60 mb-1">
                <span>Франко-советское боевое братство</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                1-й отдельный истребительный авиационный полк «Нормандия — Неман»
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 italic">
                {REGIMENT_OVERVIEW.frenchTitle} • Девиз: {REGIMENT_OVERVIEW.motto}
              </p>
            </div>
          </div>

          <button
            id="close-regiment-modal-btn"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Закрыть"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 bg-stone-950 border-b border-stone-800 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>История и подвиг</span>
          </button>
          <button
            onClick={() => setActiveTab('emblem')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'emblem'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>О символике эмблемы</span>
          </button>
          <button
            onClick={() => setActiveTab('heroes')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'heroes'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Герои Советского Союза</span>
          </button>
          <button
            onClick={() => setActiveTab('planes')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'planes'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Боевые самолеты Як</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'stats'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Боевой счет и награды</span>
          </button>
        </div>

        {/* Tab content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-stone-300 text-sm leading-relaxed">
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800">
                <h3 className="text-base font-bold text-amber-300 mb-2">Как создавался полк</h3>
                <p className="mb-2">
                  В марте 1942 года национальный освободительный комитет «Свободная Франция» под руководством
                  генерала Шарля де Голля обратился к властям Советского Союза с предложением направить группу
                  французских летчиков и авиационных специалистов для участия в совместных боевых действиях против
                  нацистской Германии на Восточном фронте.
                </p>
                <p>
                  25 ноября 1942 года было подписано советско-французское соглашение о формировании эскадрильи. 29
                  ноября 1942 года первые 14 летчиков-добровольцев прибыли в город Иваново, где начали осваивать
                  советские истребители Як-1 под руководством опытных инструкторов.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {REGIMENT_OVERVIEW.commanders.map((cmd, i) => (
                  <div key={i} className="bg-stone-850 p-3 rounded-lg border border-stone-800">
                    <span className="text-xs text-amber-400 font-semibold block">Командир полка</span>
                    <span className="font-bold text-stone-100 text-sm">{cmd.name}</span>
                    <p className="text-xs text-stone-400 mt-1">{cmd.role}</p>
                  </div>
                ))}
              </div>

              <div className="border-l-4 border-amber-500 pl-4 py-1 italic bg-stone-950/40 rounded-r-lg">
                <p className="text-stone-200">
                  «Франция никогда не забудет, что полк "Нормандия — Неман" сражался плечом к плечу с Красной Армией в
                  самых ожесточенных битвах за освобождение Европы».
                </p>
                <span className="text-xs text-amber-400 not-italic block mt-1">
                  — Шарль де Голль, Президент Франции
                </span>
              </div>
            </div>
          )}

          {activeTab === 'emblem' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-5 items-center bg-stone-950/70 p-5 rounded-xl border border-stone-800">
                <div className="w-28 h-36 shrink-0 bg-stone-900 rounded-xl p-2 border border-amber-500/40 shadow-xl flex items-center justify-center">
                  <NormandieEmblem className="w-full h-full object-contain filter drop-shadow" showText={true} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-amber-300">Смысл и символика эмблемы</h3>
                  <p className="text-stone-300">
                    {REGIMENT_OVERVIEW.emblemMeaning}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2.5 bg-stone-900/80 rounded border border-stone-800">
                      <span className="font-bold text-red-400 block mb-0.5">Червленый щит и два леопарда</span>
                      Традиционный исторический герб древнего французского герцогства Нормандия.
                    </div>
                    <div className="p-2.5 bg-stone-900/80 rounded border border-stone-800">
                      <span className="font-bold text-amber-300 block mb-0.5">Серебряная молния Немана</span>
                      Стрела-молния через весь щит символизирует реку Неман и несокрушимость совместного наступления.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-stone-950/40 p-4 rounded-xl border border-stone-800 text-xs text-stone-400">
                <p>
                  <strong className="text-stone-200">Примечание:</strong> Изначально эскадрилья использовала
                  классический герб Нормандии. После победоносных боев на реке Неман в июле-августе 1944 года и
                  присвоения полку звания «Неманский» летчики добавили на эмблему белую стрелу-молнию.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'heroes' && (
            <div className="space-y-4">
              <p className="text-stone-400 text-xs">
                Четверо французских летчиков полка «Нормандия — Неман» за беспримерное мужество в боях против
                немецко-фашистских захватчиков были удостоены высшей государственной награды СССР — звания Героя
                Советского Союза:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {REGIMENT_HEROES.map((hero, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-stone-950/70 border border-stone-800 hover:border-amber-500/50 rounded-xl transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-amber-300 text-base">{hero.name}</h4>
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shrink-0">
                        <Award className="w-3.5 h-3.5" />
                        {hero.victories} побед
                      </span>
                    </div>
                    <span className="text-xs text-stone-400 block font-medium">{hero.title}</span>
                    <p className="text-xs text-stone-300 leading-normal">{hero.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'planes' && (
            <div className="space-y-4">
              <p className="text-stone-400 text-xs">
                Французским добровольцам в 1942 году было предложено выбрать любые самолеты: британские «Харрикейны»,
                американские «Аэрокобры» или советские «Яки». Летчики опробовали машины и единодушно заявили:
                «Мы выбираем русский Як!».
              </p>

              <div className="space-y-3">
                {REGIMENT_AIRCRAFT.map((plane, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2 hover:border-amber-600/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-amber-300 text-lg">{plane.model}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                        {plane.badge}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-stone-200 block">{plane.name} ({plane.years})</span>
                    <p className="text-xs text-stone-300">{plane.notes}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-stone-400">
                      <span><strong>Скорость:</strong> {plane.speed}</span>
                      <span><strong>Вооружение:</strong> {plane.armament}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {REGIMENT_OVERVIEW.stats.map((st, i) => (
                  <div key={i} className="p-3.5 bg-stone-950/80 rounded-xl border border-stone-800 text-center">
                    <span className="font-serif font-extrabold text-2xl sm:text-3xl text-amber-400 block mb-1">
                      {st.value}
                    </span>
                    <span className="text-xs font-bold text-stone-200 block">{st.label}</span>
                    <span className="text-[11px] text-stone-400 block mt-0.5">{st.desc}</span>
                  </div>
                ))}
              </div>

              <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-2">
                <h4 className="font-bold text-stone-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Боевые награды полка
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {REGIMENT_OVERVIEW.awards.map((aw, i) => (
                    <li key={i} className="flex items-center gap-2 text-stone-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{aw}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span>Проект «Герои Нормандии — Неман цифровому поколению»</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
