
export interface Decor {
  id: string
  label: string

  file: string

  kind: 'ink' | 'color'

  w: number
  h: number

  place: 'crown' | 'corner'

  width: number

  opacity?: number
}

export const DECOR: Decor[] = [
  {
    id: 'sarsotun',
    label: 'سرستون',
    file: 'capital.webp',
    kind: 'ink',
    w: 1287,
    h: 855,
    place: 'crown',
    width: 300,
    opacity: 0.9,
  },
  {
    id: 'sham',
    label: 'شمع',
    file: 'candle.webp',
    kind: 'ink',
    w: 381,
    h: 1397,
    place: 'crown',
    width: 62,
    opacity: 0.9,
  },
  {
    id: 'boteh',
    label: 'بته‌جقه',
    file: 'boteh.webp',
    kind: 'color',
    w: 843,
    h: 1400,
    place: 'corner',
    width: 150,
    opacity: 0.95,
  },
  {
    id: 'javidan',
    label: 'سرباز جاویدان',
    file: 'immortal.webp',
    kind: 'ink',
    w: 1210,
    h: 1233,
    place: 'corner',
    width: 130,
    opacity: 0.9,
  },
  {
    id: 'naghsh-shah',
    label: 'نقش شاه',
    file: 'king-plate.webp',
    kind: 'ink',
    w: 1211,
    h: 1292,
    place: 'crown',
    width: 240,
    opacity: 0.85,
  },
  {
    id: 'faravahar',
    label: 'فروهر',
    file: 'faravahar.svg',
    kind: 'color',
    w: 530,
    h: 250,
    place: 'crown',
    width: 300,
    opacity: 0.95,
  },
  {
    id: 'sotun',
    label: 'ستون',
    file: 'column.webp',
    kind: 'ink',
    w: 385,
    h: 1307,
    place: 'corner',
    width: 70,
    opacity: 0.9,
  },
  {
    id: 'sarv',
    label: 'سرو',
    file: 'sarv.webp',
    kind: 'ink',
    w: 392,
    h: 1230,
    place: 'corner',
    width: 80,
    opacity: 0.9,
  },
  {
    id: 'shahin',
    label: 'شاهین',
    file: 'shahin.webp',
    kind: 'ink',
    w: 698,
    h: 586,
    place: 'crown',
    width: 200,
    opacity: 0.9,
  },
  {
    id: 'shirdal',
    label: 'شیردال',
    file: 'lamassu.webp',
    kind: 'ink',
    w: 648,
    h: 431,
    place: 'corner',
    width: 170,
    opacity: 0.9,
  },
  {
    id: 'darbar',
    label: 'دربار',
    file: 'darbar.webp',
    kind: 'ink',
    w: 263,
    h: 238,
    place: 'crown',
    width: 220,
    opacity: 0.9,
  },
  {
    id: 'iran',
    label: 'نقشهٔ ایران',
    file: 'iran-map.webp',
    kind: 'color',
    w: 604,
    h: 559,
    place: 'crown',
    width: 260,
    opacity: 0.95,
  },
  {
    id: 'iran-rangi',
    label: 'ایران رنگی',
    file: 'iran-map-color.webp',
    kind: 'color',
    w: 353,
    h: 317,
    place: 'crown',
    width: 230,
    opacity: 0.95,
  },
  {
    id: 'nilufar',
    label: 'نیلوفر',
    file: 'nilufar.webp',
    kind: 'ink',
    w: 215,
    h: 206,
    place: 'crown',
    width: 170,
    opacity: 0.9,
  },
  {
    id: 'kurosh',
    label: 'کوروش',
    file: 'kurosh.webp',
    kind: 'color',
    w: 974,
    h: 1354,
    place: 'corner',
    width: 190,
    opacity: 0.95,
  },
]

export const DECOR_BY_ID = new Map(DECOR.map((d) => [d.id, d]))

export const decorUrl = (d: Decor) => `${import.meta.env.BASE_URL}decor/${d.file}`
