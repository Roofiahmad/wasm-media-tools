"use client";

interface ImageSettingsProps {
  imageFormat: string;
  setImageFormat: (val: string) => void;
  quality: number;
  setQuality: (val: number) => void;
  isProcessing: boolean;
}

export default function ImageSettings({
  imageFormat,
  setImageFormat,
  quality,
  setQuality,
  isProcessing,
}: ImageSettingsProps) {
  return (
    <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700">
        Image Converter & Compressor Settings
      </h3>
      <div>
        <label className="block text-xs text-gray-600 mb-1">
          Output Format
        </label>
        <select
          value={imageFormat}
          onChange={(e) => setImageFormat(e.target.value)}
          disabled={isProcessing}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="image/jpeg">JPG / JPEG</option>
          <option value="image/png">PNG</option>
          <option value="image/webp">WebP</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">
          Quality ({Math.round(quality * 100)}%)
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          disabled={isProcessing}
          className="w-full cursor-pointer accent-blue-600"
        />
      </div>
    </div>
  );
}
