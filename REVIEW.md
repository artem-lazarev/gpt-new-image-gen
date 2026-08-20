# Portfolio-ready review

Branch: `portfolio-ready` (not pushed; publishing is your call).

## What this is

`gpt-new-image-gen` is a single-purpose Next.js web app: upload an image, type an
edit prompt, and get the image back from OpenAI's `gpt-image-1` model. The plan doc
says it should use the Vercel AI SDK; the actual code calls `https://api.openai.com/v1/images/edits` directly with `fetch`. I fixed the repo to match reality (the README now describes the fetch-based design) rather than the plan.

## Stage 1 verdict: B — good bones, worth publishing

Preflight passed with no blockers: no secrets in history or HEAD, origin owned by
you, no third-party PII, no junk or large blobs committed.

## What changed and why

1. **Base commit state anyway had broken setup for a stranger.** Two competing
   lockfiles (`package-lock.json` + `pnpm-lock.yaml`) → deleted `package-lock.json`.
   pnpm is the declared package manager (`.cursorrules`, plan, pnpm-workspace).
2. **`pnpm install` / `pnpm build` failed on a fresh install.** pnpm 11 blocks
   dependency build scripts by default and `strictDepBuilds` makes `--frozen-lockfile`
   exit non-zero, which Next's build also relies on. Added `pnpm-workspace.yaml` with
   `allowBuilds` for `sharp`, `@tailwindcss/oxide`, `unrs-resolver`.
3. **`next@15.4.6` is deprecated and flagged with CVE-2025-66478** → upgraded to
   `next@15.5.23` (latest patched 15.x).
4. **`pnpm lint` was broken** — no ESLint config, `next lint` prompted interactively
   and would hang a stranger. Added `eslint` + `eslint-config-next`
   (`next/core-web-vitals`) via flat config in `eslint.config.mjs`, changed the
   script to `eslint .`, ignored generated `.next/` + `next-env.d.ts`.
5. **Dead code removed** — unused create-next-app SVGs (`public/*.svg`), unused
   shadcn components (`components/ui/{alert,input,progress}.tsx`), and unused deps
   (`ai`, `@ai-sdk/openai`, `lucide-react`, `@radix-ui/react-progress`) that the
   code never imported. `next/image` replaced the two `<img>` tags (data URLs, marked
   `unoptimized`).
6. **`.env.example`** created from the one real env read `OPENAI_API_KEY`
   (`app/api/edit-image/route.ts:37`). `.gitignore` already matched `.env*`, so an
   exception `!.env.example` was added.
7. **Metadata** — `app/layout.tsx` still said "Create Next App". New title/description.
8. **README** — replaced the default create-next-app text with a description of
   what actually works, setup, mechanism table, scripts, and an honest **Status**
   section.
9. **LICENSE** (MIT, you) added. Nothing is mergeable legally without one.
10. **GitHub metadata** — set a verb-first description and 8 topics via `gh repo edit`.

## What I verified, and how

- `preflight.sh` → `PASS — no blockers found`.
- `cleanroom.sh --install` after the fixes → `Clean — a fresh clone has what it
  needs.` No untracked source/config files; README paths all resolve in the clone.
- Fresh `git clone` → `pnpm install --frozen-lockfile` → exit 0 → `pnpm build` →
  exit 0 (production build compiled, types checked, both routes emitted).
- `pnpm lint` → `✖ 0 problems (0 errors, 0 warnings)`, exit 0.
- `checklinks.py README.md` → `ok — all resolve`, exit 0.
- Deprecation/peer checks: `eslint-config-next@15.5.23` requires eslint ≤9
  (verified via registry metadata) → pinned `eslint@^9`.
- Confirmed the OpenAI REST design by reading `app/api/edit-image/route.ts` end to
  end; confirmed `Download`, size control, and before/after comparison do **not**
  exist in the UI (they're documented as Not implemented in the README's Status).

## What I could not verify

- **Live generation.** No API call was made (paid, and I shouldn't use your key).
  The README's Status says upload/request/round-trip plumbing is verified; the actual
  gpt-image-1 output was not exercised here.
- **Production deployment.** No Vercel/other pipeline is set up; I marked it as such.
- **`.env.local`** contains a live `sk-proj-...` key sitting in the working tree. It
  is gitignored, never committed (checked history), and a fresh clone has no key — but you should consider **rotating it** since it exists as a plaintext file on this machine.

## Left for you

1. **Make `portfolio-ready` your published reality or not.** Merge to `main`/push
   when you decide. Nothing was pushed, no PR opened, visibility unchanged.
2. **Rotate the OpenAI key** above.
3. **Deploy somewhere** (e.g. Vercel) if you want a homepage link on the repo card
   and a live demo. Currently `homepageUrl` is empty.
4. **Add a social preview image** (repo Settings → General) before sharing.
5. `IMPLEMENTATION_PLAN.md` kept as-is; it is honest history. Delete it if you'd
   rather the repo not show an outdated plan with the `pnpm dlx` commands it uses.