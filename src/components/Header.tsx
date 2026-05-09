export default function Header() {
  return (
    <header className="border-b border-[var(--color-border)]/60 bg-[var(--color-background)]/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <a href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="text-base font-semibold tracking-tight">
            YT Saver
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-[var(--color-muted)] sm:flex">
          <a className="hover:text-[var(--color-foreground)]" href="#how">
            How it works
          </a>
          <a className="hover:text-[var(--color-foreground)]" href="#features">
            Features
          </a>
          <a className="hover:text-[var(--color-foreground)]" href="#faq">
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
}
