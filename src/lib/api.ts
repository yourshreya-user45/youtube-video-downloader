import { canonicalWatchUrl } from "./youtube";

export interface VideoMeta {
  videoId: string;
  title: string;
  author: string;
  authorUrl?: string;
  thumbnail: string;
  providerName?: string;
}

/**
 * Fetch video metadata using the noembed.com proxy (CORS-friendly,
 * no API key required, supports YouTube).
 */
export async function fetchVideoMeta(videoId: string): Promise<VideoMeta> {
  const target = canonicalWatchUrl(videoId);
  const endpoint = `https://noembed.com/embed?dataType=json&url=${encodeURIComponent(
    target
  )}`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Couldn't reach metadata service (HTTP ${res.status}).`);
  }

  const data: {
    title?: string;
    author_name?: string;
    author_url?: string;
    thumbnail_url?: string;
    provider_name?: string;
    error?: string;
  } = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  if (!data.title) {
    throw new Error("Video not found or is private/unavailable.");
  }

  return {
    videoId,
    title: data.title,
    author: data.author_name ?? "Unknown",
    authorUrl: data.author_url,
    thumbnail:
      data.thumbnail_url ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    providerName: data.provider_name,
  };
}

export type DownloadFormat = "video" | "audio";
export type VideoQuality = "1080" | "720" | "480" | "360" | "240" | "144";

export interface DownloadOptions {
  format: DownloadFormat;
  quality?: VideoQuality;
}

export interface DownloadResult {
  /** Final downloadable URL (direct file or redirect to file). */
  url: string;
  /** Human filename hint, when provided by the backend. */
  filename?: string;
  /** Backend status: stream = direct file, redirect = 302 to file. */
  kind: "stream" | "redirect" | "tunnel";
}

/**
 * Public Cobalt-compatible instances. We try them in order; the first
 * one that returns a usable URL wins. Adding more instances increases
 * resilience to rate limits / outages.
 */
const COBALT_INSTANCES = [
  "https://api.cobalt.tools/",
  "https://co.wuk.sh/api/json",
  "https://api.cobalt.tools/api/json",
];

/**
 * Resolve a downloadable URL for the given YouTube video.
 *
 * Uses the Cobalt API (https://github.com/imputnet/cobalt), which is a
 * free, open-source media downloader. No account or API key needed.
 *
 * The function tries multiple public instances and both the legacy
 * (`/api/json`) and current (`/`) request shapes for maximum
 * compatibility.
 */
export async function resolveDownload(
  videoId: string,
  options: DownloadOptions
): Promise<DownloadResult> {
  const url = canonicalWatchUrl(videoId);

  const errors: string[] = [];

  for (const endpoint of COBALT_INSTANCES) {
    try {
      const result = await callCobalt(endpoint, url, options);
      if (result) return result;
    } catch (err) {
      errors.push(
        `${endpoint}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  throw new Error(
    "All download services are currently unavailable. Please try again in a moment."
  );
}

async function callCobalt(
  endpoint: string,
  url: string,
  options: DownloadOptions
): Promise<DownloadResult | null> {
  const isAudio = options.format === "audio";

  // Body shape compatible with both old and new Cobalt versions.
  const body = {
    url,
    // new API
    downloadMode: isAudio ? "audio" : "auto",
    videoQuality: options.quality ?? "720",
    audioFormat: "mp3",
    filenameStyle: "pretty",
    // legacy API (ignored by new versions)
    vQuality: options.quality ?? "720",
    aFormat: "mp3",
    isAudioOnly: isAudio,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data: {
    status?: string;
    url?: string;
    filename?: string;
    text?: string;
    pickerType?: string;
    picker?: Array<{ url: string; type?: string }>;
  } = await res.json();

  if (!data.status) return null;

  // Newer Cobalt may return "tunnel" (proxied stream) or "redirect".
  if (
    (data.status === "stream" ||
      data.status === "redirect" ||
      data.status === "tunnel") &&
    data.url
  ) {
    return {
      url: data.url,
      filename: data.filename,
      kind: data.status as DownloadResult["kind"],
    };
  }

  // Picker = multiple options (rare for single YouTube videos).
  if (data.status === "picker" && data.picker?.length) {
    const first = data.picker[0];
    if (first?.url) {
      return { url: first.url, kind: "redirect" };
    }
  }

  if (data.status === "error" || data.status === "rate-limit") {
    throw new Error(data.text || data.status);
  }

  return null;
}

/**
 * Trigger an actual file download in the browser. We attempt to fetch
 * the file as a blob (so the filename is honored and the browser shows
 * a real download), and fall back to opening the URL directly if the
 * remote disallows CORS for binary fetches.
 */
export async function downloadToDevice(
  result: DownloadResult,
  fallbackName: string
): Promise<void> {
  const filename = result.filename || fallbackName;

  try {
    const res = await fetch(result.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    triggerDownload(objectUrl, filename);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  } catch {
    // CORS or network — open in a new tab so the user can save manually.
    triggerDownload(result.url, filename, true);
  }
}

function triggerDownload(href: string, filename: string, newTab = false) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  if (newTab) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function sanitizeFilename(name: string, ext: string): string {
  const base = name
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return `${base || "video"}.${ext}`;
}
