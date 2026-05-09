const STEPS = [
  {
    n: "1",
    title: "Copy the link",
    body: "Copy any YouTube video URL — full link, youtu.be short link, or even a Shorts link.",
  },
  {
    n: "2",
    title: "Paste it above",
    body: "Drop the URL into the input field. We'll instantly fetch the title, author and thumbnail.",
  },
  {
    n: "3",
    title: "Pick a format",
    body: "Choose your preferred video quality (MP4) or grab the audio-only version (MP3).",
  },
];

const FEATURES = [
  {
    title: "All YouTube link formats",
    body: "Watch URLs, shortlinks, embeds, Shorts, and music links — all detected automatically.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
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
    ),
  },
  {
    title: "Multiple qualities",
    body: "Save in 1080p, 720p, 480p or 360p — whichever fits your storage and bandwidth.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="6" width="14" height="12" rx="2" />
        <path d="m22 8-6 4 6 4z" />
      </svg>
    ),
  },
  {
    title: "Audio extraction",
    body: "Strip the audio out and download as MP3 — perfect for podcasts and music.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
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
    ),
  },
  {
    title: "No signup, no ads",
    body: "Free to use, no account required, and we never embed third-party trackers.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <>
      <section id="how" className="mt-12">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          How it works
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-[var(--color-muted)]">
          Three quick steps from a YouTube link to a saved file.
        </p>

        <ol className="mt-8 grid gap-3 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]/10 font-mono text-sm font-semibold text-[var(--color-primary)]">
                {s.n}
              </div>
              <h3 className="mt-4 text-base font-medium">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section id="features" className="mt-16">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Everything you need
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-primary)]">
                {f.icon}
              </div>
              <div>
                <h3 className="text-base font-medium">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="faq"
        className="mt-16 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
      >
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Good to know
        </h2>
        <dl className="mt-5 space-y-5 text-sm leading-relaxed">
          <div>
            <dt className="font-medium">Is this legal?</dt>
            <dd className="mt-1 text-[var(--color-muted)]">
              Only download videos you own or that are licensed for download
              (e.g. Creative Commons). Respect creators and YouTube&apos;s Terms
              of Service.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Why did my download fail?</dt>
            <dd className="mt-1 text-[var(--color-muted)]">
              The video may be age-restricted, private, region-locked, or the
              public download service may be temporarily rate-limited. Try
              again in a moment or pick a different quality.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Where are my files saved?</dt>
            <dd className="mt-1 text-[var(--color-muted)]">
              Files are saved to your browser&apos;s default download location.
              Nothing is uploaded to or stored on our servers.
            </dd>
          </div>
        </dl>
      </section>
    </>
  );
}
