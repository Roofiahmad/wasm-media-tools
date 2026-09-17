interface VideoConvertSettingsProps {
  videoFormat: string;
  setVideoFormat: (val: string) => void;
  isProcessing: boolean;
}

export default function VideoConvertSettings({
  videoFormat,
  setVideoFormat,
  isProcessing,
}: VideoConvertSettingsProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
        Video Format Converter
      </h2>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Target Video Format
        </label>
        <select
          value={videoFormat}
          onChange={(e) => setVideoFormat(e.target.value)}
          disabled={isProcessing}
          className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none"
        >
          <option value="mp4" className="text-gray-900 bg-white">
            .MP4
          </option>
          <option value="webm" className="text-gray-900 bg-white">
            .WEBM
          </option>
          <option value="mkv" className="text-gray-900 bg-white">
            .MKV
          </option>
          <option value="avi" className="text-gray-900 bg-white">
            .AVI
          </option>
        </select>
      </div>
    </div>
  );
}
