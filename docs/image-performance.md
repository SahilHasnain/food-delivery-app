# Image Performance & Caching Improvements

This document describes the production image loading issues we faced and the fixes applied.

## Problem Summary

- Network (Appwrite) image URLs were appended manually with `?project=...` each time, sometimes leading to duplicate or missing query params.
- React Native's default `<Image />` had no advanced caching on Android, causing late / blank images until user interaction (touch / scroll) triggered layout re-render.
- Cart reused the same remote URLs but they were only loaded after visiting Search (warm cache effect), giving the impression that only interacted items load.
- No prefetching strategy, so first paint always waited for network.

## Fixes Implemented

1. Added `lib/image.ts` with:
   - `buildAppwriteImageUrl()` to safely append the `project` query param only once.
   - `prefetchImages()` wrapper using `expo-image` prefetch with graceful fallback.
2. Replaced critical images (`MenuCard`, cart item product preview, product hero image) with `expo-image` component for:
   - Memory + disk caching (`cachePolicy="memory-disk"`).
   - Decode & transition animation for better UX.
   - High priority for hero image.
3. Prefetching:
   - Search screen now prefetches all fetched menu item images after data load.
   - `MenuCard` and product detail screen prefetch their own image on mount / load.
4. Centralized image URL building to eliminate scattered `encodeURI(url + '?project=...')` logic.
5. Avoided hook rule violations and duplicate imports: reorganized product detail component.

## How to Use in New Components

```ts
import { buildAppwriteImageUrl, prefetchImages } from "@/lib/image";
import { Image } from "expo-image";

const url = buildAppwriteImageUrl(remoteUrl, appwriteConfig.projectId);
<Image source={{ uri: url }} cachePolicy="memory-disk" contentFit="cover" />;
```

If you anticipate a list of URLs soon (e.g. FlatList data), call `prefetchImages(urlArray)` once you have them.

## Troubleshooting

- If an image still appears blank, confirm the final URL in dev tools / logs and ensure the Appwrite file is publicly viewable or the session is valid.
- For very large images, consider requesting resized variants via Appwrite's preview endpoints before caching.
- On slow devices, initial transition can be disabled by removing `transition={...}` prop.

## Next Possible Enhancements

- Add a lightweight `<CachedImage />` wrapper component to standardize placeholder, error fallback (`images.emptyState`), and retry logic.
- Implement on-disk size limits & periodic cleanup if storage footprint grows.
- Use Appwrite's image preview transformations (width/height) to reduce bandwidth.

## Related Files

- `lib/image.ts` – helpers & prefetch.
- `components/MenuCard.tsx` – now using `expo-image` with prefetch.
- `components/CartItem.tsx` – product image switched to `expo-image`.
- `app/(tabs)/product/[id].tsx` – hero image switched, prefetch logic.
- `app/(tabs)/search.tsx` – batch prefetch after query.

## Verification Steps

1. Clear app cache / reinstall build.
2. Open Search screen: images should appear faster (watch network panel / timing) and then show near-instantly when revisiting.
3. Navigate to a product detail: hero image should fade in quickly with cached data if visited earlier.
4. Add to cart, open Cart: product image should show instantly or within initial network fetch without needing extra taps.

---

Maintained by: engineering
Date: 2025-08-13
