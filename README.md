<div align="center">

# دفتر · Daftar

**A Persian poem page maker that runs entirely in your browser.**

[**▶ Open the app**](https://parsabordbar.github.io/Daftar/) · [Report a bug](https://github.com/ParsaBordbar/Daftar/issues) · [فارسی](FA-README.md)

[![Deploy](https://github.com/ParsaBordbar/Daftar/actions/workflows/deploy.yml/badge.svg)](https://github.com/ParsaBordbar/Daftar/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![No backend](https://img.shields.io/badge/backend-none-brightgreen)](#privacy-what-leaves-your-browser)
[![Poems: Ganjoor](https://img.shields.io/badge/poems-Ganjoor-8b5e34)](https://ganjoor.net)

<p>
  <img src="docs/page-kaghaz.png"  width="30%" alt="Rumi's ney-nameh on aged paper in Noto Nastaliq" />
  <img src="docs/page-shab.png"    width="30%" alt="The same poem on the night paper in Amiri naskh" />
  <img src="docs/page-zaferan.png" width="30%" alt="The same poem on saffron paper in Gulzar nastaliq" />
</p>

<sub>Rumi's نی‌نامه, exported at Instagram-story size — aged paper / نستعلیق · night / نسخ · saffron / گلزار</sub>

</div>

---

## What this is

Type or paste a Persian poem — or pull one straight out of the [Ganjoor](https://ganjoor.net) corpus — pick a
typeface and a paper, and export a finished book page as a high-resolution PNG sized for wherever you're posting it.

There is no server, no account, and no build step between you and the image. The whole app is a static bundle on
GitHub Pages.

> **Try it now → <https://parsabordbar.github.io/Daftar/>**

## Feature tour

### The Persian canon, built in

Browse Ganjoor's ~234 poets and ~132,000 poems in-app, pick one, trim it to the beits you want, and drop it onto
the page with title, poet, and source filled in. Body type auto-fits whatever you selected.

Half-remember a hemistich? Full-text search finds the poems containing it, scoped either to the poet you're
browsing or across all of Ganjoor, with matches highlighted in the snippet.

### 18 Persian typefaces

Four groups — نستعلیق (nastaliq), نسخ (naskh), بی‌سریف (sans), تزئینی (decorative). Every face is free and openly
licensed, and each was checked for the Persian letters پ چ ژ گ ک ی before being added. Fonts load on demand, so a
visit downloads one face, not eighteen.

### 8 paper themes

`کاغذ` aged paper · `شب` night · `لاجورد` lapis · `فیروزه` turquoise · `زعفران` saffron · `سپید` white ·
`انار` pomegranate · `زغال` charcoal — each with its own ink, accent, and gilt colours.

### Layout and ornament

Three verse layouts: one hemistich per line, paired hemistichs for the classical بیت, and ragged-right for
free verse (شعر نو). Manuscript ornaments: divider, double frame, corner pieces, or a شمسه rosette.

### 13 export sizes, at 1× / 2× / 3×

| Preset | 1× pixels | Preset | 1× pixels |
| --- | --- | --- | --- |
| Instagram story | 1080 × 1920 | Telegram | 1280 × 1600 |
| Instagram square | 1080 × 1080 | A4 print | 1240 × 1754 |
| Instagram portrait | 1080 × 1350 | A5 print | 874 × 1240 |
| Pinterest | 1000 × 1500 | Phone wallpaper | 1440 × 3120 |
| Pinterest long | 1000 × 2100 | Desktop wallpaper | 2560 × 1440 |
| LinkedIn | 1200 × 628 | | |
| LinkedIn square | 1200 × 1200 | | |
| X / Twitter | 1600 × 900 | | |

The A4 and A5 presets are 150 dpi at 1×, so export them at **2× for a true 300 dpi print file**
(2480 × 3508 and 1748 × 2480).

### Share links that carry the whole page

The full page state is LZ-compressed into the URL fragment. Nothing is stored anywhere — the recipient opens the
link and gets your exact page, still editable.

## Privacy: what leaves your browser

| | Leaves your machine? |
| --- | --- |
| Your poem text, title, layout, and the exported PNG | **No.** Rendered and encoded locally; export never uploads. |
| Share links | **No.** The state lives in the URL fragment, which browsers never send to a server. |
| Browsing / reading Ganjoor poems | Yes — plain file reads from the `ganjoor-data` snapshot on jsDelivr. |
| Ganjoor full-text search | Yes — your search term is sent to Ganjoor's public API (`api.ganjoor.net`). |
| Page counter | A bare increment to a public counter service. No content, no identifiers. |

## Run it locally

```bash
git clone https://github.com/ParsaBordbar/Daftar.git
cd Daftar
npm install
npm run dev
```

| Script | Does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | [oxlint](https://oxc.rs) |
| `npm run deploy` | Build and push `dist/` to `gh-pages` from your machine |

## Deploy

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds with
`VITE_BASE=/<repo-name>/`, copies `index.html` to `404.html` so deep links survive, and publishes to Pages.
Enable it once under **Settings → Pages → Source: GitHub Actions**.

To publish from your machine instead, set `VITE_BASE` explicitly — the default in `vite.config.ts` is
lowercase `/daftar/` and GitHub Pages paths are case-sensitive:

```bash
VITE_BASE=/Daftar/ npm run deploy
```

## How it works

### Where the poems come from

[`ganjoor/ganjoor-data`](https://github.com/ganjoor/ganjoor-data) publishes the Ganjoor corpus as plain JSON over
jsDelivr with CORS open, so the app reads it straight from the CDN and still has no backend.

`src/lib/ganjoor.ts` fetches three file kinds — `manifest.json` for the poet list, `_cat.json` for a book or
chapter, and one file per poem — caching each in memory and `sessionStorage`. Ganjoor stores a beit as two verses
sharing a `CoupletIndex`, tagged `Right` (first hemistich) and `Left`; `toCouplets` maps that onto the page's
stanza model and drops editorial `Comment` verses.

The snapshot tracks `@main` by default. Pin a frozen revision with `VITE_GANJOOR_REF=<commit-sha>`.

> The `ganjoor-data` repository declares no license. The poems are classical and long out of copyright, and this
> app reads the data at runtime rather than redistributing it — but settle terms with the Ganjoor maintainers
> before vendoring a copy into your own repo.

### Why the export matches the preview

`html-to-image` can only inline fonts it can read, and it cannot read rules out of a cross-origin stylesheet. So
every face — bundled or Google-hosted — is fetched, base64-encoded, and injected as a data-URL `@font-face` at
runtime (`src/lib/fonts.ts`). That CSS is handed to `html-to-image` as `fontEmbedCSS`, which both guarantees the
PNG matches the preview and skips a redundant stylesheet walk on every export.

The page also lives in the DOM at its true logical size (1080 × 1920 and so on) and is shrunk with a CSS transform
only for preview — so the export is a pixel-exact capture, not a re-render at a different size.

### Configuration

| What | Where |
| --- | --- |
| Product name, URL, watermark, Persian copy | `src/lib/brand.ts` |
| Font roster | `src/lib/fonts.ts` |
| Paper themes | `src/lib/themes.ts` |
| Export sizes | `src/lib/formats.ts` |
| Counter endpoint | `src/lib/counter.ts`, or `VITE_COUNTER_NS` / `VITE_COUNTER_KEY` |
| Ganjoor data revision | `VITE_GANJOOR_REF` (default `main`) |
| Pages base path | `VITE_BASE` (default `/daftar/`) |

The counter defaults to a free public service. If it's unreachable, blocked, or rate-limited, the app falls back
to a local-only count and keeps working — so swapping it out is a one-file change with no other consequences.

## Font licensing

All 18 pickable faces are free and openly licensed. Sixteen are SIL OFL 1.1 fetched from Google Fonts at runtime,
so this repository does not redistribute them.

Two are bundled in [`public/fonts/`](public/fonts/README.md): **Mikhak** (SIL OFL 1.1) and **Tanha** (Bitstream
Vera Fonts License, author's changes in the public domain). Both licenses require their notice to ship alongside
the font, so `Mikhak-OFL.txt` and `Tanha-LICENSE.txt` must stay in that directory.

Ten previously bundled families were removed for asserting copyright without granting a license, or reserving all
rights outright — see the "Removed" section of `public/fonts/README.md`. The picker is generated from the `FONTS`
array in `src/lib/fonts.ts`, so adding or dropping a face is a one-file change.

## License

The code is [MIT](LICENSE). Use it, fork it, change it, ship it commercially — no permission needed, no fee. MIT's
only condition is that the copyright line and license text stay with the source.

Beyond that, a name-drop is plenty. Something like "based on [Daftar](https://github.com/ParsaBordbar/Daftar)" in
your README, About page, or footer is exactly the credit this is hoping for. A request, not a requirement.

MIT covers this repository's own code and content. It does not relicense things that arrive under their own terms:

- **Bundled fonts** — Mikhak (SIL OFL 1.1) and Tanha (Bitstream Vera Fonts License). Keep
  `public/fonts/Mikhak-OFL.txt` and `public/fonts/Tanha-LICENSE.txt` in any fork or build. See
  [`public/fonts/README.md`](public/fonts/README.md).
- **Google-hosted fonts** — SIL OFL 1.1, fetched at runtime, never redistributed here.
- **Poems** — the Ganjoor corpus, read from the CDN at runtime. The texts are classical and out of copyright, but
  `ganjoor-data` itself declares no license; see [Where the poems come from](#where-the-poems-come-from).

---

<div align="center">

Built by [Parsa Bordbar](https://github.com/ParsaBordbar) · Poems by [Ganjoor](https://ganjoor.net)

</div>
