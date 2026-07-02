---
name: project-getuser-dedup-convention
description: govrate has a cache()-wrapped getUser() helper at lib/supabase/get-user.ts meant to dedupe auth calls across a request; not all pages use it yet.
metadata:
  type: project
---

The project introduced `lib/supabase/get-user.ts`:

```ts
import 'server-only'
import { cache } from 'react'
import { createClient } from './server'

export const getUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})
```

This was added in commit `079aeee` ("perf: Suspenseストリーミングの追加とgetUser呼び出しの重複排除") specifically to
avoid redundant Supabase Auth network round-trips within a single request/render pass (React's `cache()` dedupes
per-request). `app/components/header-auth.tsx` and `app/ranking/ranking-content.tsx` correctly import and use this
shared `getUser()`.

**However**, `app/page.tsx` (top page) and `app/signup/page.tsx` (added later) both bypass this helper and instead
call `createClient()` + `supabase.auth.getUser()` directly inline. Since `<Header>` (which renders `HeaderAuth`,
which calls the cached `getUser()`) is rendered in the root layout on every page, these pages end up making a
*second, non-deduped* auth check on top of the one Header already triggers — the exact inefficiency the perf
commit was meant to eliminate.

**Why:** the codebase has an established, intentional pattern for this exact "is user logged in, redirect if so"
check, and new pages should reuse it rather than reintroducing the raw pattern.

**How to apply:** when reviewing any new Server Component (page or layout) in this repo that needs to know
whether a user is logged in, check whether it uses `getUser` from `@/lib/supabase/get-user` rather than calling
`supabase.auth.getUser()` directly via `createClient()`. Flag direct usage as a Warning (perf/consistency), and
note the file can usually drop its `createClient` import entirely once switched over, since it exists only to
make that one auth call. See [[project-docs-screen-list]] for how new pages should also be reconciled against
`CLAUDE.md`'s screen table and `docs/`.
