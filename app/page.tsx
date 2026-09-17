"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import ProgressBar from "@/components/ProgressBar";
import { useFFmpeg } from "@/hooks/useFFmpeg";

export default function Home() {
  const { isReady, isProcessing, progress, resultUrl, error, extractAudio } =
    useFFmpeg();
  const [format, setFormat] = useState<string>("mp3");

  return (
    <main className="flex-1 w-full bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            WASM Media Tool
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Extract audio completely in your browser. No files uploaded to any
            server.
          </p>
        </div>

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

        <div className="flex items-center justify-center space-x-4 mb-4">
          <span className="text-sm font-medium text-gray-600">
            Output Format:
          </span>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            disabled={isProcessing}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none cursor-pointer"
          >
            <optgroup label="Popular">
              <option value="mp3">.MP3 (Universal)</option>
              <option value="m4a">.M4A (Apple/MPEG-4)</option>
              <option value="aac">.AAC (High Quality)</option>
            </optgroup>
            <optgroup label="Lossless / Uncompressed">
              <option value="wav">.WAV (Raw Audio)</option>
              <option value="flac">.FLAC (Lossless Compressed)</option>
              <option value="aiff">.AIFF (Apple Lossless)</option>
            </optgroup>
            <optgroup label="Web Optimized">
              <option value="opus">.OPUS (WebRTC / Discord)</option>
              <option value="ogg">.OGG (Vorbis)</option>
              <option value="webm">.WEBM (Audio Only)</option>
            </optgroup>
            <optgroup label="Theater & Legacy">
              <option value="ac3">.AC3 (Dolby Digital)</option>
              <option value="wma">.WMA (Windows Media)</option>
              <option value="amr">.AMR (Voice Recording)</option>
              <option value="mka">.MKA (Matroska Audio)</option>
            </optgroup>
          </select>
        </div>

        <Dropzone
          onFileSelect={(file) => extractAudio(file, format)}
          disabled={!isReady || isProcessing}
        />

        {isProcessing && <ProgressBar progress={progress} />}

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
              Extraction Complete!
            </p>
            <a
              href={resultUrl}
              download={`extracted-audio.${format}`}
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
