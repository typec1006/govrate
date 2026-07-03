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
