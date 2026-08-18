# Bundled fonts

Each `.woff2` here was converted from the TTF/OTF originals with `fonttools`.

| File | Family | License |
| --- | --- | --- |
| `Tanha-Regular.woff2` | Tanha | SIL OFL 1.1 (see `Tanha-OFL.txt`) |
| `Mikhak-*.woff2` | Mikhak | SIL OFL 1.1 |
| `ASade-Regular.woff2` | A Sade | unverified |
| `DigiHilan-Bold.woff2` | Digi Hilan | unverified |
| `FarKamran-*.woff2` | Far Kamran | unverified |
| `FarMahsa-Regular.woff2` | Far Mahsa | unverified |
| `FarNiloo-*.woff2` | Far Niloo | unverified |
| `FarZiba-Regular.woff2` | Far Ziba | unverified |
| `MMHekayat-Regular.woff2` | MM Hekayat | unverified |
| `Paeez-Regular.woff2` | Paeez | unverified |
| `Badkhat-Regular.woff2` | Persian Badkh@t | unverified |
| `WParvaz-Regular.woff2` | W Parvaz | unverified |

**"unverified" means exactly that.** These faces shipped without a license file
in the source archive. Publishing this site redistributes them. Confirm the
terms for each before making the repository public, and drop the entry from
`src/lib/fonts.ts` for any you cannot clear — the app degrades cleanly, since
the picker is generated from that array.

The Google-hosted families (Noto Nastaliq Urdu, Gulzar, Amiri, Markazi Text,
Noto Naskh Arabic, Vazirmatn, Playfair Display) are all SIL OFL 1.1 and are
fetched at runtime rather than bundled.
