"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import ProgressBar from "@/components/ProgressBar";
import AudioPlayer from "@/components/AudioPlayer";
import AudioSettings from "@/components/AudioSettings";
import VideoSettings from "@/components/VideoSettings";
import VideoConvertSettings from "@/components/VideoConvertSettings";
import VideoTrimSettings from "@/components/VideoTrimSettings";
import SeoContent from "@/components/SeoContent";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import { parseTimeToSeconds } from "@/utilities/formatter";
import ImageSettings from "@/components/ImageSettings";
import Image from "next/image";

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
    trimVideo,
    processImage,
  } = useFFmpeg();

  const [activeTab, setActiveTab] = useState<
    "audio" | "compress" | "convert" | "trim" | "image"
  >("audio");

  // Audio Options
  const [format, setFormat] = useState<string>("mp3");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
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

  // Video Trimmer Options (Dengan format waktu fleksibel)
  const [trimStart, setTrimStart] = useState<string>("00:00");
  const [trimEnd, setTrimEnd] = useState<string>("00:10");
  const [trimFormat, setTrimFormat] = useState<string>("mp4");

  // Image Format
  const [imageFormat, setImageFormat] = useState<string>("image/jpeg");
  const [quality, setQuality] = useState<number>(0.8);

  const [selectedFileName, setSelectedFileName] =
    useState<string>("media-output");

  const handleFileSelect = (file: File) => {
    const cleanName =
      file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    setSelectedFileName(cleanName);

    if (activeTab === "audio") {
      extractAudio(file, {
        format,
        startTime: parseTimeToSeconds(startTime),
        endTime: endTime ? parseTimeToSeconds(endTime) : undefined,
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
    } else if (activeTab === "convert") {
      convertVideo(file, {
        format: videoFormat,
      });
    } else if (activeTab === "trim") {
      const startSec = parseTimeToSeconds(trimStart);
      const endSec = parseTimeToSeconds(trimEnd);

      if (endSec <= startSec) {
        alert("End time must be greater than start time!");
        return;
      }

      trimVideo(file, {
        startTime: startSec,
        endTime: endSec,
        outputFormat: trimFormat,
      });
    } else if (activeTab === "image") {
      console.log(imageFormat, "imageFormat");
      processImage(file, {
        format: imageFormat,
        quality,
      });
    }
  };

  return (
    <main className="flex-1 w-full bg-gray-50 py-6 sm:py-12 px-3 sm:px-4 flex flex-col items-center justify-start">
      {/* MAIN TOOL CARD */}
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-5 sm:p-8 border border-gray-100 mb-8 sm:mb-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            WASM Media Tool
          </h1>
          <p className="text-gray-500 mt-2 text-xs sm:text-sm">
            Extract audio, compress video, trim clips, and convert formats 100%
            locally in your browser.
          </p>
        </div>

        {/* TAB SWITCHER */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-gray-100 p-1 rounded-xl mb-6 text-xs font-medium gap-1">
          <button
            onClick={() => setActiveTab("audio")}
            disabled={isProcessing}
            className={`py-2.5 rounded-lg transition-all text-center ${
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
            className={`py-2.5 rounded-lg transition-all text-center ${
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
            className={`py-2.5 rounded-lg transition-all text-center ${
              activeTab === "convert"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            🔄 Convert
          </button>
          <button
            onClick={() => setActiveTab("trim")}
            disabled={isProcessing}
            className={`py-2.5 rounded-lg transition-all text-center ${
              activeTab === "trim"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            ✂️ Trim Video
          </button>

          <button
            onClick={() => setActiveTab("image")}
            disabled={isProcessing}
            className={`flex-1 py-2.5 rounded-lg transition-all text-center ${
              activeTab === "image"
                ? "bg-white text-blue-600 shadow-sm font-medium"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            🖼️ Image Format
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
            endTime={endTime}
            setEndTime={setEndTime}
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

        {activeTab === "trim" && (
          <VideoTrimSettings
            trimStart={trimStart}
            setTrimStart={setTrimStart}
            trimEnd={trimEnd}
            setTrimEnd={setTrimEnd}
            trimFormat={trimFormat}
            setTrimFormat={setTrimFormat}
            isProcessing={isProcessing}
          />
        )}

        {activeTab === "image" && (
          <ImageSettings
            imageFormat={imageFormat}
            setImageFormat={setImageFormat}
            quality={quality}
            setQuality={setQuality}
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
            ) : activeTab === "image" ? (
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Success</p>
                  <p className="text-sm font-medium">
                    {selectedFileName}_converted.
                    {imageFormat.replace("image/", "")}
                  </p>
                </div>
                <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-black">
                  <Image
                    src={resultUrl}
                    alt="Converted Result"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Success</p>
                  <p className="text-sm font-medium">
                    {selectedFileName}.
                    {activeTab === "compress"
                      ? compressionFormat
                      : activeTab === "convert"
                        ? videoFormat
                        : trimFormat}
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
                    : activeTab === "convert"
                      ? `${selectedFileName}_output.${videoFormat}`
                      : activeTab === "trim"
                        ? `${selectedFileName}_trimmed.${trimFormat}`
                        : `${selectedFileName}_converted.${imageFormat.replace("image/", "")}`
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
