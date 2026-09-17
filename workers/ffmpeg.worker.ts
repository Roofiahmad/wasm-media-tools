import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { handleAudioConvert } from "./tasks/audioTask";
import { handleVideoCompress } from "./tasks/videoCompressTask";
import { handleVideoConvert } from "./tasks/videoConvertTask";

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
    return;
  }

  try {
    let resultBlob: Blob;

    if (type === "CONVERT_AUDIO") {
      resultBlob = await handleAudioConvert(ffmpeg, payload);
    } else if (type === "COMPRESS_VIDEO") {
      resultBlob = await handleVideoCompress(ffmpeg, payload);
    } else if (type === "CONVERT_VIDEO") {
      resultBlob = await handleVideoConvert(ffmpeg, payload);
    } else {
      throw new Error(`Unknown task type: ${type}`);
    }

    self.postMessage({ type: "PROCESS_DONE", payload: resultBlob });
  } catch (error) {
    self.postMessage({
      type: "ERROR",
      payload:
        error instanceof Error ? error.message : "Media processing failed",
    });
  }
};
