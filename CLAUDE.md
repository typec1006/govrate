# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 作業ルール

実装フェーズのタスクが完了したら、対応する `docs/` 配下のmdファイルのチェックボックスを `- [ ]` から `- [x]` に更新すること。ページ単位・機能単位で完了したタイミングで都度更新する。

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

@docs/product-spec.md

@docs/nextjs-best-practices.md

@docs/supabase-client-rules.md

@docs/nextjs16-breaking-changes.md
