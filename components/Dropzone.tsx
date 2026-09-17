"use client";

import { useState, useCallback } from "react";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function Dropzone({ onFileSelect, disabled }: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (
        file &&
        (file.type.includes("video") || file.type.includes("audio"))
      ) {
        onFileSelect(file);
      } else {
        alert("Tolong upload file video atau audio (MP4, MOV, dll).");
      }
    },
    [disabled, onFileSelect],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`w-full p-8 mt-6 border-2 border-dashed rounded-xl text-center transition-colors 
        ${
          disabled
            ? "opacity-50 cursor-not-allowed border-gray-300 bg-gray-50"
            : isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 bg-white"
        }`}
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <svg
          className="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-blue-600">Click to upload</span>{" "}
          or drag and drop
        </p>
        <p className="text-xs text-gray-500">
          MP4, MOV, WEBM (Client-side process)
        </p>
        <input
          type="file"
          accept="video/*,audio/*"
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 transition"
        >
          Select File
        </label>
      </div>
    </div>
  );
}
