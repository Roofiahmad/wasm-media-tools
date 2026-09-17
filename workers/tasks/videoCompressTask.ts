import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

interface VideoCompressPayload {
  file: File;
  resolution: string;
  videoBitrate: string;
  outputFormat: string; // <-- Tambahan parameter format
  preset: string;
  fps: string;
  audioCopy: boolean;
}

export async function handleVideoCompress(
  ffmpeg: FFmpeg,
  payload: VideoCompressPayload,
): Promise<Blob> {
  const {
    file,
    resolution,
    videoBitrate,
    outputFormat = "mp4",
    preset,
    fps,
    audioCopy,
  } = payload;
  const inputName = file.name;
  const ext = outputFormat.toLowerCase();
  const outputName = `compressed_${file.name.substring(0, file.name.lastIndexOf(".")) || "video"}.${ext}`;

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const args: string[] = ["-i", inputName];

  if (resolution && resolution !== "original") {
    args.push("-vf", `scale=-2:${resolution}`);
  }

  // Jika format webm, sesuaikan codec videonya ke libvpx-vp9 biar optimal
  if (ext === "webm") {
    args.push("-c:v", "libvpx-vp9", "-speed", "4");
  } else {
    args.push("-c:v", "libx264", "-preset", preset || "ultrafast");
  }

  if (fps && fps !== "original") {
    args.push("-r", fps);
  }

  if (videoBitrate) {
    args.push("-b:v", videoBitrate);
  }

  if (audioCopy && ext !== "webm") {
    args.push("-c:a", "copy");
  } else {
    args.push("-c:a", ext === "webm" ? "libopus" : "aac", "-b:a", "128k");
  }

  args.push(outputName);

  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);

  const mimeTypes: Record<string, string> = {
    mp4: "video/mp4",
    mkv: "video/x-matroska",
    webm: "video/webm",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
  };

  const mimeType = mimeTypes[ext] || "video/mp4";
  const uint8ArrayData = data as Uint8Array;
  const blob = new Blob([uint8ArrayData.buffer as BlobPart], {
    type: mimeType,
  });

  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return blob;
}
