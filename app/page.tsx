"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import ProgressBar from "@/components/ProgressBar";
import { useFFmpeg } from "@/hooks/useFFmpeg";

export default function Home() {
  const { isReady, isProcessing, progress, resultUrl, error, extractAudio } =
    useFFmpeg();

  // Konfigurasi State Options
  const [format, setFormat] = useState<string>("mp3");
  const [startTime, setStartTime] = useState<string>(""); // dalam detik
  const [duration, setDuration] = useState<string>(""); // dalam detik
  const [bitrate, setBitrate] = useState<string>("192k"); // default 192 kbps

  const handleFileSelect = (file: File) => {
    extractAudio(file, {
      format,
      startTime: startTime ? parseFloat(startTime) : 0,
      duration: duration ? parseFloat(duration) : 0,
      bitrate,
    });
  };

  return (
    <main className="flex-1 w-full bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            WASM Media Tool
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Extract, trim, and convert audio in your browser with advanced
            options.
          </p>
        </div>

        {/* LOADING STATE */}
        {!isReady && (
          <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 text-center animate-pulse border border-blue-100">
            Loading FFmpeg WASM Core (Multi-Thread)... Please wait.
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* --- ADVANCED OPTIONS PANEL --- */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Advanced Settings
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Format Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="Popular">
                  <option value="mp3">.MP3 (Universal)</option>
                  <option value="m4a">.M4A (Apple/MPEG-4)</option>
                  <option value="aac">.AAC (High Quality)</option>
                </optgroup>
                <optgroup label="Lossless">
                  <option value="wav">.WAV (Raw)</option>
                  <option value="flac">.FLAC (Compressed)</option>
                </optgroup>
                <optgroup label="Web / Others">
                  <option value="opus">.OPUS</option>
                  <option value="ogg">.OGG</option>
                  <option value="ac3">.AC3</option>
                </optgroup>
              </select>
            </div>

            {/* Bitrate Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Audio Quality (Bitrate)
              </label>
              <select
                value={bitrate}
                onChange={(e) => setBitrate(e.target.value)}
                disabled={isProcessing || ["wav", "flac"].includes(format)}
                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="96k">96 kbps (Low)</option>
                <option value="128k">128 kbps (Standard)</option>
                <option value="192k">192 kbps (Good)</option>
                <option value="320k">320 kbps (Maximum)</option>
              </select>
            </div>
          </div>

          {/* Trimming Inputs */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Start Time (Detik / Opsional)
              </label>
              <input
                type="number"
                placeholder="Contoh: 10"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Duration / Durasi (Detik)
              </label>
              <input
                type="number"
                placeholder="Contoh: 30 (Biarkan kosong jika full)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* DRAG & DROP AREA */}
        <Dropzone
          onFileSelect={handleFileSelect}
          disabled={!isReady || isProcessing}
        />

        {/* PROGRESS BAR */}
        {isProcessing && <ProgressBar progress={progress} />}

        {/* DOWNLOAD SECTION */}
        {resultUrl && !isProcessing && (
          <div className="mt-6 flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="p-4 bg-green-50 rounded-full mb-3">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <p className="text-green-700 font-medium mb-3">
              Processing Complete!
            </p>
            <a
              href={resultUrl}
              download={`processed-audio.${format}`}
              className="w-full text-center px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors shadow-sm"
            >
              Download Audio ({format.toUpperCase()})
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
