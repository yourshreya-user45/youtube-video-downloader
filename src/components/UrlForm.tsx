import { useCallback, type FormEvent } from "react";

interface UrlFormProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  loading: boolean;
  error: string | null;
}

export default function UrlForm({
  value,
  onChange,
  onSubmit,
  loading,
  error,
}: UrlFormProps) {
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (loading) return;
      onSubmit(value.trim());
    },
    [loading, onSubmit, value]
  );

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text.trim());
      }
    } catch {
      // clipboard permission denied — silently ignore
    }
  }, [onChange]);

  return (
    <div className="mt-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-lg shadow-black/20 sm:flex-row sm:items-center"
      >
        <label htmlFor="yt-url" className="sr-only">
          YouTube video URL
        </label>
        <div className="flex flex-1 items-center gap-2 px-3">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0 text-[var(--color-muted)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
            <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
          </svg>
          <input
            id="yt-url"
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="https://www.youtube.com/watch?v=..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={loading}
            className="w-full bg-transparent py-3 text-base text-[var(--color-foreground)] placeholder:text-[var(--color-muted)]/70 focus:outline-none disabled:opacity-60"
            aria-invalid={!!error}
            aria-describedby={error ? "yt-url-error" : undefined}
          />
          {value && !loading && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-md p-1 text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground)]"
              aria-label="Clear input"
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
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-1">
          <button
            type="button"
            onClick={handlePasteFromClipboard}
            disabled={loading}
            className="hidden h-11 items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground)] disabled:opacity-60 sm:inline-flex"
          >
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
              <rect x="9" y="2" width="6" height="4" rx="1" />
              <path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" />
            </svg>
            Paste
          </button>
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-medium text-[var(--color-primary-foreground)] transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-initial"
          >
            {loading ? (
              <>
                <Spinner />
                <span>Fetching…</span>
              </>
            ) : (
              <>
                <span>Get video</span>
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
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <p
          id="yt-url-error"
          role="alert"
          className="mt-3 text-sm text-[var(--color-primary)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function Spinner() {
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
