# Fix: Status bar visibility on Tab screens (edge-to-edge + translucent)

This note explains why the status bar text/icons were not visible on tab screens and documents the final, robust fix while keeping Android edge‑to‑edge behavior.

## TL;DR

- Root cause: Global light-style status bar over a white tab background + translucent made icons appear invisible.
- Fix: Use a focus-aware StatusBar override inside each tab screen with `style="dark"` and a white background, keeping `translucent` so edge-to-edge stays on.
- Files touched: `components/FocusAwareStatusBar.tsx` and all tab screens in `app/(tabs)/*`.

---

## Context and symptoms

- Android `edgeToEdgeEnabled` is on in `app.json`.
- Root layout (`app/_layout.tsx`) sets `<StatusBar style="light" backgroundColor="#000000" translucent={false} />` as a baseline.
- Tab screens use white backgrounds. With the bar translucent at runtime, the global light style sits over white and loses contrast. Visually, it seems the status bar “disappears”.

## Goals

- Keep Android edge-to-edge and translucent behavior.
- Make status bar icons/text readable on each tab screen according to its background.
- Avoid global flickers/conflicts when navigating between screens.

## Final approach

1. Keep a predictable baseline in the root layout for splash and non-tab areas.
2. Add a small FocusAwareStatusBar component that only renders when a screen is focused, so the active screen controls the status bar safely.
3. Use it in each tab screen with `style="dark"` on white backgrounds.

## Implementation

### 1) Focus-aware component

File: `components/FocusAwareStatusBar.tsx`

Purpose: Only render a status bar when the hosting screen is focused. This prevents clashes with the global bar and other screens.

Contract:

- Props: `style` ("dark" | "light" | "auto" | "inverted"), `backgroundColor`, `translucent`.
- Behavior: Uses `useIsFocused()` from `@react-navigation/native` to render `expo-status-bar` only when focused.

Example shape:

```tsx
export default function FocusAwareStatusBar({
  style = "dark",
  backgroundColor = "#ffffff",
  translucent = true,
}) {
  const isFocused = useIsFocused();
  if (!isFocused) return null;
  return (
    <StatusBar
      style={style}
      backgroundColor={backgroundColor}
      translucent={translucent}
    />
  );
}
```

### 2) Per-screen override on tabs

Files updated:

- `app/(tabs)/index.tsx`
- `app/(tabs)/search.tsx`
- `app/(tabs)/cart.tsx`
- `app/(tabs)/profile.tsx`
- `app/(tabs)/product/[id].tsx`

Usage pattern (near the top of the screen tree, inside the root view):

```tsx
<SafeAreaView className="flex-1 bg-white">
  <FocusAwareStatusBar
    style="dark"
    backgroundColor="#ffffff"
    translucent={true}
  />
  {/* ...rest of screen... */}
</SafeAreaView>
```

Result:

- Dark icons on white backgrounds, consistent contrast.
- Translucency preserved to maintain edge-to-edge.

## Platform notes

### Android

- `backgroundColor` matters. For opaque top bars, use a solid color matching your header/top background.
- For fully transparent look over imagery, you can use `#00000000` (API 29+). Ensure text contrast via `style="light"` in that case.
- `expo-navigation-bar` customization in `app/_layout.tsx` remains for the bottom navigation bar; this change doesn’t affect it.

### iOS

- iOS ignores `backgroundColor` on the status bar; only `style` (light/dark/auto) matters.
- Safe area handling is already done via `react-native-safe-area-context`.

## Troubleshooting

- Still seeing light icons on white? Confirm the screen actually mounts `<FocusAwareStatusBar ... />` on the currently focused route (no early returns before it renders).
- Content underlapping the bar? Ensure the root view is a `SafeAreaView` and you’re not applying negative margins at the top.
- Flicker on navigation? Avoid multiple unguarded `<StatusBar>` instances. The focus-aware approach ensures only one active controller.
- Dark image header: switch that screen’s bar to `style="light"` and set a darker `backgroundColor` or provide a dark overlay behind the status area.

## Alternatives considered

- Global dynamic status bar in the root: prone to conflicts and timing issues as routes change.
- React Navigation screen options per route: workable, but the focus-aware component keeps logic colocated with the screen UI and avoids router coupling.

## References in this repo

- Baseline global bar and system bars: `app/_layout.tsx`
- Focus-aware component: `components/FocusAwareStatusBar.tsx`
- Implementations: `app/(tabs)/index.tsx`, `app/(tabs)/search.tsx`, `app/(tabs)/cart.tsx`, `app/(tabs)/profile.tsx`, `app/(tabs)/product/[id].tsx`

## Outcome

- Edge-to-edge stays enabled and translucent.
- Status bar icons/text are readable across tab screens.
- No global side effects or flickers during navigation.
