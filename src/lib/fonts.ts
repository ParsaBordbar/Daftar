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
    id: 'tanha',
    label: 'تنها',
    family: 'Tanha',
    style: 'sans',
    source: 'local',
    faces: [f('Tanha-Regular.woff2')],
    sizeAdjust: 0.97,
    lineHeightAdjust: 1.01,
    license: 'SIL OFL 1.1',
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
    id: 'hekayat',
    label: 'حکایت',
    family: 'MM Hekayat',
    style: 'display',
    source: 'local',
    faces: [f('MMHekayat-Regular.woff2')],
    sizeAdjust: 1.37,
    license: 'نامشخص — پیش از انتشار بررسی کنید',
  },
  {
    id: 'paeez',
    label: 'پاییز',
    family: 'Paeez',
    style: 'display',
    source: 'local',
    faces: [f('Paeez-Regular.woff2')],
    sizeAdjust: 1.64,
    lineHeightAdjust: 1.25,
    license: 'نامشخص — پیش از انتشار بررسی کنید',
  },
  {
    id: 'niloo',
    label: 'نیلو',
    family: 'Far Niloo',
    style: 'naskh',
    source: 'local',
    faces: [f('FarNiloo-Regular.woff2'), f('FarNiloo-Bold.woff2', 700)],
    sizeAdjust: 0.91,
    lineHeightAdjust: 0.95,
    license: 'نامشخص — پیش از انتشار بررسی کنید',
  },
  {
    id: 'ziba',
    label: 'زیبا',
    family: 'Far Ziba',
    style: 'naskh',
    source: 'local',
    faces: [f('FarZiba-Regular.woff2')],
    sizeAdjust: 1.31,
    lineHeightAdjust: 1.01,
    license: 'نامشخص — پیش از انتشار بررسی کنید',
  },
  {
    id: 'mahsa',
    label: 'مهسا',
    family: 'Far Mahsa',
    style: 'display',
    source: 'local',
    faces: [f('FarMahsa-Regular.woff2')],
    sizeAdjust: 1.27,
    lineHeightAdjust: 1.02,
    license: 'نامشخص — پیش از انتشار بررسی کنید',
  },
  {
    id: 'kamran',
    label: 'کامران',
    family: 'Far Kamran',
    style: 'display',
    source: 'local',
    faces: [f('FarKamran-Regular.woff2'), f('FarKamran-Bold.woff2', 700)],
    sizeAdjust: 1.47,
    lineHeightAdjust: 1.17,
    license: 'نامشخص — پیش از انتشار بررسی کنید',
  },
  {
    id: 'sade',
    label: 'ساده',
    family: 'A Sade',
    style: 'sans',
    source: 'local',
    faces: [f('ASade-Regular.woff2')],
    sizeAdjust: 1.41,
    lineHeightAdjust: 0.93,
    license: 'نامشخص — پیش از انتشار بررسی کنید',
  },
  {
    id: 'hilan',
    label: 'هیلان',
    family: 'Digi Hilan',
    style: 'display',
    source: 'local',
    faces: [f('DigiHilan-Bold.woff2', 700)],
    sizeAdjust: 1.29,
    lineHeightAdjust: 1.21,
    license: 'نامشخص — پیش از انتشار بررسی کنید',
  },
  {
    id: 'badkhat',
    label: 'بدخط',
    family: 'Badkhat',
    style: 'display',
    source: 'local',
    faces: [f('Badkhat-Regular.woff2')],
    sizeAdjust: 1.84,
    lineHeightAdjust: 1.05,
    license: 'نامشخص — پیش از انتشار بررسی کنید',
  },
  {
    id: 'parvaz',
    label: 'پرواز',
    family: 'W Parvaz',
    style: 'display',
    source: 'local',
    faces: [f('WParvaz-Regular.woff2')],
    sizeAdjust: 1.04,
    lineHeightAdjust: 1.05,
    license: 'نامشخص — پیش از انتشار بررسی کنید',
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
