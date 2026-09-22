import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Trash2, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AudioRecorderProps {
  initialAudioDataUrl?: string;
  onAudioSave: (dataUrl: string) => void;
  onAudioRemove: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  initialAudioDataUrl,
  onAudioSave,
  onAudioRemove,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialAudioDataUrl);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setPreviewUrl(base64String);
          onAudioSave(base64String);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks on the stream to release mic
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      console.error('Microphone access error:', err);
      setErrorMessage(
        'Не удалось получить доступ к микрофону. Проверьте разрешения браузера или загрузите аудиофайл вручную.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Размер файла превышает 15 МБ. Выберите файл меньшего размера.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
      onAudioSave(base64);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const togglePreviewPlay = () => {
    if (!audioPreviewRef.current) return;
    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current
        .play()
        .then(() => setIsPlayingPreview(true))
        .catch((e) => console.error(e));
    }
  };

  const handleRemove = () => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
    }
    setPreviewUrl(undefined);
    setIsPlayingPreview(false);
    onAudioRemove();
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-stone-900/90 rounded-xl p-3 border border-stone-700/60 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5" />
          Запись голоса (для учителей и чтецов)
        </span>
        {previewUrl && (
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Аудио прикреплено
          </span>
        )}
      </div>

      {errorMessage && (
        <div className="p-2 bg-red-950/70 border border-red-700/60 rounded-lg text-xs text-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow transition-colors cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>Начать запись с микрофона</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow animate-pulse transition-colors cursor-pointer"
          >
            <Square className="w-4 h-4" />
            <span>Остановить запись ({formatTimer(recordingTime)})</span>
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium border border-stone-700 transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Загрузить аудиофайл</span>
        </button>
      </div>

      {/* Preview player */}
      {previewUrl && (
        <div className="flex items-center gap-3 p-2 bg-stone-950 rounded-lg border border-stone-800">
          <audio
            ref={audioPreviewRef}
            src={previewUrl}
            onEnded={() => setIsPlayingPreview(false)}
          />
          <button
            type="button"
            onClick={togglePreviewPlay}
            className="w-8 h-8 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center cursor-pointer transition-colors"
            title={isPlayingPreview ? 'Пауза' : 'Слушать запись'}
          >
            {isPlayingPreview ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <div className="flex-1 text-xs text-stone-300">
            <span className="font-medium block">Готовая аудиозапись</span>
            <span className="text-[10px] text-stone-500">Сохранена в проекте</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 text-stone-400 hover:text-red-400 rounded transition-colors cursor-pointer"
            title="Удалить запись"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
