// Helpers for robust image URL handling and prefetching
import { Image as ExpoImage } from "expo-image";

// Append the Appwrite project query param if it's not present already
export function buildAppwriteImageUrl(url: string, projectId?: string): string {
  if (!url) return url;

  // If the URL already includes a project query or it's not an Appwrite URL, return as-is
  if (/([?&])project=/.test(url)) return url;

  if (!projectId) return url;

  const hasQuery = url.includes("?");
  return `${url}${hasQuery ? "&" : "?"}project=${encodeURIComponent(
    projectId,
  )}`;
}

// Best-effort prefetch with graceful fallback
export async function prefetchImages(urls: string[] = []) {
  try {
    const unique = Array.from(new Set(urls.filter(Boolean)));
    await Promise.allSettled(unique.map((u) => ExpoImage.prefetch(u)));
  } catch {
    // ignore
  }
}
