# The Booklet · دفتر — Persian poem page maker

A free, no-backend demo of [The Booklet](https://the-booklet.app) for Persian
poetry and prose. Paste or type a poem, pick a Persian typeface and a paper,
and export a clean book page as a high-resolution PNG sized for wherever you
are posting it.

Everything runs in the browser. There is no server and no account, and the poem
text never leaves the page. The one exception is Ganjoor full-text search: the
term you type is sent to Ganjoor's public API to find matching poems. Browsing
and reading poems still comes straight from the public `ganjoor-data` snapshot
on jsDelivr.

## What it does

- **The whole Persian canon, built in.** Browse [Ganjoor](https://ganjoor.net)
  — 234 poets, ~132,000 poems — pick a poem, trim it to the beits you want,
  and drop it onto the page with the title, poet, and source filled in. The
  body type resizes itself to fit what you chose.
- **Full-text search.** Type a hemistich you half-remember and get the poems
  that contain it, scoped to the poet you are browsing or across all of
  Ganjoor. Matches are highlighted in the result snippet.
- **18 Persian typefaces** across four groups — nastaliq (نستعلیق), naskh
  (نسخ), sans (بی‌سریف), and decorative (تزئینی). All are free and openly
  licensed. Fonts load on demand, so a visit costs one font, not eighteen.
- **8 paper themes** — aged paper, night, lapis, turquoise, saffron, white,
  pomegranate, charcoal — each with its own ink, accent, and gilt colours.
- **Three verse layouts** — single hemistich per line, paired hemistichs for
  the classical beit (بیت), and ragged-right for free verse (شعر نو).
- **Manuscript ornament** — divider, double frame, corner pieces, or a شمسه
  rosette.
- **13 export sizes** — Instagram story / square / portrait, Pinterest,
  LinkedIn, X, Telegram, WhatsApp, A4 and A5 at 300 dpi, phone and desktop
  wallpapers — each at 1×, 2×, or 3×.
- **Share links** that carry the whole page in the URL fragment. Nothing is
  stored anywhere; the recipient opens the link and gets your exact page,
  editable.
- **Anonymous counter** of how many pages have been made. It records a bare
  increment and nothing else.

## Where the poems come from

[`ganjoor/ganjoor-data`](https://github.com/ganjoor/ganjoor-data) publishes the
Ganjoor corpus as plain JSON served over jsDelivr with CORS open, so the app
reads it directly from the CDN and still has no backend of its own.

`src/lib/ganjoor.ts` fetches three file kinds — `manifest.json` for the poet
list, `_cat.json` for a book or chapter, and one file per poem — and caches
each in memory and `sessionStorage`. Ganjoor stores a beit as two verses
sharing a `CoupletIndex`, tagged `Right` (first hemistich) and `Left`;
`toCouplets` maps that onto the page's own stanza model and drops editorial
`Comment` verses.

By default this tracks `@main`. To pin a frozen snapshot, set
`VITE_GANJOOR_REF` to a commit SHA.

Note: the `ganjoor-data` repository does not declare a license. The poems
themselves are classical and long out of copyright, and this app reads the
data at runtime rather than redistributing it, but if you plan to vendor a
copy into your own repo, settle that with the Ganjoor maintainers first.

## Run it

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

Push to `main` and `.github/workflows/deploy.yml` builds and publishes, setting
the Vite `base` from the repository name automatically. Enable Pages with
**Settings → Pages → Source: GitHub Actions** once.

To publish from your machine instead:

```bash
VITE_BASE=/<repo-name>/ npm run deploy
```

## Font licensing

Every typeface in the picker is free to use and openly licensed. Sixteen of
the eighteen are SIL OFL 1.1 and are fetched from Google Fonts at runtime, so
this repository does not redistribute them; each was verified to carry the
Persian letters پ چ ژ گ ک ی before being added.

Two are bundled in [`public/fonts/`](public/fonts/README.md): **Mikhak**
(SIL OFL 1.1) and **Tanha** (Bitstream Vera Fonts License, with the author's
changes in the public domain). Both licenses require their notice to ship
alongside the font, so `Mikhak-OFL.txt` and `Tanha-LICENSE.txt` must stay in
that directory.

Ten previously bundled families were removed because they asserted copyright
without granting a license, or reserved all rights outright — see the
"Removed" section of `public/fonts/README.md` for the list and why. The picker
is generated from the `FONTS` array in `src/lib/fonts.ts`, so adding or
dropping a face is a one-file change.

## Configuration

| What | Where |
| --- | --- |
| Product name, URL, watermark text, Persian copy | `src/lib/brand.ts` |
| Font roster | `src/lib/fonts.ts` |
| Paper themes | `src/lib/themes.ts` |
| Export sizes | `src/lib/formats.ts` |
| Counter endpoint | `src/lib/counter.ts`, or `VITE_COUNTER_NS` / `VITE_COUNTER_KEY` |
| Ganjoor data revision | `VITE_GANJOOR_REF` (default `main`) |

The counter defaults to a free public service. If it is unreachable, blocked,
or rate-limited, the app falls back to a local-only count and keeps working —
so swapping it out is a one-file change with no other consequences.

## How the export stays honest

`html-to-image` can only inline fonts it is able to read, and it cannot read
rules out of a cross-origin stylesheet. So every face — bundled or from Google
— is fetched, base64-encoded, and injected as a data-URL `@font-face` at
runtime (`src/lib/fonts.ts`). That CSS is then handed to `html-to-image` as
`fontEmbedCSS`, which both guarantees the PNG matches the preview and skips a
redundant stylesheet walk on every export.

The page itself is always in the DOM at its true logical size (1080×1920 and
so on) and shrunk with a CSS transform for preview, so the export is a
pixel-exact capture rather than a re-render.
