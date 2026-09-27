"use client";

interface VideoTrimSettingsProps {
  trimStart: string;
  setTrimStart: (val: string) => void;
  trimEnd: string;
  setTrimEnd: (val: string) => void;
  trimFormat: string;
  setTrimFormat: (val: string) => void;
  isProcessing: boolean;
}

export default function VideoTrimSettings({
  trimStart,
  setTrimStart,
  trimEnd,
  setTrimEnd,
  trimFormat,
  setTrimFormat,
  isProcessing,
}: VideoTrimSettingsProps) {
  return (
    <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700">
        Video Trimming Settings
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Start Time (MM:SS or seconds)
          </label>
          <input
            type="text"
            value={trimStart}
            onChange={(e) => setTrimStart(e.target.value)}
            disabled={isProcessing}
            placeholder="e.g. 00:00 or 5"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            End Time (MM:SS or seconds)
          </label>
          <input
            type="text"
            value={trimEnd}
            onChange={(e) => setTrimEnd(e.target.value)}
            disabled={isProcessing}
            placeholder="e.g. 00:30 or 30"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">
          Output Format
        </label>
        <select
          value={trimFormat}
          onChange={(e) => setTrimFormat(e.target.value)}
          disabled={isProcessing}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="mp4">MP4</option>
          <option value="mkv">MKV</option>
          <option value="mov">MOV</option>
        </select>
      </div>
    </div>
  );
}
