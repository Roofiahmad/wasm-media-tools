import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

interface GifPayload {
  file: File;
  startTime: number;
  duration: number;
  fps: number;
  scale: string;
}

// export async function handleGifMake(
//   ffmpeg: FFmpeg,
//   payload: GifPayload,
// ): Promise<Blob> {
//   const { file, startTime, duration, fps, scale } = payload;
//   const inputName = "input_gif.mp4";
//   const paletteName = "palette.png";
//   const outputName = "output.gif";

//   await ffmpeg.writeFile(inputName, await fetchFile(file));

//   await ffmpeg.exec([
//     "-ss",
//     startTime.toString(),
//     "-t",
//     duration.toString(),
//     "-i",
//     inputName,
//     "-vf",
//     `fps=${fps},scale=${scale}:flags=lanczos,palettegen`,
//     paletteName,
//   ]);

//   await ffmpeg.exec([
//     "-ss",
//     startTime.toString(),
//     "-t",
//     duration.toString(),
//     "-i",
//     inputName,
//     "-i",
//     paletteName,
//     "-filter_complex",
//     `fps=${fps},scale=${scale}:flags=lanczos[x];[x][1:v]paletteuse`,
//     outputName,
//   ]);

//   const data = await ffmpeg.readFile(outputName);

//   await ffmpeg.deleteFile(inputName);
//   await ffmpeg.deleteFile(paletteName);
//   await ffmpeg.deleteFile(outputName);

//   return new Blob([data as unknown as BlobPart], {
//     type: "image/gif",
//   });
// }

export async function handleGifMake(
  ffmpeg: FFmpeg,
  payload: GifPayload,
): Promise<Blob> {
  const { file, startTime, duration, fps, scale } = payload;
  const inputName = "input_gif.mp4";
  const outputName = "output.gif";

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  // Gunakan filter pembatasan warna ringan agar size kecil tapi tetap cepat
  await ffmpeg.exec([
    "-ss",
    startTime.toString(),
    "-t",
    duration.toString(),
    "-i",
    inputName,
    "-vf",
    `fps=${fps},scale=${scale}:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse`,
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return new Blob([data as unknown as BlobPart], {
    type: "image/gif",
  });
}
