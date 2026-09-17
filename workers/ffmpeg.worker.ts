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

      ffmpeg.on("log", ({ message }) => {
        self.postMessage({ type: "LOG", payload: message });
      });

      await ffmpeg.load({
        coreURL,
        wasmURL,
        workerURL,
      });

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
      const { file, outputFormat } = payload;
      const inputName = file.name;
      const outputName = `output.${outputFormat}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Eksekusi konversi
      await ffmpeg.exec(["-i", inputName, outputName]);

      const data = await ffmpeg.readFile(outputName);

      // Mapping MIME Type agar file dikenali sempurna oleh OS/Browser
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

      // Clean up VFS memory
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
