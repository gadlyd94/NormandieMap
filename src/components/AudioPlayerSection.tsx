import React, { useState, useEffect, useRef } from 'react';
import { WaypointAudio } from '../types';
import { Play, Pause, Square, Volume2, Mic, AlertCircle } from 'lucide-react';

interface AudioPlayerSectionProps {
  audio?: WaypointAudio;
  quoteText?: string;
  authorName?: string;
}

export const AudioPlayerSection: React.FC<AudioPlayerSectionProps> = ({
  audio,
  quoteText,
  authorName,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop playback when audio source or waypoint changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setSpeechActive(false);
    setCurrentTime(0);
  }, [audio?.dataUrl, audio?.url, quoteText]);

  // Audio element event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Audio play error:', err));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  // Web Speech API fallback
  const toggleSpeech = () => {
    if (!window.speechSynthesis) return;

    if (speechActive) {
      window.speechSynthesis.cancel();
      setSpeechActive(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak =
        audio?.transcript ||
        (quoteText
          ? `${authorName ? `Говорит ${authorName}.` : ''} ${quoteText}`
          : '');

      if (!textToSpeak) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.95; // deliberate, solemn pace
      utterance.pitch = 0.92; // lower masculine resonance

      utterance.onend = () => setSpeechActive(false);
      utterance.onerror = () => setSpeechActive(false);

      window.speechSynthesis.speak(utterance);
      setSpeechActive(true);
    }
  };

  const hasAudioSource = Boolean(audio?.dataUrl || audio?.url);
  const audioSrc = audio?.dataUrl || audio?.url;

  return (
    <div className="bg-stone-950/80 rounded-xl p-3.5 border border-stone-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span>{audio?.title || 'Голос памяти: аудиозапись воспоминаний'}</span>
        </div>
        {audio?.speaker && (
          <span className="text-[11px] text-stone-400 italic max-w-[200px] truncate">
            {audio.speaker}
          </span>
        )}
      </div>

      {/* Case 1: Recorded or uploaded audio file exists */}
      {hasAudioSource ? (
        <div className="space-y-2">
          <audio
            ref={audioRef}
            src={audioSrc}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            preload="metadata"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleAudio}
              className="w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0"
              title={isPlaying ? 'Пауза' : 'Слушать запись'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <div className="flex-1 flex flex-col gap-1">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Case 2: No recorded audio yet, but speech synthesis available */
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3 p-2 bg-stone-900/90 rounded-lg border border-stone-800">
            <div className="flex items-center gap-2 text-xs text-stone-300">
              <Mic className="w-4 h-4 text-stone-400 shrink-0" />
              <span>Озвучить воспоминание голосом диктора:</span>
            </div>
            <button
              type="button"
              onClick={toggleSpeech}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                speechActive
                  ? 'bg-red-700 hover:bg-red-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {speechActive ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Остановить</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Слушать диктора</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Учителя могут записать свой голос в режиме «Редактирование».</span>
          </div>
        </div>
      )}

      {/* Transcript preview if available */}
      {audio?.transcript && (
        <div className="text-xs text-stone-300 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80 italic leading-relaxed">
          «{audio.transcript}»
        </div>
      )}
    </div>
  );
};

function formatTime(sec: number): string {
  if (isNaN(sec) || !isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
