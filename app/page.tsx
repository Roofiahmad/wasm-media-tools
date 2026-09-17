"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import ProgressBar from "@/components/ProgressBar";
import AudioPlayer from "@/components/AudioPlayer";
import AudioSettings from "@/components/AudioSettings";
import VideoSettings from "@/components/VideoSettings";
import VideoConvertSettings from "@/components/VideoConvertSettings";
import SeoContent from "@/components/SeoContent";
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

  // Audio Options
  const [format, setFormat] = useState<string>("mp3");
  const [startTime, setStartTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [bitrate, setBitrate] = useState<string>("192k");

  // Video Compression Options
  const [resolution, setResolution] = useState<string>("720");
  const [videoBitrate, setVideoBitrate] = useState<string>("1500k");
  const [compressionFormat, setCompressionFormat] = useState<string>("mp4");
  const [preset, setPreset] = useState<string>("ultrafast");
  const [fps, setFps] = useState<string>("30");
  const [audioCopy, setAudioCopy] = useState<boolean>(true);

  // Video Converter Options
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
        outputFormat: compressionFormat,
        preset,
        fps,
        audioCopy,
      });
    } else {
      convertVideo(file, {
        format: videoFormat,
      });
    }
  };

  return (
    <main className="flex-1 w-full bg-gray-50 py-6 sm:py-12 px-3 sm:px-4 flex flex-col items-center justify-start">
      {/* CARD TOOL UTAMA (Padding & Lebar Responsif) */}
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-5 sm:p-8 border border-gray-100 mb-8 sm:mb-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            WASM Media Tool
          </h1>
          <p className="text-gray-500 mt-2 text-xs sm:text-sm">
            Extract audio, compress video, and convert formats 100% locally in
            your browser.
          </p>
        </div>

        {/* TAB SWITCHER (Responsif ke bawah di layar kecil jika perlu, atau flex rapi) */}
        <div className="flex flex-col sm:flex-row bg-gray-100 p-1 rounded-xl mb-6 text-xs font-medium gap-1">
          <button
            onClick={() => setActiveTab("audio")}
            disabled={isProcessing}
            className={`flex-1 py-2.5 rounded-lg transition-all ${
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
            className={`flex-1 py-2.5 rounded-lg transition-all ${
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
            className={`flex-1 py-2.5 rounded-lg transition-all ${
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
          <div className="p-3 sm:p-4 mb-4 text-xs sm:text-sm text-blue-800 rounded-lg bg-blue-50 text-center animate-pulse border border-blue-100">
            Loading FFmpeg WASM Core (Multi-Thread)... Please wait.
          </div>
        )}

        {error && (
          <div className="p-3 sm:p-4 mb-4 text-xs sm:text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* SETTINGS PANELS */}
        {activeTab === "audio" && (
          <AudioSettings
            format={format}
            setFormat={setFormat}
            bitrate={bitrate}
            setBitrate={setBitrate}
            startTime={startTime}
            setStartTime={setStartTime}
            duration={duration}
            setDuration={setDuration}
            isProcessing={isProcessing}
          />
        )}

        {activeTab === "compress" && (
          <VideoSettings
            resolution={resolution}
            setResolution={setResolution}
            videoBitrate={videoBitrate}
            setVideoBitrate={setVideoBitrate}
            outputFormat={compressionFormat}
            setOutputFormat={setCompressionFormat}
            preset={preset}
            setPreset={setPreset}
            fps={fps}
            setFps={setFps}
            audioCopy={audioCopy}
            setAudioCopy={setAudioCopy}
            isProcessing={isProcessing}
          />
        )}

        {activeTab === "convert" && (
          <VideoConvertSettings
            videoFormat={videoFormat}
            setVideoFormat={setVideoFormat}
            isProcessing={isProcessing}
          />
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
                    {activeTab === "compress" ? compressionFormat : videoFormat}
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
                  : activeTab === "compress"
                    ? `${selectedFileName}_compressed.${compressionFormat}`
                    : `${selectedFileName}_output.${videoFormat}`
              }
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-xl font-medium transition-colors shadow-sm cursor-pointer text-sm"
            >
              <span>Download File Result</span>
            </a>
          </div>
        )}
      </div>

      {/* SEO SECTION */}
      <SeoContent />
    </main>
  );
}
