export type CombatPhase =
  | 'formation' // Формирование и первые бои (1942–1943)
  | 'kursk_orel' // Курская дуга и Орёл (весна–лето 1943)
  | 'smolensk' // Смоленская операция (осень 1943)
  | 'niemen' // Освобождение Белоруссии и форсирование Немана (1944)
  | 'prussia' // Восточная Пруссия и штурм Кёнигсберга (1944–1945)
  | 'triumph'; // Москва и триумф в Париже (май–июнь 1945)

export interface WaypointQuote {
  text: string;
  author: string;
  role?: string;
  source?: string;
}

export interface WaypointLetter {
  text: string;
  author: string;
  recipient?: string;
  date?: string;
  archiveReference?: string;
}

export interface WaypointAudio {
  type: 'none' | 'recorded' | 'url' | 'speech';
  dataUrl?: string; // base64 recorded audio from microphone or file upload
  url?: string;
  title?: string;
  speaker?: string; // e.g. "Озвучено учителем истории В. М. Смирновым"
  transcript?: string;
}

export interface WaypointPhoto {
  url: string;
  caption: string;
  source?: string;
}

export interface Waypoint {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
  dateRange: string;
  phase: CombatPhase;
  phaseTitle: string;
  description: string;
  aircraft?: string;
  quote?: WaypointQuote;
  letter?: WaypointLetter;
  audio?: WaypointAudio;
  photos?: WaypointPhoto[];
  historicalFacts?: string[];
  showLabel?: boolean;
}

export type MapThemeId = 'vintage' | 'dark' | 'light' | 'satellite';

export type LabelSize = 'normal' | 'large' | 'huge';

export interface MapThemeConfig {
  id: MapThemeId;
  name: string;
  tileUrl: string;
  attribution: string;
  maxZoom: number;
  polylineColor: string;
  pulseColor: string;
}

export interface RegimentHero {
  name: string;
  title: string;
  victories: number;
  bio: string;
  photoUrl?: string;
}

export interface RegimentAircraft {
  model: string;
  name: string;
  years: string;
  speed: string;
  armament: string;
  notes: string;
  badge: string;
}
