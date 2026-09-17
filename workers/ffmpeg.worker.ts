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

  if (type === "CONVERT") {
    try {
      const { file, outputFormat, startTime, duration, bitrate } = payload;
      const inputName = file.name;
      const outputName = `output.${outputFormat}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Susun argumen command line FFmpeg secara dinamis
      const args: string[] = [];

      // 1. Trimming (jika ada start time)
      if (startTime && startTime > 0) {
        args.push("-ss", String(startTime));
      }
      if (duration && duration > 0) {
        args.push("-t", String(duration));
      }

      // 2. Input file
      args.push("-i", inputName);

      // 3. Bitrate / Quality (hanya berlaku untuk format kompresi lossy tertentu)
      if (
        bitrate &&
        ["mp3", "aac", "ogg", "opus", "wma"].includes(outputFormat)
      ) {
        args.push("-b:a", bitrate);
      }

      // 4. Output filename
      args.push(outputName);

      // Eksekusi perintah FFmpeg
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);

      const mimeTypes: Record<string, string> = {
        mp3: "audio/mpeg",
        m4a: "audio/mp4",
        aac: "audio/aac",
        wav: "audio/wav",
        flac: "audio/flac",
        aiff: "audio/aiff",
        ogg: "audio/ogg",
        opus: "audio/opus",
        webm: "audio/webm",
        ac3: "audio/ac3",
        wma: "audio/x-ms-wma",
        amr: "audio/amr",
        mka: "audio/x-matroska",
      };

      const mimeType =
        mimeTypes[outputFormat as string] || `audio/${outputFormat}`;
      const blob = new Blob([data as unknown as BlobPart], { type: mimeType });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      self.postMessage({ type: "CONVERT_DONE", payload: blob });
    } catch (error) {
      self.postMessage({
        type: "ERROR",
        payload:
          error instanceof Error ? error.message : "Media conversion failed",
      });
    }
  }
};
