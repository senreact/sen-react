/**
 * Extract the 11-character YouTube video ID from a full YouTube URL or a
 * bare ID. Returns null when no valid ID is present.
 *
 * Editors (e.g. Amadou) routinely paste the full share URL
 * (https://www.youtube.com/watch?v=XXXXXXXXXXX) rather than the bare ID, so
 * the Videos collection normalises the input to the ID on save and accepts
 * a URL during validation.
 *
 * Handles: watch?v=, youtu.be/, /embed/, /shorts/, /live/, with or without
 * extra query params, plus a bare 11-char ID passed straight through.
 */
const YT_ID = /^[A-Za-z0-9_-]{11}$/;

const URL_PATTERNS = [
  /[?&]v=([A-Za-z0-9_-]{11})/,
  /youtu\.be\/([A-Za-z0-9_-]{11})/,
  /\/embed\/([A-Za-z0-9_-]{11})/,
  /\/shorts\/([A-Za-z0-9_-]{11})/,
  /\/live\/([A-Za-z0-9_-]{11})/,
];

export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (YT_ID.test(trimmed)) return trimmed;
  for (const re of URL_PATTERNS) {
    const m = re.exec(trimmed);
    if (m?.[1]) return m[1];
  }
  return null;
}
