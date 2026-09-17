"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import ProgressBar from "@/components/ProgressBar";
import AudioPlayer from "@/components/AudioPlayer";
import { useFFmpeg } from "@/hooks/useFFmpeg";

export default function Home() {
  const {
    isReady,
    isProcessing,
    progress,
    resultUrl,
    error,
    extractAudio,
    compressVideo,
    convertVideo,
  } = useFFmpeg();

  const [activeTab, setActiveTab] = useState<"audio" | "compress" | "convert">(
    "audio",
  );

  // State Audio Options (Lengkap dengan Trimming / Clipping)
  const [format, setFormat] = useState<string>("mp3");
  const [startTime, setStartTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [bitrate, setBitrate] = useState<string>("192k");

  // State Video Compression Options
  const [resolution, setResolution] = useState<string>("720");
  const [videoBitrate, setVideoBitrate] = useState<string>("1500k");

  // State Video Converter Options
  const [videoFormat, setVideoFormat] = useState<string>("mp4");
  const [selectedFileName, setSelectedFileName] =
    useState<string>("media-output");

  const handleFileSelect = (file: File) => {
    const cleanName =
      file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    setSelectedFileName(cleanName);

    if (activeTab === "audio") {
      extractAudio(file, {
        format,
        startTime: startTime ? parseFloat(startTime) : 0,
        duration: duration ? parseFloat(duration) : 0,
        bitrate,
      });
    } else if (activeTab === "compress") {
      compressVideo(file, {
        resolution,
        videoBitrate,
      });
    } else {
      convertVideo(file, {
        format: videoFormat,
      });
    }
  };

  return (
    <main className="flex-1 w-full bg-gray-50 py-12 px-4 flex flex-col items-center justify-start">
      {/* CARD TOOL UTAMA */}
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            WASM Media Tool
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Extract audio, compress video, and convert formats 100% locally in
            your browser.
          </p>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab("audio")}
            disabled={isProcessing}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === "audio"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            🎵 Audio Extract
          </button>
          <button
            onClick={() => setActiveTab("compress")}
            disabled={isProcessing}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === "compress"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            🎬 Compress
          </button>
          <button
            onClick={() => setActiveTab("convert")}
            disabled={isProcessing}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === "convert"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            🔄 Video Convert
          </button>
        </div>

        {/* LOADING & ERROR */}
        {!isReady && (
          <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 text-center animate-pulse border border-blue-100">
            Loading FFmpeg WASM Core (Multi-Thread)... Please wait.
          </div>
        )}

        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* SETTINGS PANELS */}
        {activeTab === "audio" && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Audio Settings & Trimming
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mp3" className="text-gray-900 bg-white">
                    .MP3
                  </option>
                  <option value="m4a" className="text-gray-900 bg-white">
                    .M4A
                  </option>
                  <option value="aac" className="text-gray-900 bg-white">
                    .AAC
                  </option>
                  <option value="wav" className="text-gray-900 bg-white">
                    .WAV
                  </option>
                  <option value="flac" className="text-gray-900 bg-white">
                    .FLAC
                  </option>
                  <option value="opus" className="text-gray-900 bg-white">
                    .OPUS
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Bitrate
                </label>
                <select
                  value={bitrate}
                  onChange={(e) => setBitrate(e.target.value)}
                  disabled={isProcessing || ["wav", "flac"].includes(format)}
                  className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="128k" className="text-gray-900 bg-white">
                    128 kbps
                  </option>
                  <option value="192k" className="text-gray-900 bg-white">
                    192 kbps
                  </option>
                  <option value="320k" className="text-gray-900 bg-white">
                    320 kbps
                  </option>
                </select>
              </div>
            </div>

            {/* Bagian Clip / Trimming yang sempat hilang */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Start Time (Detik)
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 0"
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
                  placeholder="Kosongkan jika full"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "compress" && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Video Compression Settings
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Resolution
                </label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none"
                >
                  <option value="original" className="text-gray-900 bg-white">
                    Original
                  </option>
                  <option value="1080" className="text-gray-900 bg-white">
                    1080p
                  </option>
                  <option value="720" className="text-gray-900 bg-white">
                    720p
                  </option>
                  <option value="480" className="text-gray-900 bg-white">
                    480p
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Bitrate
                </label>
                <select
                  value={videoBitrate}
                  onChange={(e) => setVideoBitrate(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none"
                >
                  <option value="800k" className="text-gray-900 bg-white">
                    800 kbps (High)
                  </option>
                  <option value="1500k" className="text-gray-900 bg-white">
                    1500 kbps (Balanced)
                  </option>
                  <option value="3000k" className="text-gray-900 bg-white">
                    3000 kbps (HQ)
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "convert" && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Video Format Converter
            </h2>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Target Video Format
              </label>
              <select
                value={videoFormat}
                onChange={(e) => setVideoFormat(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none"
              >
                <option value="mp4" className="text-gray-900 bg-white">
                  .MP4
                </option>
                <option value="webm" className="text-gray-900 bg-white">
                  .WEBM
                </option>
                <option value="mkv" className="text-gray-900 bg-white">
                  .MKV
                </option>
                <option value="avi" className="text-gray-900 bg-white">
                  .AVI
                </option>
              </select>
            </div>
          </div>
        )}

        {/* DROPZONE & PROGRESS */}
        <Dropzone
          onFileSelect={handleFileSelect}
          disabled={!isReady || isProcessing}
        />
        {isProcessing && <ProgressBar progress={progress} />}

        {/* RESULT */}
        {resultUrl && !isProcessing && (
          <div className="mt-6 space-y-4 animate-in fade-in zoom-in duration-300">
            {activeTab === "audio" ? (
              <AudioPlayer
                audioUrl={resultUrl}
                fileName={`${selectedFileName}.${format}`}
              />
            ) : (
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Success</p>
                  <p className="text-sm font-medium">
                    {selectedFileName}.
                    {activeTab === "compress" ? "mp4" : videoFormat}
                  </p>
                </div>
                <video
                  src={resultUrl}
                  controls
                  className="w-24 h-14 rounded-lg bg-black object-cover"
                />
              </div>
            )}

            <a
              href={resultUrl}
              download={
                activeTab === "audio"
                  ? `${selectedFileName}.${format}`
                  : `${selectedFileName}_output.${activeTab === "compress" ? "mp4" : videoFormat}`
              }
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-xl font-medium transition-colors shadow-sm cursor-pointer"
            >
              <span>Download File Result</span>
            </a>
          </div>
        )}
      </div>

      {/* --- SEO SECTION MEMANJANG (GRID 2 KOLOM) --- */}
      <section className="max-w-2xl w-full bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-gray-700 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Why Use WASM Media Tool?
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Most online converters require you to upload your personal videos or
            audio files to a third-party cloud server. WASM Media Tool operates
            entirely on your device using WebAssembly technology. Your files
            never leave your browser, ensuring absolute privacy and zero upload
            waiting times.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">
              🔒 Is my data safe?
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Yes, 100% safe. All processing happens locally inside your browser
              memory sandbox. We do not store, track, or look at your media
              files.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">
              ⚡ How does it work?
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We run a compiled version of FFmpeg directly inside a web worker
              using WebAssembly and multi-threading, bringing native
              desktop-grade media conversion straight to your browser.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
