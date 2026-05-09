export default function Hero() {
  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-muted)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
        Free · No signup · No watermark
      </span>
      <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Download YouTube videos in seconds
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
        Paste a YouTube link and pick your quality. We&apos;ll fetch the file
        and save it straight to your device — MP4 or MP3.
      </p>
    </div>
  );
}
