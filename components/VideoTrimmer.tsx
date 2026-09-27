"use client";

import { parseTimeToSeconds } from "@/utilities/formatter";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import React, { useState, useRef } from "react";

interface VideoTrimmerProps {
  ffmpeg: FFmpeg;
  onProcessed?: (outputUrl: string, fileName: string) => void;
}

export default function VideoTrimmer({
  ffmpeg,
  onProcessed,
}: VideoTrimmerProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("00:00");
  const [endTime, setEndTime] = useState<string>("00:10");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [outputUrl, setOutputUrl] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle Upload Video
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setOutputUrl("");
    }
  };

  // Proses Trimming dengan FFmpeg WASM
  const handleTrim = async () => {
    if (!videoFile || !ffmpeg) return;

    setIsProcessing(true);
    setProgressMessage("Loading video into memory...");

    try {
      const inputFileName = "input.mp4";
      const outputFileName = "output_trimmed.mp4";

      // Tulis file ke memori virtual FFmpeg
      const fileData = await videoFile.arrayBuffer();
      await ffmpeg.writeFile(inputFileName, new Uint8Array(fileData));

      const startSec = parseTimeToSeconds(startTime);
      const endSec = parseTimeToSeconds(endTime);
      const duration = endSec - startSec;

      if (duration <= 0) {
        alert("End time must be greater than start time!");
        setIsProcessing(false);
        return;
      }

      setProgressMessage("Trimming video locally...");

      await ffmpeg.exec([
        "-ss",
        startSec.toString(),
        "-i",
        inputFileName,
        "-t",
        duration.toString(),
        "-c",
        "copy",
        outputFileName,
      ]);

      setProgressMessage("Generating output file...");

      // Ambil hasil dari memori virtual
      const data = await ffmpeg.readFile(outputFileName);
      const blob = new Blob([data as unknown as BlobPart], {
        type: "video/mp4",
      });
      const url = URL.createObjectURL(blob);

      setOutputUrl(url);
      if (onProcessed) {
        onProcessed(url, "trimmed_video.mp4");
      }
    } catch (error) {
      console.error("Trimming error:", error);
      alert("Failed to trim video. Check console for details.");
    } finally {
      setIsProcessing(false);
      setProgressMessage("");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-800 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        Video Trimmer & Cutter
      </h2>

      {/* Input File */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Video File
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
      </div>

      {/* Video Preview */}
      {videoUrl && (
        <div className="space-y-2">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full max-h-72 rounded-lg bg-black"
          />
        </div>
      )}

      {/* Time Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Time (MM:SS or Seconds)
          </label>
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="e.g. 00:05 or 5"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Time (MM:SS or Seconds)
          </label>
          <input
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="e.g. 00:15 or 15"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleTrim}
        disabled={!videoFile || isProcessing}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow transition duration-200 cursor-pointer"
      >
        {isProcessing ? progressMessage || "Processing..." : "Trim Video"}
      </button>

      {/* Result Section */}
      {outputUrl && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            Result Ready!
          </h3>
          <video
            src={outputUrl}
            controls
            className="w-full max-h-60 rounded-lg bg-black"
          />
          <a
            href={outputUrl}
            download="trimmed_video.mp4"
            className="block text-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
          >
            Download Trimmed Video
          </a>
        </div>
      )}
    </div>
  );
}
