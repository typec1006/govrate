## Next.js 16 Breaking Changes

This is **Next.js 16**, not 15. Key differences that affect code you write:

**Async Request APIs** — `cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` are now fully async. Always `await` them:
```tsx
export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
}
```
Run `npx next typegen` to generate `PageProps`/`LayoutProps`/`RouteContext` helpers for type-safe params.

**Proxy instead of Middleware** — The `middleware.ts` file and `middleware` export are deprecated. Use `proxy.ts` with a `proxy` export instead.

**Linting** — `next lint` is removed. Run `eslint` (or `npm run lint`) directly. `next build` no longer runs linting.

**Caching APIs** — `cacheLife`/`cacheTag` are stable (no `unstable_` prefix). `revalidateTag` now requires a second `cacheLife` profile argument: `revalidateTag('posts', 'max')`. For immediate updates use `updateTag` in Server Actions.

**Partial Prerendering** — `experimental.ppr` is removed. Use top-level `cacheComponents: true` in `next.config.ts`.

**Parallel Routes** — All parallel route slots require an explicit `default.js` file or the build will fail.

**`next/image`** — `images.domains` is deprecated; use `images.remotePatterns`. Local images with query strings require `images.localPatterns.search` config. `next/legacy/image` is removed.

**Runtime config removed** — `serverRuntimeConfig` and `publicRuntimeConfig` are removed. Use environment variables (`NEXT_PUBLIC_` prefix for client-accessible values) or `process.env` in Server Components.
