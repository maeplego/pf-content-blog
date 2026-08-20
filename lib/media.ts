/** Pick the best public URL from a pf-media file view. */
export type MediaVariant = { url?: string };
export type MediaFileView = {
  variants?: Record<string, MediaVariant>;
};

export function coverUrlFromFileView(view: MediaFileView): string | null {
  const variants = view.variants ?? {};
  const order = ["detail", "thumb", "orig"] as const;
  for (const key of order) {
    const url = variants[key]?.url?.trim();
    if (url) return url;
  }
  return null;
}

export function mediaApiConfigured(): boolean {
  return Boolean(process.env.MEDIA_API_URL?.trim());
}

export function mediaApiBase(): string {
  return (process.env.MEDIA_API_URL ?? "").replace(/\/$/, "");
}
