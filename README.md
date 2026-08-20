# gpt-new-image-gen

Web app that edits images with OpenAI's `gpt-image-1` model: drag in a photo, describe the change in a sentence, and get the edited image back.

Built with Next.js (App Router), React 19, Tailwind CSS, and shadcn/ui. The server passes the image straight to the OpenAI Images API, so nothing is stored and no database is involved.

## Try it

Requires an OpenAI API key. The generation itself happens server-side; the page and the whole flow run from a single dev server.

1. Install pnpm and run:

```bash
pnpm install
```

2. Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

3. Put your OpenAI key in `.env.local`:

```bash
OPENAI_API_KEY=sk-...
```

4. Start the dev server:

```bash
pnpm dev
```

Open http://localhost:3000, upload an image (PNG, JPEG, or WebP, up to 4 MB), enter an edit prompt, and hit Generate.

## How it works

| Piece | What it does |
| --- | --- |
| `components/ImageEditor.tsx` | Owns state: uploaded image → prompt → result. |
| `components/ImageUpload.tsx` | Drag-and-drop or click upload. Validates type (png/jpg/webp) and size (≤ 4 MB), converts to a base64 data URL. |
| `components/PromptInput.tsx` | Free-text prompt, capped at 500 characters. |
| `components/GeneratedImage.tsx` | Renders the result; shows a spinner while the request is in flight. |
| `app/api/edit-image/route.ts` | `POST /api/edit-image`. Parses the data URL, sends a multipart request to the OpenAI Images edits endpoint (`gpt-image-1`), returns the edited image as a data URL. |

The request is a direct call to `https://api.openai.com/v1/images/edits` using the built-in `fetch` — not the AI SDK. Both the request and the URL payload stay in memory; nothing touches disk or a database.

## Scripts

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm start    # serve the production build
pnpm lint     # eslint with next/core-web-vitals
```

## Status

**Working (verified):** image upload with validation, prompt input, the `/api/edit-image` route, the OpenAI round trip, result display, and loading state. `pnpm install`, `pnpm build`, and `pnpm lint` all complete cleanly on a fresh clone.

**Not implemented:** download of the result, before/after comparison, size selection, image history, user accounts. The plan document lists these as future work.

**Known limits:**

- `png`, `jpg`, and `webp` uploads up to 4 MB only.
- No model "size" is sent, so every request uses the OpenAI default (`1024x1024`).
- Generation calls are billed by OpenAI at `gpt-image-1` per-image rates; every Generate click is one paid request.
- Built with pnpm 11; the lockfile requires pnpm 11+ (`onlyBuiltDependencies` lives in `pnpm-workspace.yaml`).
- Currently hosted only in local dev; no deployment pipeline is set up.