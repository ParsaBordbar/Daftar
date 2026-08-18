import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { INITIAL, type PoemState } from './poem'

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
}
const INV = Object.fromEntries(
  Object.entries(KEYS).map(([k, v]) => [v, k]),
) as Record<string, keyof PoemState>

export function encodeState(state: PoemState): string {
  const packed: Record<string, unknown> = {}
  for (const [key, short] of Object.entries(KEYS) as [keyof PoemState, string][]) {
    if (state[key] !== INITIAL[key]) packed[short] = state[key]
  }
  return compressToEncodedURIComponent(JSON.stringify(packed))
}

export function decodeState(token: string): PoemState | null {
  try {
    const json = decompressFromEncodedURIComponent(token)
    if (!json) return null
    const packed = JSON.parse(json) as Record<string, unknown>
    const out: PoemState = { ...INITIAL }
    for (const [short, value] of Object.entries(packed)) {
      const key = INV[short]
      if (!key) continue

      if (typeof value === typeof INITIAL[key]) {
        ;(out as unknown as Record<string, unknown>)[key] = value
      }
    }
    return out
  } catch {
    return null
  }
}

export const shareUrl = (state: PoemState) =>
  `${location.origin}${location.pathname}#p=${encodeState(state)}`

export function readHash(): PoemState | null {
  const m = location.hash.match(/[#&]p=([^&]+)/)
  return m ? decodeState(m[1]) : null
}
