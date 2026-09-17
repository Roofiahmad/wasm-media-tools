interface VideoSettingsProps {
  resolution: string;
  setResolution: (val: string) => void;
  videoBitrate: string;
  setVideoBitrate: (val: string) => void;
  outputFormat: string; // <-- Tambahan state format
  setOutputFormat: (val: string) => void; // <-- Tambahan setter format
  preset: string;
  setPreset: (val: string) => void;
  fps: string;
  setFps: (val: string) => void;
  audioCopy: boolean;
  setAudioCopy: (val: boolean) => void;
  isProcessing: boolean;
}

export default function VideoSettings({
  resolution,
  setResolution,
  videoBitrate,
  setVideoBitrate,
  outputFormat,
  setOutputFormat,
  preset,
  setPreset,
  fps,
  setFps,
  audioCopy,
  setAudioCopy,
  isProcessing,
}: VideoSettingsProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
        Advanced Video Compression Settings
      </h2>

      {/* Baris 1: Resolution, Bitrate, & Output Format */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Resolution
          </label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none"
          >
            <option value="original" className="text-gray-900 bg-white">
              Original
            </option>
            <option value="1080" className="text-gray-900 bg-white">
              1080p
            </option>
            <option value="720" className="text-gray-900 bg-white">
              720p
            </option>
            <option value="480" className="text-gray-900 bg-white">
              480p
            </option>
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
            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none"
          >
            <option value="800k" className="text-gray-900 bg-white">
              800 kbps
            </option>
            <option value="1500k" className="text-gray-900 bg-white">
              1500 kbps
            </option>
            <option value="3000k" className="text-gray-900 bg-white">
              3000 kbps
            </option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Output Format
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none  text-blue-600"
          >
            <option value="mp4" className="text-gray-900 bg-white">
              .MP4
            </option>
            <option value="mkv" className="text-gray-900 bg-white">
              .MKV
            </option>
            <option value="webm" className="text-gray-900 bg-white">
              .WEBM
            </option>
            <option value="mov" className="text-gray-900 bg-white">
              .MOV
            </option>
            <option value="avi" className="text-gray-900 bg-white">
              .AVI
            </option>
          </select>
        </div>
      </div>

      {/* Baris 2: Preset Kecepatan & Frame Rate */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Encoding Speed (Preset)
          </label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none"
          >
            <option value="ultrafast" className="text-gray-900 bg-white">
              Ultrafast (Tercepat)
            </option>
            <option value="fast" className="text-gray-900 bg-white">
              Fast (Seimbang)
            </option>
            <option value="medium" className="text-gray-900 bg-white">
              Medium (Standar)
            </option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Frame Rate (FPS)
          </label>
          <select
            value={fps}
            onChange={(e) => setFps(e.target.value)}
            disabled={isProcessing}
            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none"
          >
            <option value="original" className="text-gray-900 bg-white">
              Original
            </option>
            <option value="60" className="text-gray-900 bg-white">
              60 FPS
            </option>
            <option value="30" className="text-gray-900 bg-white">
              30 FPS
            </option>
            <option value="24" className="text-gray-900 bg-white">
              24 FPS
            </option>
          </select>
        </div>
      </div>

      {/* Baris 3: Audio Stream Copy */}
      <div className="pt-2 border-t border-gray-200 flex items-center space-x-2">
        <input
          type="checkbox"
          id="audioCopy"
          checked={audioCopy}
          onChange={(e) => setAudioCopy(e.target.checked)}
          disabled={isProcessing}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
        <label
          htmlFor="audioCopy"
          className="text-xs font-medium text-gray-700 cursor-pointer select-none"
        >
          Fast Audio Stream Copy (Jangan re-encode audio)
        </label>
      </div>
    </div>
  );
}
