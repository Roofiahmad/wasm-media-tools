import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

interface VideoConvertPayload {
  file: File;
  outputFormat: string;
}

export async function handleVideoConvert(
  ffmpeg: FFmpeg,
  payload: VideoConvertPayload,
): Promise<Blob> {
  const { file, outputFormat } = payload;
  const inputName = file.name;
  const outputName = `converted_${file.name.substring(0, file.name.lastIndexOf(".")) || "video"}.${outputFormat}`;

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const args: string[] = ["-i", inputName];

  if (outputFormat === "webm") {
    args.push("-c:v", "libvpx-vp9", "-speed", "4", "-c:a", "libopus");
  } else {
    args.push(
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-r",
      "30",
      "-c:a",
      "copy",
    );
  }

  args.push(outputName);

  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);
  const mimeTypes: Record<string, string> = {
    mp4: "video/mp4",
    mkv: "video/x-matroska",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
  };

  const mimeType = mimeTypes[outputFormat] || `video/${outputFormat}`;
  const blob = new Blob([(data as Uint8Array).buffer as BlobPart], {
    type: mimeType,
  });

  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return blob;
}
