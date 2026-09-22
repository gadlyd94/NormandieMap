import { useState, useEffect, useRef, useCallback } from 'react';
import { Waypoint, MapThemeId, LabelSize } from './types';
import { INITIAL_WAYPOINTS } from './data/defaultPath';
import { HeaderNav } from './components/HeaderNav';
import { MapViewer } from './components/MapViewer';
import { EmblemBadge } from './components/EmblemBadge';
import { RegimentModal } from './components/RegimentModal';
import { WaypointDetailPanel } from './components/WaypointDetailPanel';
import { WaypointEditorModal } from './components/WaypointEditorModal';
import { TimelineBar } from './components/TimelineBar';

const STORAGE_KEY = 'normandie_combat_path_data_v1';
const THEME_STORAGE_KEY = 'normandie_map_theme_v1';
const LABEL_SIZE_STORAGE_KEY = 'normandie_label_size_v1';

export default function App() {
  // Load saved waypoints or fallback to default historical route
  const [waypoints, setWaypoints] = useState<Waypoint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved waypoints from localStorage:', e);
    }
    return INITIAL_WAYPOINTS;
  });

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [mapTheme, setMapTheme] = useState<MapThemeId>(() => {
    return (localStorage.getItem(THEME_STORAGE_KEY) as MapThemeId) || 'vintage';
  });
  const [labelSize, setLabelSize] = useState<LabelSize>(() => {
    return (localStorage.getItem(LABEL_SIZE_STORAGE_KEY) as LabelSize) || 'large';
  });

  // Modal / Panel states
  const [isRegimentModalOpen, setIsRegimentModalOpen] = useState<boolean>(false);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState<boolean>(true);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState<boolean>(false);
  const [editingWaypoint, setEditingWaypoint] = useState<Waypoint | null>(null);
  const [isNewWaypoint, setIsNewWaypoint] = useState<boolean>(false);
  const [isAddingPointViaMap, setIsAddingPointViaMap] = useState<boolean>(false);
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const tourTimerRef = useRef<number | null>(null);

  // Persist waypoints
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(waypoints));
    } catch (err) {
      console.error('Error saving waypoints to localStorage:', err);
    }
  }, [waypoints]);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mapTheme);
  }, [mapTheme]);

  useEffect(() => {
    localStorage.setItem(LABEL_SIZE_STORAGE_KEY, labelSize);
  }, [labelSize]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Automated flight path tour
  useEffect(() => {
    if (isPlayingTour) {
      tourTimerRef.current = window.setInterval(() => {
        setSelectedIndex((prev) => {
          if (prev >= waypoints.length - 1) {
            setIsPlayingTour(false);
            showToast('Маршрут полета эскадрильи завершен!');
            return 0;
          }
          return prev + 1;
        });
      }, 5500);
    } else if (tourTimerRef.current) {
      clearInterval(tourTimerRef.current);
      tourTimerRef.current = null;
    }

    return () => {
      if (tourTimerRef.current) {
        clearInterval(tourTimerRef.current);
      }
    };
  }, [isPlayingTour, waypoints.length, showToast]);

  // Select waypoint
  const handleSelectIndex = (idx: number) => {
    if (idx >= 0 && idx < waypoints.length) {
      setSelectedIndex(idx);
      setIsDetailPanelOpen(true);
    }
  };

  // Open editor for existing waypoint
  const handleOpenEditWaypoint = (wp: Waypoint) => {
    setEditingWaypoint(wp);
    setIsNewWaypoint(false);
    setIsEditorModalOpen(true);
  };

  // Start adding new point
  const handleStartAddWaypoint = () => {
    setIsAddingPointViaMap(true);
    showToast('Кликните на карту в том месте, где находился пункт боевого пути');
  };

  // Click on map to add waypoint
  const handleMapClickAdd = (lat: number, lng: number) => {
    setIsAddingPointViaMap(false);
    const newWp: Waypoint = {
      id: `pt-custom-${Date.now()}`,
      order: waypoints.length + 1,
      name: 'Новый пункт боевого пути',
      subtitle: 'Фронтовой аэродром',
      lat,
      lng,
      dateRange: '1943 — 1944 гг.',
      phase: 'smolensk',
      phaseTitle: 'Боевые операции',
      description: 'Введите описание боевых вылетов и событий на этом участке фронта...',
      aircraft: 'Як-3',
      showLabel: true,
      quote: {
        author: 'Пилот полка Нормандия — Неман',
        role: 'Летчик-истребитель',
        text: '«Мы помним этот аэродром и тяжелые бои в этом секторе...»',
        source: 'Воспоминания ветеранов',
      },
      audio: {
        type: 'speech',
        title: 'Голос памяти',
        speaker: 'Запись учителя',
        transcript: 'Короткий отрывок из воспоминаний пилота...',
      },
    };

    setEditingWaypoint(newWp);
    setIsNewWaypoint(true);
    setIsEditorModalOpen(true);
  };

  // Save waypoint from editor
  const handleSaveWaypoint = (savedWp: Waypoint) => {
    setWaypoints((prev) => {
      const existsIndex = prev.findIndex((w) => w.id === savedWp.id);
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = savedWp;
        return next;
      } else {
        const next = [...prev, savedWp];
        // Sort by order
        return next.sort((a, b) => a.order - b.order);
      }
    });

    showToast(`Точка «${savedWp.name}» успешно сохранена!`);
  };

  // Delete waypoint
  const handleDeleteWaypoint = (id: string) => {
    setWaypoints((prev) => prev.filter((w) => w.id !== id));
    setSelectedIndex(0);
    showToast('Пункт боевого пути удален.');
  };

  // Update marker coordinates via dragging
  const handleUpdateCoordinates = (id: string, lat: number, lng: number) => {
    setWaypoints((prev) =>
      prev.map((w) => (w.id === id ? { ...w, lat, lng } : w))
    );
    showToast('Координаты точки обновлены');
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(waypoints, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'normandie_combat_path.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Файл проекта normandie_combat_path.json успешно скачан!');
  };

  // Import JSON
  const handleImportJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setWaypoints(parsed);
        setSelectedIndex(0);
        showToast(`Успешно загружено ${parsed.length} пунктов боевого пути!`);
      } else {
        alert('Некорректный формат файла. Требуется список точек в формате JSON.');
      }
    } catch (err) {
      console.error('Import error:', err);
      alert('Ошибка при чтении файла JSON.');
    }
  };

  // Reset to default
  const handleResetData = () => {
    setWaypoints(INITIAL_WAYPOINTS);
    setSelectedIndex(0);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Карта возвращена к исходным историческим данным.');
  };

  const activeWaypoint = waypoints[selectedIndex] || waypoints[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans select-none">
      {/* Top Header Navigation */}
      <HeaderNav
        isEditMode={isEditMode}
        onToggleEditMode={() => {
          setIsEditMode(!isEditMode);
          setIsAddingPointViaMap(false);
          showToast(!isEditMode ? 'Режим редактирования включен' : 'Режим просмотра включен');
        }}
        mapTheme={mapTheme}
        onChangeMapTheme={setMapTheme}
        labelSize={labelSize}
        onChangeLabelSize={setLabelSize}
        onAddWaypoint={handleStartAddWaypoint}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetData={handleResetData}
      />

      {/* Left Emblem Badge (opens Regiment dossier) */}
      <EmblemBadge
        onClick={() => setIsRegimentModalOpen(true)}
        isOpen={isRegimentModalOpen}
      />

      {/* Regiment Dossier Modal */}
      <RegimentModal
        isOpen={isRegimentModalOpen}
        onClose={() => setIsRegimentModalOpen(false)}
      />

      {/* Main Interactive Map */}
      <main className="w-full h-full">
        <MapViewer
          waypoints={waypoints}
          selectedIndex={selectedIndex}
          onSelectIndex={handleSelectIndex}
          isEditMode={isEditMode}
          mapTheme={mapTheme}
          labelSize={labelSize}
          onUpdateCoordinates={handleUpdateCoordinates}
          onMapClickAdd={handleMapClickAdd}
          isAddingPoint={isAddingPointViaMap}
        />
      </main>

      {/* Right Drawer / Waypoint Detail Panel */}
      {isDetailPanelOpen && activeWaypoint && (
        <WaypointDetailPanel
          waypoint={activeWaypoint}
          totalWaypoints={waypoints.length}
          currentIndex={selectedIndex}
          onClose={() => setIsDetailPanelOpen(false)}
          onSelectIndex={handleSelectIndex}
          onEditWaypoint={handleOpenEditWaypoint}
        />
      )}

      {/* Waypoint Editor Modal */}
      <WaypointEditorModal
        isOpen={isEditorModalOpen}
        waypoint={editingWaypoint}
        isNew={isNewWaypoint}
        onClose={() => {
          setIsEditorModalOpen(false);
          setEditingWaypoint(null);
        }}
        onSave={handleSaveWaypoint}
        onDelete={handleDeleteWaypoint}
      />

      {/* Bottom Chronological Timeline Bar */}
      <TimelineBar
        waypoints={waypoints}
        selectedIndex={selectedIndex}
        onSelectIndex={handleSelectIndex}
        isPlayingTour={isPlayingTour}
        onTogglePlayTour={() => setIsPlayingTour(!isPlayingTour)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[3000] px-4 py-2 bg-stone-900/95 text-amber-300 border border-amber-500/60 rounded-xl shadow-2xl text-xs sm:text-sm font-semibold backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
