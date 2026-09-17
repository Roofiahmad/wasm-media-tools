import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

interface AudioPayload {
  file: File;
  outputFormat: string;
  startTime?: number;
  duration?: number;
  bitrate?: string;
}

export async function handleAudioConvert(
  ffmpeg: FFmpeg,
  payload: AudioPayload,
): Promise<Blob> {
  const { file, outputFormat, startTime, duration, bitrate } = payload;
  const inputName = file.name;
  const outputName = `output.${outputFormat}`;

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const args: string[] = [];
  if (startTime && startTime > 0) args.push("-ss", String(startTime));
  if (duration && duration > 0) args.push("-t", String(duration));

  args.push("-i", inputName);

  if (bitrate && ["mp3", "aac", "ogg", "opus", "wma"].includes(outputFormat)) {
    args.push("-b:a", bitrate);
  }
  args.push(outputName);

  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);
  const mimeTypes: Record<string, string> = {
    mp3: "audio/mpeg",
    m4a: "audio/mp4",
    aac: "audio/aac",
    wav: "audio/wav",
    flac: "audio/flac",
    ogg: "audio/ogg",
    opus: "audio/opus",
    webm: "audio/webm",
  };
  const mimeType = mimeTypes[outputFormat] || `audio/${outputFormat}`;

  // Konversi Uint8Array / data ke ArrayBuffer agar aman diterima konstruktor Blob TypeScript
  const blob = new Blob([(data as Uint8Array).buffer as BlobPart], {
    type: mimeType,
  });
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return blob;
}
