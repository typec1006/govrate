# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server (Turbopack, outputs to .next/dev)
npm run build     # Production build (Turbopack by default)
npm run start     # Start production server
npm run lint      # Run ESLint directly (next lint was removed in v16)
npx next typegen  # Generate PageProps/LayoutProps/RouteContext type helpers
```

There is no test suite configured yet.

## Stack

- **Next.js 16.2.9** (App Router, Turbopack by default)
- **React 19.2.4**
- **TypeScript 5** (strict mode, path alias `@/*` → `./`)
- **Tailwind CSS v4** (imported via `@import "tailwindcss"` in `globals.css`, not the v3 `@tailwind` directives)
- **ESLint 9** with flat config (`eslint.config.mjs`)

## Architecture

Single App Router app. All routes live under `app/`. The root layout (`app/layout.tsx`) loads Geist fonts via `next/font/google` and sets CSS variables consumed by Tailwind.

---

## プロダクト仕様：知事レーティングサービス

47都道府県の知事を1〜5点で評価・投票できるWebサービス。Googleログインで認証し、各知事への評価をリアルタイムでランキング表示する。

### 追加スタック

| 項目 | 技術 |
|------|------|
| DB / 認証 | Supabase |
| デプロイ | Vercel |

### 必要な環境変数

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 認証要件

- Googleログインのみ
- 退会時はvotes→usersの順にカスケード削除
- セッション切れは `/auth/error` へ
- `/vote` `/settings` は未認証時に `/ranking` へリダイレクト（`proxy.ts` で制御）

### DB設計

**`governors`テーブル**

| カラム | 型 |
|--------|-----|
| id | uuid (PK) |
| prefecture | string（都道府県名） |
| name | string（知事名） |
| party | string（政党） |
| region | string（北海道・東北・関東・中部・近畿・中国・四国・九州） |
| created_at | timestamp |

**`votes`テーブル**

| カラム | 型 |
|--------|-----|
| id | uuid (PK) |
| user_id | uuid (FK → users.id) |
| governor_id | uuid (FK → governors.id) |
| score | int（1〜5） |
| created_at | timestamp |
| updated_at | timestamp |

`UNIQUE(user_id, governor_id)` 制約あり（upsertで更新）。

**RLSポリシー**

- `governors`: 全員がSELECT可
- `votes`: SELECT/INSERT/UPDATE は自分のレコードのみ
- `users`: SELECT/UPDATE/DELETE は自分のレコードのみ

**`ranking`ビュー**（全員読み取り可）

```sql
CREATE VIEW ranking AS
SELECT
  g.id, g.prefecture, g.name, g.party, g.region,
  ROUND(AVG(v.score)::numeric, 1) AS avg_score,
  COUNT(v.id) AS vote_count
FROM governors g
LEFT JOIN votes v ON g.id = v.governor_id
GROUP BY g.id
ORDER BY avg_score DESC NULLS LAST;
```

### 画面一覧

| 画面 | パス | ログイン |
|------|------|----------|
| トップ / ログイン | `/` | 不要 |
| ランキング | `/ranking` | 不要（ログイン誘導バナーあり） |
| 投票 | `/vote` | 必須 |
| 設定 / 退会 | `/settings` | 必須 |
| セッション切れ | `/auth/error` | - |

**ナビ（ログイン後）**：「投票」「ランキング」タブをヘッダーに表示。未ログイン時はタブ非表示・ログインボタンのみ。

### 投票機能

- スコアは1〜5の整数
- 1知事につき1票（upsertで変更可）
- 自分のスコアは自分だけ見える（RLS）
- 地域（8区分）フィルタ・都道府県名/知事名検索あり
- 投票後リアルタイムでランキングに反映（Supabase Realtime）
- 表示情報：平均スコア・投票数のみ（投票者情報は匿名）

### 実装フェーズ

1. **環境構築** — Supabaseパッケージ導入・env設定・クライアント設定・`proxy.ts`
2. **DB構築** — テーブル/RLS/ビュー作成SQL・47知事の初期データ投入
3. **認証実装** — Supabase Auth + Googleログイン・`proxy.ts`でルート保護
4. **画面実装** — レイアウト・各ページ・Realtimeランキング・レスポンシブ
5. **テスト・リリース** — Vercel本番デプロイ・動作確認

## Next.js Best Practices

### Server Components vs Client Components

デフォルトはServer Component。`'use client'`は本当に必要な箇所だけに絞る。

| Server Component を使う | Client Component を使う |
|------------------------|------------------------|
| DBアクセス・APIコール | `useState` / `useEffect` |
| 秘密鍵・環境変数の参照 | `onClick` などイベントハンドラ |
| JS バンドル削減 | `localStorage` / ブラウザAPI |

`'use client'`はツリーの末端（葉）に置く。レイアウトや大きなコンポーネントに付けると巨大なクライアントバンドルになる。

```tsx
// Bad: レイアウト全体をClientにしてしまう
'use client'
export default function Layout({ children }) { ... }

// Good: インタラクティブな部分だけを分離
export default function Layout({ children }) {
  return <nav><Logo /><SearchBar /></nav>  // SearchBarだけ'use client'
}
```

### データ取得

**Server Componentでは直接 async/await で取得する。**

```tsx
// Good: Server Componentで直接fetch
export default async function Page() {
  const data = await db.query(...)
  return <List items={data} />
}
```

**独立した複数リクエストは`Promise.all`で並列化する。**

```tsx
// Bad: 直列（遅い）
const a = await getA()
const b = await getB()

// Good: 並列
const [a, b] = await Promise.all([getA(), getB()])
```

**遅いデータは`<Suspense>`でストリーミングする。**

```tsx
export default function Page() {
  return (
    <>
      <StaticHeader />
      <Suspense fallback={<Skeleton />}>
        <SlowDataComponent />
      </Suspense>
    </>
  )
}
```

### Server Actions（データ変更）

- **必ず`'use server'`ファイルに切り出す**（Client Componentの中に定義しない）
- **すべてのServer Actionで認証・認可を再検証する**（ページレベルの検証は引き継がれない）
- **リソースの所有者確認も必ず行う**（IDOR防止）
- **返り値はUIに必要な最小限のみ**（DBレコードをそのまま返さない）

```ts
// app/lib/actions.ts
'use server'
import { createClient } from '@/lib/supabase/server'

export async function submitVote(governorId: string, score: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')  // 毎回検証

  await supabase.from('votes').upsert({ user_id: user.id, governor_id: governorId, score })
  return { success: true }  // 必要最小限だけ返す
}
```

### データセキュリティ

**サーバー専用コードには`import 'server-only'`を付ける。**

```ts
// lib/supabase/server.ts
import 'server-only'
// ...
```

**Client Componentに渡すデータは必要なフィールドだけに絞る。**

```tsx
// Bad: DB レコードをそのまま渡す
<VoteButton user={dbUser} />

// Good: 必要な値だけ渡す
<VoteButton userId={dbUser.id} />
```

**環境変数ルール：**
- `NEXT_PUBLIC_` プレフィックスなし → サーバーのみ（ブラウザに露出しない）
- `NEXT_PUBLIC_` プレフィックスあり → クライアントバンドルに含まれる

### Context / Provider パターン

React Contextはサーバーで使えないので、providerは`'use client'`にする。ただし`children`にServer Componentを渡すことはできる。

```tsx
// app/providers.tsx
'use client'
export function Providers({ children }: { children: React.ReactNode }) {
  return <SomeContext.Provider>{children}</SomeContext.Provider>
}

// app/layout.tsx（Server Component）
import { Providers } from './providers'
export default function Layout({ children }) {
  return <Providers>{children}</Providers>
}
```

### Proxy（認証ガード）

`proxy.ts` は軽量に保つ。認証の完全な検証はServer ActionやServer Componentでも必ず再実施する（proxyだけに頼らない）。

---

## Supabaseクライアントのルール（@supabase/ssr）

参照：[Supabase SSR Docs — Creating a client (Next.js)](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)

### 2種類のクライアントを使い分ける

| クライアント | 用途 | 関数 |
|------------|------|------|
| ブラウザ | Client Components | `createBrowserClient` |
| サーバー | Server Components / Server Actions / Route Handlers | `createServerClient` |

**ブラウザクライアント** (`lib/supabase/client.ts`) — シングルトン、何度呼んでも1インスタンス：

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

**サーバークライアント** (`lib/supabase/server.ts`) — リクエストごとに新規作成、cookiesを注入：

```ts
import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {} // Server Componentからは書き込めないため握りつぶす（proxyが担当）
        },
      },
    }
  )
}
```

### `getSession()`をサーバーで使わない

| メソッド | サーバーでの使用 | 理由 |
|---------|----------------|------|
| `getClaims()` | ✅ 推奨 | JWT署名をプロジェクトの公開鍵で毎回検証する |
| `getSession()` | ❌ 禁止 | JWTの再検証が保証されない。クッキーは偽造できるため信頼できない |

```ts
// Bad
const { data: { session } } = await supabase.auth.getSession()
const user = session?.user

// Good
const { data: { claims }, error } = await supabase.auth.getClaims()
if (error || !claims) redirect('/login')
```

### Proxyでトークンリフレッシュを担当する

Server Componentsはcookieに書き込めないため、**期限切れのAuthトークンをリフレッシュしてブラウザとサーバーの両方に渡す** のはproxyの責務。

```ts
// proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // トークンリフレッシュのためgetUser()を必ず呼ぶ（getClaims()でも可）
  const { data: { user } } = await supabase.auth.getUser()

  const protectedPaths = ['/vote', '/settings']
  if (protectedPaths.some(p => request.nextUrl.pathname.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL('/ranking', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### 環境変数（Supabase）

Supabaseドキュメントでは anon key を **publishable key** と呼んでいる：

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   # ダッシュボードの "anon/public" キー
```

---

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
