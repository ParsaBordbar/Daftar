import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { DEFAULT_FONT, FONT_BY_ID } from './fonts'
import { INITIAL, ORNAMENT_LABELS, type PoemState } from './poem'
import { MAX_PAGES, newDoc, type Doc } from './doc'

const KEYS: Record<keyof PoemState, string> = {
  text: 't',
  title: 'n',
  poet: 'p',
  source: 's',
  fontId: 'f',
  themeId: 'h',
  formatId: 'm',
  layout: 'l',
  ornament: 'o',
  fontSize: 'z',
  lineHeight: 'g',
  letterSpacing: 'k',
  beitGap: 'b',
  showPageNumber: 'w',
  pageNumber: 'c',
  persianDigits: 'd',
  align: 'a',
  padding: 'r',
  watermark: 'v',
  grain: 'G',
  vignette: 'V',
  foxing: 'X',
  fibers: 'F',
  crease: 'C',
  bgImage: 'I',
  bgOpacity: 'B',
}
const INV = Object.fromEntries(
  Object.entries(KEYS).map(([k, v]) => [v, k]),
) as Record<string, keyof PoemState>

type Packed = Record<string, unknown>

function pack(state: PoemState, base: PoemState = INITIAL): Packed {
  const packed: Packed = {}
  for (const [key, short] of Object.entries(KEYS) as [keyof PoemState, string][]) {
    if (state[key] === base[key]) continue

    if (key === 'bgImage' && !/^https?:/.test(state.bgImage)) continue
    packed[short] = state[key]
  }
  return packed
}

function unpack(packed: Packed, base: PoemState = INITIAL): PoemState {
  const out: PoemState = { ...base }
  for (const [short, value] of Object.entries(packed)) {
    const key = INV[short]
    if (!key) continue
    if (typeof value === typeof INITIAL[key]) {
      ;(out as unknown as Record<string, unknown>)[key] = value
    }
  }
  if (!FONT_BY_ID.has(out.fontId)) out.fontId = DEFAULT_FONT
  if (!(out.ornament in ORNAMENT_LABELS)) out.ornament = INITIAL.ornament
  return out
}

export function encodeState(state: PoemState): string {
  return compressToEncodedURIComponent(JSON.stringify(pack(state)))
}

export function decodeState(token: string): PoemState | null {
  try {
    const json = decompressFromEncodedURIComponent(token)
    if (!json) return null
    return unpack(JSON.parse(json) as Packed)
  } catch {
    return null
  }
}

export function encodeDoc(doc: Doc): string {
  const out: Packed[] = []
  let prev = INITIAL
  for (const page of doc.pages) {
    out.push(pack(page, prev))
    prev = page
  }
  return compressToEncodedURIComponent(JSON.stringify(out))
}

export function decodeDoc(token: string): Doc | null {
  try {
    const json = decompressFromEncodedURIComponent(token)
    if (!json) return null
    const raw = JSON.parse(json)
    if (!Array.isArray(raw) || raw.length === 0) return null
    const pages: PoemState[] = []
    let prev = INITIAL
    for (const packed of raw.slice(0, MAX_PAGES)) {
      if (!packed || typeof packed !== 'object') return null
      const page = unpack(packed as Packed, prev)
      pages.push(page)
      prev = page
    }
    return { pages, active: 0 }
  } catch {
    return null
  }
}

export const shareUrl = (doc: Doc) =>
  `${location.origin}${location.pathname}#${hashFor(doc)}`

export const hashFor = (doc: Doc) =>
  doc.pages.length === 1 ? `p=${encodeState(doc.pages[0])}` : `d=${encodeDoc(doc)}`

export function readHash(): Doc | null {
  const d = location.hash.match(/[#&]d=([^&]+)/)
  if (d) return decodeDoc(d[1])
  const p = location.hash.match(/[#&]p=([^&]+)/)
  if (p) {
    const page = decodeState(p[1])
    return page ? newDoc(page) : null
  }
  return null
}
