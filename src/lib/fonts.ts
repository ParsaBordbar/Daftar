export type FontStyle = 'nastaliq' | 'naskh' | 'sans' | 'display'

export interface FontDef {
  id: string

  label: string

  family: string
  style: FontStyle
  source: 'local' | 'google'

  faces?: { url: string; weight: number }[]
  googleSpec?: string

  sizeAdjust?: number
  lineHeightAdjust?: number
  license: string
}

const f = (url: string, weight = 400) => ({ url, weight })

export const FONTS: FontDef[] = [

  {
    id: 'nastaliq',
    label: 'نستعلیق',
    family: 'Noto Nastaliq Urdu',
    style: 'nastaliq',
    source: 'google',
    googleSpec: 'Noto+Nastaliq+Urdu:wght@400;700',

    sizeAdjust: 0.88,
    lineHeightAdjust: 1.54,
    license: 'SIL OFL 1.1',
  },
  {
    id: 'gulzar',
    label: 'گلزار',
    family: 'Gulzar',
    style: 'nastaliq',
    source: 'google',
    googleSpec: 'Gulzar',
    sizeAdjust: 1.15,
    lineHeightAdjust: 1.6,
    license: 'SIL OFL 1.1',
  },

  {
    id: 'amiri',
    label: 'امیری',
    family: 'Amiri',
    style: 'naskh',
    source: 'google',
    googleSpec: 'Amiri:ital,wght@0,400;0,700;1,400',
    sizeAdjust: 0.98,
    lineHeightAdjust: 0.94,
    license: 'SIL OFL 1.1',
  },
  {
    id: 'markazi',
    label: 'مرکزی',
    family: 'Markazi Text',
    style: 'naskh',
    source: 'google',
    googleSpec: 'Markazi+Text:wght@400;600;700',
    sizeAdjust: 1.17,
    lineHeightAdjust: 0.94,
    license: 'SIL OFL 1.1',
  },
  {
    id: 'notonaskh',
    label: 'نسخ',
    family: 'Noto Naskh Arabic',
    style: 'naskh',
    source: 'google',
    googleSpec: 'Noto+Naskh+Arabic:wght@400;700',
    sizeAdjust: 1.04,
    lineHeightAdjust: 0.96,
    license: 'SIL OFL 1.1',
  },
  {
    id: 'scheherazade',
    label: 'شهرزاد',
    family: 'Scheherazade New',
    style: 'naskh',
    source: 'google',
    googleSpec: 'Scheherazade+New:wght@400;700',
    sizeAdjust: 1.0,
    lineHeightAdjust: 0.86,
    license: 'SIL OFL 1.1',
  },
  {
    id: 'lateef',
    label: 'لطیف',
    family: 'Lateef',
    style: 'naskh',
    source: 'google',
    googleSpec: 'Lateef:wght@300;400;700',
    sizeAdjust: 1.3,
    lineHeightAdjust: 1.1,
    license: 'SIL OFL 1.1',
  },

  {
    id: 'tanha',
    label: 'تنها',
    family: 'Tanha',
    style: 'sans',
    source: 'local',
    faces: [f('Tanha-Regular.woff2')],
    sizeAdjust: 0.97,
    lineHeightAdjust: 1.01,
    license: 'Bitstream Vera License · public domain changes',
  },
  {
    id: 'mikhak',
    label: 'میخک',
    family: 'Mikhak',
    style: 'sans',
    source: 'local',
    faces: [f('Mikhak-Regular.woff2'), f('Mikhak-Bold.woff2', 700)],
    sizeAdjust: 1.04,
    lineHeightAdjust: 1.04,
    license: 'SIL OFL 1.1',
  },
  {
    id: 'vazir',
    label: 'وزیر',
    family: 'Vazirmatn',
    style: 'sans',
    source: 'google',
    googleSpec: 'Vazirmatn:wght@300;400;700',
    license: 'SIL OFL 1.1',
  },
  {
    id: 'estedad',
    label: 'استعداد',
    family: 'Estedad',
    style: 'sans',
    source: 'google',
    googleSpec: 'Estedad:wght@300;400;700',
    sizeAdjust: 1.07,
    lineHeightAdjust: 1.05,
    license: 'SIL OFL 1.1',
  },

  {
    id: 'lalezar',
    label: 'لاله‌زار',
    family: 'Lalezar',
    style: 'display',
    source: 'google',
    googleSpec: 'Lalezar',
    sizeAdjust: 1.23,
    lineHeightAdjust: 1.04,
    license: 'SIL OFL 1.1',
  },
  {
    id: 'katibeh',
    label: 'کتیبه',
    family: 'Katibeh',
    style: 'display',
    source: 'google',
    googleSpec: 'Katibeh',
    sizeAdjust: 1.02,
    lineHeightAdjust: 1.3,
    license: 'SIL OFL 1.1',
  },
  {
    id: 'jomhuria',
    label: 'جمهوریه',
    family: 'Jomhuria',
    style: 'display',
    source: 'google',
    googleSpec: 'Jomhuria',
    sizeAdjust: 1.54,
    lineHeightAdjust: 1.5,
    license: 'SIL OFL 1.1',
  },
  {
    id: 'arefruqaa',
    label: 'عارف رقعه',
    family: 'Aref Ruqaa',
    style: 'display',
    source: 'google',
    googleSpec: 'Aref+Ruqaa:wght@400;700',
    sizeAdjust: 1.29,
    lineHeightAdjust: 1.05,
    license: 'SIL OFL 1.1',
  },
  {
    id: 'reemkufi',
    label: 'کوفی',
    family: 'Reem Kufi',
    style: 'display',
    source: 'google',
    googleSpec: 'Reem+Kufi:wght@400;700',
    sizeAdjust: 0.87,
    lineHeightAdjust: 1.09,
    license: 'SIL OFL 1.1',
  },
  {
    id: 'rakkas',
    label: 'رقاص',
    family: 'Rakkas',
    style: 'display',
    source: 'google',
    googleSpec: 'Rakkas',
    sizeAdjust: 1.17,
    lineHeightAdjust: 1.1,
    license: 'SIL OFL 1.1',
  },
  {
    id: 'vibes',
    label: 'وایبز',
    family: 'Vibes',
    style: 'display',
    source: 'google',
    googleSpec: 'Vibes',
    sizeAdjust: 1.03,
    lineHeightAdjust: 0.95,
    license: 'SIL OFL 1.1',
  },
]

