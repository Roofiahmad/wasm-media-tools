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

  // Mode Tab: "audio", "compress", atau "convert"
  const [activeTab, setActiveTab] = useState<"audio" | "compress" | "convert">(
    "audio",
  );

  // State Audio Options
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
    <main className="flex-1 w-full bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            WASM Media Tool
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Extract audio, compress video, and convert formats 100% locally in
            browser.
          </p>
        </div>

        {/* TAB SWITCHER (3 MODES) */}
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

        {/* --- SETTINGS PANEL BERDASARKAN TAB --- */}
        {activeTab === "audio" && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Audio Settings
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
                  className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none"
                >
                  <option value="mp3">.MP3</option>
                  <option value="m4a">.M4A</option>
                  <option value="aac">.AAC</option>
                  <option value="wav">.WAV</option>
                  <option value="flac">.FLAC</option>
                  <option value="opus">.OPUS</option>
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
                  className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none disabled:opacity-50"
                >
                  <option value="128k">128 kbps</option>
                  <option value="192k">192 kbps</option>
                  <option value="320k">320 kbps</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Start (s)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-white border border-gray-300 text-sm text-gray-700 rounded-lg p-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Duration (s)
                </label>
                <input
                  type="number"
                  placeholder="Full"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-white border border-gray-300 text-sm text-gray-700 rounded-lg p-2 outline-none"
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
                  className="w-full bg-white border border-gray-300 text-sm text-gray-700 rounded-lg p-2 outline-none"
                >
                  <option value="original">Original</option>
                  <option value="1080">1080p</option>
                  <option value="720">720p</option>
                  <option value="480">480p</option>
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
                  className="w-full bg-white border border-gray-300 text-sm text-gray-700 rounded-lg p-2 outline-none"
                >
                  <option value="800k">800 kbps (High)</option>
                  <option value="1500k">1500 kbps (Balanced)</option>
                  <option value="3000k">3000 kbps (HQ)</option>
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
                <option value="mp4">.MP4 (MPEG-4 / H.264)</option>
                <option value="webm">.WEBM (VP9 / Web Optimized)</option>
                <option value="mkv">.MKV (Matroska)</option>
                <option value="avi">.AVI (Audio Video Interleave)</option>
                <option value="mov">.MOV (QuickTime Apple)</option>
              </select>
            </div>
          </div>
        )}

        {/* DRAG & DROP AREA */}
        <Dropzone
          onFileSelect={handleFileSelect}
          disabled={!isReady || isProcessing}
        />

        {/* PROGRESS BAR */}
        {isProcessing && <ProgressBar progress={progress} />}

        {/* RESULT SECTION */}
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
                  <p className="text-xs text-slate-400">Conversion Success</p>
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

            {/* DOWNLOAD BUTTON */}
            <a
              href={resultUrl}
              download={
                activeTab === "audio"
                  ? `${selectedFileName}.${format}`
                  : activeTab === "compress"
                    ? `${selectedFileName}_compressed.mp4`
                    : `${selectedFileName}_converted.${videoFormat}`
              }
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-xl font-medium transition-colors shadow-sm cursor-pointer"
            >
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download File Result</span>
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
