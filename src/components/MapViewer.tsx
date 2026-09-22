import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Waypoint, MapThemeId, LabelSize } from '../types';

interface MapViewerProps {
  waypoints: Waypoint[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  isEditMode: boolean;
  mapTheme: MapThemeId;
  labelSize: LabelSize;
  onUpdateCoordinates?: (id: string, lat: number, lng: number) => void;
  onMapClickAdd?: (lat: number, lng: number) => void;
  isAddingPoint?: boolean;
}

const THEME_TILES: Record<
  MapThemeId,
  { url: string; subdomains?: string[]; attribution: string; cssFilter?: string }
> = {
  vintage: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    attribution: '&copy; CartoDB, &copy; OpenStreetMap contributors',
    cssFilter: 'sepia(0.25) contrast(1.05) brightness(0.95)',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    attribution: '&copy; CartoDB, &copy; OpenStreetMap contributors',
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    attribution: '&copy; CartoDB, &copy; OpenStreetMap contributors',
  },
  satellite: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
};

export const MapViewer: React.FC<MapViewerProps> = ({
  waypoints,
  selectedIndex,
  onSelectIndex,
  isEditMode,
  mapTheme,
  labelSize,
  onUpdateCoordinates,
  onMapClickAdd,
  isAddingPoint,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);
  const planeMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center between France and Central Russia
    const map = L.map(mapContainerRef.current, {
      center: [54.5, 34.0],
      zoom: 6,
      minZoom: 4,
      maxZoom: 16,
      zoomControl: false,
    });

    // Add zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when theme changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = THEME_TILES[mapTheme] || THEME_TILES.vintage;
    const tileLayer = L.tileLayer(config.url, {
      subdomains: config.subdomains || 'abc',
      attribution: config.attribution,
      maxZoom: 18,
    });

    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;

    // Apply CSS filter to tiles container for vintage or custom mood
    const container = map.getContainer();
    const tilePane = container.querySelector('.leaflet-tile-pane') as HTMLElement | null;
    if (tilePane) {
      tilePane.style.filter = config.cssFilter || 'none';
    }
  }, [mapTheme]);

  // Handle map click for adding points in edit mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (isAddingPoint && onMapClickAdd) {
        onMapClickAdd(e.latlng.lat, e.latlng.lng);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isAddingPoint, onMapClickAdd]);

  // Update Markers, Labels & Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (waypoints.length === 0) return;

    // Calculate font sizes according to user requirement ("Пункты боевого пути подписать крупнее")
    const fontSizeClass =
      labelSize === 'huge'
        ? 'text-lg sm:text-xl py-1.5 px-3.5 border-2'
        : labelSize === 'large'
        ? 'text-sm sm:text-base py-1 px-3 border-[1.5px]'
        : 'text-xs sm:text-sm py-0.5 px-2 border';

    const coords: [number, number][] = waypoints.map((w) => [w.lat, w.lng]);

    // Draw Flight Path Polyline
    const polyline = L.polyline(coords, {
      color: mapTheme === 'dark' ? '#fbbf24' : '#b91c1c',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '8, 6',
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    polylineRef.current = polyline;

    // Create markers for each waypoint
    waypoints.forEach((wp, idx) => {
      const isActive = idx === selectedIndex;

      // Custom HTML Pin combining French tricolor rim & Soviet red star insignia
      const pinHtml = `
        <div class="relative group cursor-pointer flex items-center justify-center">
          ${
            isActive
              ? '<div class="absolute -inset-2 bg-amber-400 rounded-full animate-ping opacity-40"></div>'
              : ''
          }
          <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full ${
            isActive
              ? 'bg-amber-500 ring-4 ring-amber-400 text-stone-950 scale-110 shadow-2xl'
              : 'bg-red-800 ring-2 ring-amber-500/80 text-white shadow-lg hover:scale-110'
          } flex items-center justify-center font-bold text-xs sm:text-sm font-mono transition-transform duration-200">
            ${idx + 1}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-leaflet-pin',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([wp.lat, wp.lng], {
        icon: customIcon,
        draggable: isEditMode,
        title: wp.name,
      }).addTo(map);

      // Add large readable label directly on map (as requested by Irina Pavlovna)
      if (wp.showLabel !== false) {
        const yearMatch = wp.dateRange.match(/\b(194[2-5])\b/g);
        const yearBadge = yearMatch ? yearMatch.join('–') : '';

        const labelContent = `
          <div class="flex items-center gap-1.5 ${fontSizeClass} bg-stone-900/95 text-stone-100 font-bold border-amber-600/80 rounded-md shadow-xl whitespace-nowrap">
            <span class="text-amber-400 font-serif tracking-wide">${wp.name}</span>
            ${yearBadge ? `<span class="text-[10px] text-stone-400 font-mono font-normal">(${yearBadge})</span>` : ''}
          </div>
        `;

        marker.bindTooltip(labelContent, {
          permanent: true,
          direction: 'top',
          offset: [0, -18],
          className: 'battle-path-label',
        });
      }

      // Marker click handler
      marker.on('click', () => {
        onSelectIndex(idx);
      });

      // Drag handler in edit mode
      if (isEditMode) {
        marker.on('dragend', (e) => {
          const newPos = (e.target as L.Marker).getLatLng();
          if (onUpdateCoordinates) {
            onUpdateCoordinates(wp.id, newPos.lat, newPos.lng);
          }
        });
      }

      markersRef.current.push(marker);
    });

    // Add plane marker at active position
    if (planeMarkerRef.current) {
      map.removeLayer(planeMarkerRef.current);
      planeMarkerRef.current = null;
    }

    const activeWp = waypoints[selectedIndex];
    if (activeWp) {
      const planeHtml = `
        <div class="relative flex items-center justify-center text-amber-300 drop-shadow-xl animate-bounce">
          <svg class="w-7 h-7 filter drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
      `;

      const planeIcon = L.divIcon({
        html: planeHtml,
        className: 'active-plane-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 32],
      });

      planeMarkerRef.current = L.marker([activeWp.lat, activeWp.lng], {
        icon: planeIcon,
        zIndexOffset: 1000,
      }).addTo(map);
    }
  }, [waypoints, selectedIndex, isEditMode, mapTheme, labelSize, onSelectIndex, onUpdateCoordinates]);

  // Smoothly pan map to selected waypoint
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const activeWp = waypoints[selectedIndex];
    if (activeWp) {
      map.flyTo([activeWp.lat, activeWp.lng], Math.max(map.getZoom(), 7), {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [selectedIndex, waypoints]);

  return (
    <div className="relative w-full h-full">
      <div
        id="normandie-leaflet-map"
        ref={mapContainerRef}
        className="w-full h-full z-0 bg-stone-950"
      />

      {/* Adding point overlay notification in Edit Mode */}
      {isAddingPoint && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1100] bg-emerald-900/90 text-white border border-emerald-500 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-sm animate-pulse">
          <span>Кликните в любую точку на карте, чтобы добавить пункт боевого пути</span>
        </div>
      )}
    </div>
  );
};
