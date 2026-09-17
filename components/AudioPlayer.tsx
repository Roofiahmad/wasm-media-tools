"use client";

import { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  audioUrl: string;
  fileName: string;
}

export default function AudioPlayer({ audioUrl, fileName }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bars = 48; // Jumlah batang waveform
    const barWidth = canvas.width / bars - 2;

    for (let i = 0; i < bars; i++) {
      // Generate tinggi batang acak yang simetris/estetik (bisa diganti AnalyserNode jika mau real-time)
      const barHeight = Math.max(
        8,
        Math.sin(i * 0.3) * 25 + Math.random() * 20,
      );
      const x = i * (barWidth + 2);
      const y = (canvas.height - barHeight) / 2;

      ctx.fillStyle = "#3b82f6"; // Warna biru Tailwind (blue-500)
      ctx.roundRect
        ? ctx.roundRect(x, y, barWidth, barHeight, 4)
        : ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fill();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      drawWaveform();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-full bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Info File */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <div className="truncate">
            <p className="text-xs text-slate-400">Ready to Preview</p>
            <p className="text-sm font-medium text-slate-200 truncate">
              {fileName}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono bg-slate-800 text-blue-400 px-2.5 py-1 rounded-full">
          {formatTime(duration)}
        </span>
      </div>

      {/* Canvas Waveform Preview */}
      <div className="relative w-full h-16 bg-slate-950/60 rounded-xl overflow-hidden flex items-center px-2 border border-slate-800/80">
        <canvas
          ref={canvasRef}
          width={400}
          height={50}
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      {/* Controller & Seekbar */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-11 h-11 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center text-white transition-transform active:scale-95 shadow-md shrink-0 cursor-pointer"
          >
            {isPlaying ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>

          {/* Range Slider / Seekbar */}
          <div className="flex-1 flex flex-col justify-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
