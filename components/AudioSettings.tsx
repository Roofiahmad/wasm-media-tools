interface AudioSettingsProps {
  format: string;
  setFormat: (val: string) => void;
  bitrate: string;
  setBitrate: (val: string) => void;
  startTime: string;
  setStartTime: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  isProcessing: boolean;
}

export default function AudioSettings({
  format,
  setFormat,
  bitrate,
  setBitrate,
  startTime,
  setStartTime,
  duration,
  setDuration,
  isProcessing,
}: AudioSettingsProps) {
  return (
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
  );
}
