import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

interface VideoTrimPayload {
  file: File;
  startTime: number;
  endTime: number;
  outputFormat?: string;
}

export async function handleVideoTrim(
  ffmpeg: FFmpeg,
  payload: VideoTrimPayload,
): Promise<Blob> {
  const { file, startTime, endTime, outputFormat = "mp4" } = payload;
  const inputName = "input_trim.mp4";
  const outputName = `output_trimmed.${outputFormat}`;

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const duration = endTime - startTime;

  await ffmpeg.exec([
    "-ss",
    startTime.toString(),
    "-i",
    inputName,
    "-t",
    duration.toString(),
    "-c",
    "copy",
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);

  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return new Blob([data as unknown as BlobPart], {
    type: `video/${outputFormat}`,
  });
}
