import { useState } from "react";
import type { VideoMeta, DownloadFormat, VideoQuality } from "../lib/api";
import type { DownloadingState } from "../App";

interface VideoCardProps {
  meta: VideoMeta;
  onDownload: (format: DownloadFormat, quality?: VideoQuality) => void;
  downloading: DownloadingState;
  downloadError: string | null;
  onReset: () => void;
}

const VIDEO_QUALITIES: { value: VideoQuality; label: string }[] = [
  { value: "1080", label: "1080p" },
  { value: "720", label: "720p" },
  { value: "480", label: "480p" },
  { value: "360", label: "360p" },
];

export default function VideoCard({
  meta,
  onDownload,
  downloading,
  downloadError,
  onReset,
}: VideoCardProps) {
  const [thumbSrc, setThumbSrc] = useState(meta.thumbnail);
  const isBusy = downloading !== null;

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="grid gap-0 md:grid-cols-[280px_1fr]">
        {/* thumbnail */}
        <div className="relative aspect-video w-full bg-[var(--color-surface-2)] md:aspect-auto md:h-full">
          <img
            src={thumbSrc}
            alt={`Thumbnail for ${meta.title}`}
            className="h-full w-full object-cover"
            onError={() => {
              // fall back to a guaranteed-existing thumbnail size
              const fallback = `https://i.ytimg.com/vi/${meta.videoId}/hqdefault.jpg`;
              if (thumbSrc !== fallback) setThumbSrc(fallback);
            }}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <a
            href={`https://www.youtube.com/watch?v=${meta.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100 focus-visible:opacity-100"
            aria-label="Open on YouTube"
          >
            <span className="rounded-full bg-[var(--color-primary)] p-3 text-[var(--color-primary-foreground)]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </a>
        </div>

        {/* info */}
        <div className="flex flex-col gap-3 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold leading-snug text-pretty sm:text-xl">
              {meta.title}
            </h2>
            <button
              type="button"
              onClick={onReset}
              className="shrink-0 rounded-md p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground)]"
              aria-label="Clear and start over"
              disabled={isBusy}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {meta.authorUrl ? (
              <a
                href={meta.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--color-foreground)]"
              >
                {meta.author}
              </a>
            ) : (
              <span>{meta.author}</span>
            )}
          </div>

          {/* video qualities */}
          <div className="mt-2">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Video (MP4)
            </p>
            <div className="flex flex-wrap gap-2">
              {VIDEO_QUALITIES.map((q) => {
                const isThis =
                  downloading?.format === "video" &&
                  downloading.quality === q.value;
                return (
                  <button
                    key={q.value}
                    type="button"
                    onClick={() => onDownload("video", q.value)}
                    disabled={isBusy}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm font-medium transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isThis ? (
                      <MiniSpinner />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <path d="m7 10 5 5 5-5" />
                        <path d="M12 15V3" />
                      </svg>
                    )}
                    {q.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* audio */}
          <div className="mt-1">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
              Audio
            </p>
            <button
              type="button"
              onClick={() => onDownload("audio")}
              disabled={isBusy}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm font-medium transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloading?.format === "audio" ? (
                <MiniSpinner />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              )}
              MP3 (audio only)
            </button>
          </div>

          {downloadError && (
            <p
              role="alert"
              className="mt-2 rounded-md border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 px-3 py-2 text-sm text-[var(--color-primary)]"
            >
              {downloadError}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function MiniSpinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="spinner h-4 w-4"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
