"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface ConvertOptions {
  format?: string;
  startTime?: number;
  duration?: number;
  bitrate?: string;
}

export function useFFmpeg() {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../workers/ffmpeg.worker.ts", import.meta.url),
        { type: "module" },
      );

      workerRef.current.onmessage = (e: MessageEvent) => {
        const { type, payload } = e.data;
        switch (type) {
          case "INIT_DONE":
            setIsReady(true);
            break;
          case "PROGRESS":
            setProgress(Math.round(payload * 100));
            break;
          case "CONVERT_DONE":
            const url = URL.createObjectURL(payload as Blob);
            setResultUrl(url);
            setIsProcessing(false);
            setProgress(100);
            break;
          case "ERROR":
            setError(payload);
            setIsProcessing(false);
            break;
        }
      };

      workerRef.current.postMessage({ type: "INIT" });
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const extractAudio = useCallback(
    (file: File, options: ConvertOptions = {}) => {
      if (!workerRef.current || !isReady) return;
      setIsProcessing(true);
      setProgress(0);
      setResultUrl(null);
      setError(null);

      workerRef.current.postMessage({
        type: "CONVERT",
        payload: {
          file,
          outputFormat: options.format || "mp3",
          startTime: options.startTime || 0,
          duration: options.duration || 0,
          bitrate: options.bitrate || "192k",
        },
      });
    },
    [isReady],
  );

  return { isReady, isProcessing, progress, resultUrl, error, extractAudio };
}
