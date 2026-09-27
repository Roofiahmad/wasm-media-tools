interface ImageProcessPayload {
  file: File;
  format: string;
  quality: number;
}

export async function handleImageProcess(
  payload: ImageProcessPayload,
): Promise<Blob> {
  const { file, format, quality } = payload;

  try {
    const imageBitmap = await createImageBitmap(file);

    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get OffscreenCanvas context");
    }

    ctx.drawImage(imageBitmap, 0, 0);

    const blob = await canvas.convertToBlob({
      type: format,
      quality: quality,
    });

    return blob;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Image processing failed in worker",
    );
  }
}
