import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === "INIT") {
    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";
      const coreURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.js`,
        "text/javascript",
      );
      const wasmURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm",
      );
      const workerURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript",
      );

      ffmpeg.on("progress", ({ progress }) => {
        self.postMessage({ type: "PROGRESS", payload: progress });
      });

      await ffmpeg.load({ coreURL, wasmURL, workerURL });
      self.postMessage({ type: "INIT_DONE" });
    } catch (error) {
      self.postMessage({
        type: "ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Failed to initialize FFmpeg",
      });
    }
  }

  // --- MODE 1: EXTRACT AUDIO ---
  if (type === "CONVERT_AUDIO") {
    try {
      const { file, outputFormat, startTime, duration, bitrate } = payload;
      const inputName = file.name;
      const outputName = `output.${outputFormat}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const args: string[] = [];
      if (startTime && startTime > 0) args.push("-ss", String(startTime));
      if (duration && duration > 0) args.push("-t", String(duration));

      args.push("-i", inputName);

      if (
        bitrate &&
        ["mp3", "aac", "ogg", "opus", "wma"].includes(outputFormat)
      ) {
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
      const mimeType =
        mimeTypes[outputFormat as string] || `audio/${outputFormat}`;
      const blob = new Blob([data as unknown as BlobPart], { type: mimeType });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      self.postMessage({ type: "PROCESS_DONE", payload: blob });
    } catch (error) {
      self.postMessage({
        type: "ERROR",
        payload:
          error instanceof Error ? error.message : "Audio extraction failed",
      });
    }
  }

  // --- MODE 2: COMPRESS & RESIZE VIDEO ---
  if (type === "COMPRESS_VIDEO") {
    try {
      const { file, resolution, videoBitrate } = payload;
      const inputName = file.name;
      const outputName = `compressed_${file.name.substring(0, file.name.lastIndexOf(".")) || "video"}.mp4`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const args: string[] = ["-i", inputName];

      // Jika ada pengaturan resolusi (resizer)
      if (resolution && resolution !== "original") {
        // contoh: scale=-2:720 (menjaga aspect ratio agar genap)
        args.push("-vf", `scale=-2:${resolution}`);
      }

      // Video codec & Bitrate kompresi
      args.push("-c:v", "libx264");
      if (videoBitrate) {
        args.push("-b:v", videoBitrate);
      }

      // Audio codec disamakan ke aac biar kompatibel
      args.push("-c:a", "aac", "-b:a", "128k", outputName);

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data as unknown as BlobPart], {
        type: "video/mp4",
      });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      self.postMessage({ type: "PROCESS_DONE", payload: blob });
    } catch (error) {
      self.postMessage({
        type: "ERROR",
        payload:
          error instanceof Error ? error.message : "Video compression failed",
      });
    }
  }

  if (type === "CONVERT_VIDEO") {
    try {
      const { file, outputFormat, videoCodec, audioCodec } = payload;
      const inputName = file.name;
      const outputName = `converted_${file.name.substring(0, file.name.lastIndexOf(".")) || "video"}.${outputFormat}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const args: string[] = ["-i", inputName];

      // Mapping codec video default berdasarkan format target
      if (outputFormat === "webm") {
        args.push("-c:v", "libvpx-vp9", "-c:a", "libopus");
      } else if (outputFormat === "mkv") {
        args.push("-c:v", "libx264", "-c:a", "aac");
      } else {
        // Default MP4 / MOV / AVI
        args.push("-c:v", videoCodec || "libx264", "-c:a", audioCodec || "aac");
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

      const mimeType =
        mimeTypes[outputFormat as string] || `video/${outputFormat}`;
      const blob = new Blob([data as unknown as BlobPart], { type: mimeType });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      self.postMessage({ type: "PROCESS_DONE", payload: blob });
    } catch (error) {
      self.postMessage({
        type: "ERROR",
        payload:
          error instanceof Error ? error.message : "Video conversion failed",
      });
    }
  }
};
