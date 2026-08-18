import { DEFAULT_FONT, FONT_BY_ID } from './fonts'
import { DEFAULT_THEME } from './themes'
import { DEFAULT_FORMAT, FORMAT_BY_ID } from './formats'

export type Layout =

  | 'single'

  | 'beit'

  | 'free'

export type Ornament = 'none' | 'rule' | 'frame' | 'corners' | 'shamse'

export interface PoemState {
  text: string
  title: string
  poet: string
  source: string
  fontId: string
  themeId: string
  formatId: string
  layout: Layout
  ornament: Ornament

  fontSize: number
  lineHeight: number
  letterSpacing: number

  beitGap: number
  showPageNumber: boolean
  pageNumber: number

  persianDigits: boolean
  align: 'center' | 'justify' | 'start'
  padding: number

  watermark: boolean
}

export const SAMPLE = `بشنو این نی چون شکایت می‌کند
از جدایی‌ها حکایت می‌کند

کز نیستان تا مرا ببریده‌اند
در نفیرم مرد و زن نالیده‌اند

سینه خواهم شرحه شرحه از فراق
تا بگویم شرح درد اشتیاق`

export const INITIAL: PoemState = {
  text: SAMPLE,
  title: 'نی‌نامه',
  poet: 'مولانا جلال‌الدین بلخی',
  source: 'مثنوی معنوی، دفتر اول',
  fontId: DEFAULT_FONT,
  themeId: DEFAULT_THEME,
  formatId: DEFAULT_FORMAT,
  layout: 'single',
  ornament: 'rule',
  fontSize: 52,
  lineHeight: 1.85,
  letterSpacing: 0,
  beitGap: 0.7,
  showPageNumber: true,
  pageNumber: 1,
  persianDigits: true,
  align: 'center',
  padding: 110,
  watermark: true,
}

export const LAYOUT_LABELS: Record<Layout, string> = {
  single: 'تک‌مصراعی',
  beit: 'دو مصراعی',
  free: 'شعر نو',
}

export const ORNAMENT_LABELS: Record<Ornament, string> = {
  none: 'بدون تزئین',
  rule: 'خط جدا‌کننده',
  frame: 'کادر',
  corners: 'گوشه‌ها',
  shamse: 'شمسه',
}

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
export const toFa = (n: number | string) =>
  String(n).replace(/[0-9]/g, (d) => FA_DIGITS[+d])

export function fitFontSize(
  state: PoemState,
  lineCount: number,
  stanzaCount: number,
): number {
  if (lineCount < 1) return INITIAL.fontSize
  const format = FORMAT_BY_ID.get(state.formatId)
  if (!format) return INITIAL.fontSize

  const font = FONT_BY_ID.get(state.fontId)
  const sizeAdjust = font?.sizeAdjust ?? 1
  const leading = state.lineHeight * (font?.lineHeightAdjust ?? 1)

  const pageHeight = (format.h / format.w) * 1080

  const FIXED = 175

  const furnitureUnits =
    (state.title ? 0.68 * 1.6 : 0) +
    (state.poet ? 0.5 * 1.5 : 0) +
    (state.source ? 0.38 * 1.5 : 0)

  const stanzaGaps = Math.max(0, stanzaCount - 1) * state.beitGap
  const innerGaps = Math.max(0, lineCount - stanzaCount) * state.beitGap * 0.3
  const verseUnits = (lineCount + stanzaGaps + innerGaps) * leading

  const available = pageHeight - state.padding * 2 - FIXED
  const denominator = sizeAdjust * (furnitureUnits + verseUnits)
  if (available <= 0 || denominator <= 0) return INITIAL.fontSize

  return Math.round(Math.min(72, Math.max(16, (available / denominator) * 0.95)))
}

export interface Stanza {
  lines: string[]
}

export function parseStanzas(text: string): Stanza[] {
  return text
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n+/)
    .map((block) => ({
      lines: block.split('\n').map((l) => l.trim()).filter(Boolean),
    }))
    .filter((s) => s.lines.length > 0)
}

export function pairBeits(lines: string[]): [string, string?][] {
  const out: [string, string?][] = []
  for (let i = 0; i < lines.length; i += 2) out.push([lines[i], lines[i + 1]])
  return out
}
