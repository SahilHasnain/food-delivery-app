# Auth redirect bouncing back to Sign In (fix)

Problem: After a successful Sign In/Sign Up, the app navigated back to the Sign In screen. Only after a hot reload or app restart it showed Home.

Root cause

- The global router effect in `app/_layout.tsx` redirects based on `isAuthenticated`.
- Immediately after calling the API (`signIn` / `createUser`), the Zustand auth store (`isAuthenticated`) was still false, so the root effect re-routed to `/sign-in`.

What changed

- After successful `signIn` and `createUser`, we now trigger `fetchAuthenticatedUser()` from the auth store before navigating. This updates `isAuthenticated` and `user` right away, so route guards stop bouncing.

Files updated

- `app/(auth)/sign-in.tsx`
- `app/(auth)/sign-up.tsx`

Snippet (concept)

```ts
await signIn({ email, password });
await useAuthStore.getState().fetchAuthenticatedUser();
router.replace("/");
```

Why this works

- `fetchAuthenticatedUser()` reads the current Appwrite session and user document and sets `isAuthenticated=true` immediately. The root redirect logic now sees a correct state and keeps you on Home.

Notes

- `app/_layout.tsx` still performs the initial auth check on app load, which is desired.
- If you customize the flow later, prefer updating the store right after any auth-changing action.
