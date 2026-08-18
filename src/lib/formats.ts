export interface Format {
  id: string
  label: string

  hint: string
  w: number
  h: number
  group: string
}

export const FORMATS: Format[] = [
  { id: 'ig-story', label: 'استوری', hint: 'Instagram / WhatsApp / Facebook · 9:16', w: 1080, h: 1920, group: 'شبکه‌های اجتماعی' },
  { id: 'ig-post', label: 'پست مربع', hint: 'Instagram / Telegram · 1:1', w: 1080, h: 1080, group: 'شبکه‌های اجتماعی' },
  { id: 'ig-portrait', label: 'پست عمودی', hint: 'Instagram · 4:5', w: 1080, h: 1350, group: 'شبکه‌های اجتماعی' },
  { id: 'pinterest', label: 'پینترست', hint: 'Pinterest · 2:3', w: 1000, h: 1500, group: 'شبکه‌های اجتماعی' },
  { id: 'pinterest-long', label: 'پینترست بلند', hint: 'Pinterest · 1:2.1', w: 1000, h: 2100, group: 'شبکه‌های اجتماعی' },
  { id: 'li-post', label: 'لینکدین', hint: 'LinkedIn feed · 1.91:1', w: 1200, h: 628, group: 'شبکه‌های اجتماعی' },
  { id: 'li-square', label: 'لینکدین مربع', hint: 'LinkedIn · 1:1', w: 1200, h: 1200, group: 'شبکه‌های اجتماعی' },
  { id: 'x-post', label: 'ایکس / توییتر', hint: 'X · 16:9', w: 1600, h: 900, group: 'شبکه‌های اجتماعی' },
  { id: 'tg-sticker', label: 'تلگرام', hint: 'Telegram photo · 4:5', w: 1280, h: 1600, group: 'شبکه‌های اجتماعی' },

  { id: 'a4', label: 'A4 چاپی', hint: '۳۰۰ نقطه بر اینچ · ۲۱×۲۹٫۷ سانتی‌متر', w: 1240, h: 1754, group: 'چاپ و نمایش' },
  { id: 'a5', label: 'A5 چاپی', hint: '۳۰۰ نقطه بر اینچ · ۱۴٫۸×۲۱ سانتی‌متر', w: 874, h: 1240, group: 'چاپ و نمایش' },
  { id: 'phone', label: 'پس‌زمینه موبایل', hint: '1440×3120', w: 1440, h: 3120, group: 'چاپ و نمایش' },
  { id: 'desktop', label: 'پس‌زمینه دسکتاپ', hint: '2560×1440', w: 2560, h: 1440, group: 'چاپ و نمایش' },
]

export const FORMAT_BY_ID = new Map(FORMATS.map((x) => [x.id, x]))
export const DEFAULT_FORMAT = 'ig-story'

export const FORMAT_GROUPS = [...new Set(FORMATS.map((x) => x.group))]

export const SCALES = [
  { id: 1, label: '۱×' },
  { id: 2, label: '۲×' },
  { id: 3, label: '۳×' },
] as const
