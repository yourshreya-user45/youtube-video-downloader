import { useCallback, useState } from "react";
import { extractVideoId } from "./lib/youtube";
import {
  fetchVideoMeta,
  resolveDownload,
  downloadToDevice,
  sanitizeFilename,
  type VideoMeta,
  type DownloadFormat,
  type VideoQuality,
} from "./lib/api";
import Header from "./components/Header";
import Hero from "./components/Hero";
import UrlForm from "./components/UrlForm";
import VideoCard from "./components/VideoCard";
import Features from "./components/Features";
import Footer from "./components/Footer";

export type DownloadingState = {
  format: DownloadFormat;
  quality?: VideoQuality;
} | null;

export default function App() {
  const [url, setUrl] = useState("");
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<DownloadingState>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleFetch = useCallback(async (raw: string) => {
    setError(null);
    setDownloadError(null);
    setMeta(null);

    const id = extractVideoId(raw);
    if (!id) {
      setError("Please enter a valid YouTube URL or video ID.");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchVideoMeta(id);
      setMeta(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't fetch video info. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownload = useCallback(
    async (format: DownloadFormat, quality?: VideoQuality) => {
      if (!meta) return;
      setDownloadError(null);
      setDownloading({ format, quality });

      try {
        const result = await resolveDownload(meta.videoId, { format, quality });
        const ext = format === "audio" ? "mp3" : "mp4";
        const filename = sanitizeFilename(meta.title, ext);
        await downloadToDevice(result, filename);
      } catch (err) {
        setDownloadError(
          err instanceof Error
            ? err.message
            : "Download failed. Please try again."
        );
      } finally {
        setDownloading(null);
      }
    },
    [meta]
  );

  const handleReset = useCallback(() => {
    setMeta(null);
    setUrl("");
    setError(null);
    setDownloadError(null);
  }, []);

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-3xl px-4 pt-10 pb-6 sm:pt-16 sm:pb-10">
          <Hero />
          <UrlForm
            value={url}
            onChange={setUrl}
            onSubmit={handleFetch}
            loading={loading}
            error={error}
          />

          {meta && (
            <div className="fade-up mt-10">
              <VideoCard
                meta={meta}
                onDownload={handleDownload}
                downloading={downloading}
                downloadError={downloadError}
                onReset={handleReset}
              />
            </div>
          )}
        </section>

        {!meta && (
          <section className="mx-auto w-full max-w-5xl px-4 pb-20">
            <Features />
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
