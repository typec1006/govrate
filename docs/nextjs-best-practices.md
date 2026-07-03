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
