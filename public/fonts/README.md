# Bundled fonts

Only two families are bundled here. Everything else in the picker is served
from Google Fonts at runtime and is SIL OFL 1.1. Each `.woff2` below was
converted from the TTF/OTF originals with `fonttools`.

| File | Family | License | Upstream |
| --- | --- | --- | --- |
| `Mikhak-*.woff2` | Mikhak | SIL OFL 1.1 — see `Mikhak-OFL.txt` | [aminabedi68/Mikhak](https://github.com/aminabedi68/Mikhak) |
| `Tanha-Regular.woff2` | Tanha | Bitstream Vera Fonts License; Rastikerdar's changes public domain; Roboto glyphs Apache 2.0 — see `Tanha-LICENSE.txt` | [rastikerdar/tanha-font](https://github.com/rastikerdar/tanha-font) |

Both licenses require the notice to travel with the font, so
`Mikhak-OFL.txt` and `Tanha-LICENSE.txt` must stay in this directory and ship
with any build. Tanha is **not** OFL, despite what earlier revisions of this
file claimed — the Bitstream Vera license additionally forbids redistributing
it under a name containing "Bitstream" or "Vera", which "Tanha" satisfies.

## Removed

Ten families previously bundled here were dropped because their embedded
`name` tables assert copyright with no license grant, or assert
"All rights reserved" outright: MM Hekayat (Irancell), Digi Hilan and Paeez
(DigiFonts), Far Kamran, Far Mahsa, Far Niloo and Far Ziba (Abolfazl
Seilsepour), A Sade (Mehdi Sabaghi, AutoCAD-derived), Badkhat, and W Parvaz
(no author or owner recorded at all). Do not re-add any of them without a
written grant.

## Google-hosted families

Noto Nastaliq Urdu, Gulzar, Amiri, Markazi Text, Noto Naskh Arabic,
Scheherazade New, Lateef, Vazirmatn, Estedad, Lalezar, Katibeh, Jomhuria,
Aref Ruqaa, Reem Kufi, Rakkas, Vibes, and Playfair Display are all SIL OFL 1.1
and are fetched at runtime rather than bundled, so this repository does not
redistribute them. Every one was checked for the Persian letters
پ چ ژ گ ک ی before being added.
