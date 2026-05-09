export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)]/60">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-[var(--color-muted)] sm:flex-row">
        <p>
          © {new Date().getFullYear()} YT Saver. Not affiliated with YouTube.
        </p>
        <p className="text-xs">
          Please only download content you have the right to use.
        </p>
      </div>
    </footer>
  );
}
