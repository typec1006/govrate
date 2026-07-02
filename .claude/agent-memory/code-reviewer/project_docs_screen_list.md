---
name: project-docs-screen-list
description: govrate's screen list lives in CLAUDE.md (画面一覧 table) and per-page docs/0X-page-*.md files; new pages added outside that plan (e.g. app/signup) aren't tracked anywhere.
metadata:
  type: project
---

`CLAUDE.md` defines the full screen list for this app in a table (画面一覧): `/`, `/ranking`, `/vote`, `/settings`,
`/auth/error`. Each has a corresponding planning doc under `docs/` (`05-page-top.md`, `06-page-ranking.md`,
`07-page-vote.md`, `08-page-settings.md`, `09-page-error.md`), and `CLAUDE.md`'s project-wide work rule says
completed implementation work should flip that doc's `- [ ]` checkboxes to `- [x]`.

`app/signup/page.tsx` was added as a net-new page (2026-07-02, branch `feat/top-page-ranking`) that is **not** in
the CLAUDE.md screen table and has no corresponding `docs/` file — `grep`ing `docs/` for "signup" or "新規登録"
turns up nothing. It reuses the existing `signInWithGoogle` Server Action (login and signup are the same OAuth
flow in this app's design), so functionally it's fine, but it's an undocumented addition to the site's route
surface.

**Why:** the project's own convention requires docs to track screens/features so `docs/00-progress.md` stays an
accurate source of truth; an out-of-plan page silently breaks that invariant.

**How to apply:** when reviewing a new page under `app/` that isn't one of the five spec'd screens, call out (as
a Suggestion, not Critical) that it's absent from both the `CLAUDE.md` screen table and `docs/`, and ask whether
that's intentional (e.g. a marketing/SEO landing page) or whether a doc entry should be added. See
[[project-getuser-dedup-convention]] for the other recurring gap on new top-level pages.
