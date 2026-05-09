/**
 * Extract a YouTube video ID from any common YouTube URL form.
 * Returns null if the input is not a recognizable YouTube URL.
 *
 * Supported:
 *  - https://www.youtube.com/watch?v=VIDEOID
 *  - https://youtube.com/watch?v=VIDEOID&list=...
 *  - https://m.youtube.com/watch?v=VIDEOID
 *  - https://youtu.be/VIDEOID
 *  - https://www.youtube.com/shorts/VIDEOID
 *  - https://www.youtube.com/embed/VIDEOID
 *  - https://www.youtube.com/v/VIDEOID
 *  - https://music.youtube.com/watch?v=VIDEOID
 *  - bare 11-char video id
 */
export function extractVideoId(input: string): string | null {
  if (!input) return null;
  const raw = input.trim();

  // bare ID
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;

  let url: URL;
  try {
    // allow inputs without protocol
    url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const isYoutube =
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com" ||
    host === "youtu.be";

  if (!isYoutube) return null;

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  }

  const v = url.searchParams.get("v");
  if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;

  // /shorts/ID, /embed/ID, /v/ID, /live/ID
  const parts = url.pathname.split("/").filter(Boolean);
  const known = new Set(["shorts", "embed", "v", "live"]);
  for (let i = 0; i < parts.length; i++) {
    if (known.has(parts[i]) && parts[i + 1]) {
      const id = parts[i + 1];
      if (/^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }
  }

  return null;
}

export function canonicalWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function thumbnailUrl(videoId: string, quality: "max" | "hq" = "max"): string {
  // maxresdefault may 404 for some videos; hqdefault always exists.
  const file = quality === "max" ? "maxresdefault" : "hqdefault";
  return `https://i.ytimg.com/vi/${videoId}/${file}.jpg`;
}
