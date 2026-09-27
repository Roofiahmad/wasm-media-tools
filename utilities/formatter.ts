export const parseTimeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;
  const trimmed = timeStr.trim();

  if (trimmed.includes(":")) {
    const parts = trimmed.split(":").map(Number);
    if (parts.some(isNaN)) return 0;

    if (parts.length === 3) {
      // HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // MM:SS
      return parts[0] * 60 + parts[1];
    }
  }

  const parsed = parseFloat(trimmed);
  return isNaN(parsed) ? 0 : parsed;
};
