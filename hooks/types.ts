export interface AudioOptions {
  format?: string;
  startTime?: number;
  endTime?: number;
  bitrate?: string;
}

export interface VideoOptions {
  resolution?: string;
  videoBitrate?: string;
  outputFormat?: string;
  preset?: string;
  fps?: string;
  audioCopy?: boolean;
}

export interface VideoConvertOptions {
  format?: string;
  videoCodec?: string;
  audioCodec?: string;
}

export interface TrimOptions {
  startTime?: number;
  endTime?: number;
  outputFormat?: string;
}

export interface ImageOptions {
  format?: string;
  quality?: number;
}

export interface GifOptions {
  startTime?: number;
  duration?: number;
  fps?: number;
  scale?: string;
}