export const CHROME_FONTS: FontDef[] = [
  {
    id: '_playfair',
    label: 'Playfair Display',
    family: 'Playfair Display',
    style: 'display',
    source: 'google',
    googleSpec: 'Playfair+Display:ital,wght@0,400;0,500;1,400',
    license: 'SIL OFL 1.1',
  },
]

export const FONT_BY_ID = new Map(
  [...FONTS, ...CHROME_FONTS].map((x) => [x.id, x]),
)
export const DEFAULT_FONT = 'nastaliq'

export const STYLE_LABELS: Record<FontStyle, string> = {
  nastaliq: 'نستعلیق',
  naskh: 'نسخ',
  sans: 'بی‌سریف',
  display: 'تزئینی',
}

const loaded = new Map<string, Promise<void>>()

const toDataUrl = async (url: string): Promise<string> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`font fetch failed: ${url} (${res.status})`)
  const buf = new Uint8Array(await res.arrayBuffer())
  let bin = ''

  for (let i = 0; i < buf.length; i += 0x8000) {
    bin += String.fromCharCode(...buf.subarray(i, i + 0x8000))
  }
  return `data:font/woff2;base64,${btoa(bin)}`
}

const inject = (css: string, id: string) => {
  const el = document.createElement('style')
  el.dataset.font = id
  el.textContent = css
  document.head.appendChild(el)
}

const embedLocal = async (font: FontDef) => {
  const base = `${import.meta.env.BASE_URL}fonts/`
  const rules = await Promise.all(
    (font.faces ?? []).map(async (face) => {
      const data = await toDataUrl(base + face.url)
      return `@font-face{font-family:"${font.family}";font-style:normal;font-weight:${face.weight};font-display:block;src:url(${data}) format("woff2")}`
    }),
  )
  inject(rules.join('\n'), font.id)
}

const embedGoogle = async (font: FontDef) => {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${font.googleSpec}&display=block`

  const css = await fetch(cssUrl).then((r) => {
    if (!r.ok) throw new Error(`google css failed: ${r.status}`)
    return r.text()
  })

  const urls = [...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map((m) => m[1])
  const unique = [...new Set(urls)]
  const map = new Map<string, string>()
  await Promise.all(
    unique.map(async (u) => {
      try {
        map.set(u, await toDataUrl(u))
      } catch {
      }
    }),
  )
  const inlined = css.replace(/url\((https:\/\/[^)]+)\)/g, (whole, u) =>
    map.has(u) ? `url(${map.get(u)})` : whole,
  )
  inject(inlined, font.id)
}

export function loadFont(id: string): Promise<void> {
  const font = FONT_BY_ID.get(id)
  if (!font) return Promise.resolve()
  let p = loaded.get(id)
  if (!p) {
    p = (font.source === 'local' ? embedLocal(font) : embedGoogle(font))
      .then(() => document.fonts.load(`400 16px "${font.family}"`))
      .then(() => document.fonts.load(`700 16px "${font.family}"`))
      .then(() => undefined)
      .catch((err) => {
        console.warn('[daftar] font load failed', id, err)
        loaded.delete(id)
      })
    loaded.set(id, p)
  }
  return p
}

export const loadChromeFonts = () =>
  Promise.all([...CHROME_FONTS.map((f) => loadFont(f.id)), loadFont('vazir')])

export function embeddedFontCss(): string {
  return [...document.querySelectorAll<HTMLStyleElement>('style[data-font]')]
    .map((el) => el.textContent ?? '')
    .join('\n')
}

export const fontStack = (id: string) => {
  const font = FONT_BY_ID.get(id)
  return font ? `"${font.family}", "Vazirmatn", Tahoma, sans-serif` : 'Tahoma, sans-serif'
}
