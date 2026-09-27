"use client";

interface GifSettingsProps {
  startTime: string;
  setStartTime: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  fps: string;
  setFps: (val: string) => void;
  scale: string;
  setScale: (val: string) => void;
  isProcessing: boolean;
}

export default function GifSettings({
  startTime,
  setStartTime,
  duration,
  setDuration,
  fps,
  setFps,
  scale,
  setScale,
  isProcessing,
}: GifSettingsProps) {
  return (
    <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700">
        GIF Maker Settings
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Start Time (MM:SS or seconds)
          </label>
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isProcessing}
            placeholder="e.g. 00:00"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Duration (Seconds)
          </label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            disabled={isProcessing}
            placeholder="e.g. 5"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            FPS (Frame Rate)
          </label>
          <select
            value={fps}
            onChange={(e) => setFps(e.target.value)}
            disabled={isProcessing}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="10">10 FPS (Smaller size)</option>
            <option value="15">15 FPS (Balanced)</option>
            <option value="24">24 FPS (Smooth)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Resolution Width
          </label>
          <select
            value={scale}
            onChange={(e) => setScale(e.target.value)}
            disabled={isProcessing}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="240:-1">240px Width</option>
            <option value="320:-1">320px Width (Recommended)</option>
            <option value="480:-1">480px Width</option>
          </select>
        </div>
      </div>
    </div>
  );
}
