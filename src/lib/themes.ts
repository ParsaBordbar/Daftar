export interface Theme {
  id: string
  label: string

  bg: string

  grain?: string
  ink: string

  muted: string

  accent: string

  gold: string

  frame: string
  dark?: boolean
}

export const THEMES: Theme[] = [
  {
    id: 'kaghaz',
    label: 'کاغذ کهنه',
    bg: 'radial-gradient(120% 90% at 50% 0%, #fdfaf3 0%, #f6efe1 55%, #ece0cb 100%)',
    grain:
      'radial-gradient(circle at 18% 22%, rgba(150,110,60,.055) 0 2px, transparent 3px), radial-gradient(circle at 74% 61%, rgba(150,110,60,.045) 0 2px, transparent 3px), radial-gradient(circle at 41% 84%, rgba(150,110,60,.05) 0 2px, transparent 3px)',
    ink: '#3a2a18',
    muted: '#907457',
    accent: '#b07d62',
    gold: '#c9a227',
    frame: 'rgba(100,70,40,0.28)',
  },
  {
    id: 'shab',
    label: 'شب',
    bg: 'radial-gradient(130% 100% at 50% 0%, #1b2436 0%, #131a28 60%, #0c111b 100%)',
    grain:
      'radial-gradient(circle at 30% 18%, rgba(220,190,120,.05) 0 1.5px, transparent 2.5px), radial-gradient(circle at 68% 72%, rgba(220,190,120,.045) 0 1.5px, transparent 2.5px)',
    ink: '#eee3cd',
    muted: '#94a2bb',
    accent: '#d8b45f',
    gold: '#e5c76b',
    frame: 'rgba(216,180,95,0.32)',
    dark: true,
  },
  {
    id: 'lajevard',
    label: 'لاجورد',
    bg: 'linear-gradient(165deg, #16305e 0%, #1d3c72 45%, #10254a 100%)',
    grain:
      'radial-gradient(circle at 22% 30%, rgba(255,215,120,.06) 0 2px, transparent 3px), radial-gradient(circle at 78% 66%, rgba(255,215,120,.05) 0 2px, transparent 3px)',
    ink: '#f6efdc',
    muted: '#a9bfe0',
    accent: '#e8c979',
    gold: '#f2d98b',
    frame: 'rgba(242,217,139,0.42)',
    dark: true,
  },
  {
    id: 'firooze',
    label: 'فیروزه',
    bg: 'linear-gradient(160deg, #eefaf8 0%, #d9f0ec 50%, #bfe3dd 100%)',
    ink: '#0f3f3a',
    muted: '#4b7d76',
    accent: '#1f7a70',
    gold: '#c08a3e',
    frame: 'rgba(31,122,112,0.3)',
  },
  {
    id: 'zaferan',
    label: 'زعفران',
    bg: 'linear-gradient(160deg, #fff8e9 0%, #fdeecb 52%, #f6ddab 100%)',
    ink: '#4a3212',
    muted: '#96733a',
    accent: '#c4761a',
    gold: '#a9822c',
    frame: 'rgba(164,120,40,0.32)',
  },
  {
    id: 'sepid',
    label: 'سپید',
    bg: '#ffffff',
    ink: '#16181d',
    muted: '#787c86',
    accent: '#2f3238',
    gold: '#9aa0aa',
    frame: 'rgba(20,22,28,0.16)',
  },
  {
    id: 'anar',
    label: 'انار',
    bg: 'linear-gradient(160deg, #fdf1f0 0%, #f7dedb 55%, #eec6c1 100%)',
    ink: '#4a1620',
    muted: '#9a5f63',
    accent: '#a52a3a',
    gold: '#c08a3e',
    frame: 'rgba(165,42,58,0.28)',
  },
  {
    id: 'zoghal',
    label: 'زغال',
    bg: 'linear-gradient(160deg, #1c1c1e 0%, #141416 60%, #0d0d0f 100%)',
    ink: '#ece9e4',
    muted: '#8b8880',
    accent: '#c8c2b6',
    gold: '#b8ab8d',
    frame: 'rgba(236,233,228,0.2)',
    dark: true,
  },
  {
    id: 'takht-jamshid',
    label: 'تخت جمشید',
    bg: 'radial-gradient(120% 95% at 50% 0%, #e9dfcc 0%, #d9cbb1 55%, #c4b090 100%)',
    grain:
      'radial-gradient(circle at 20% 26%, rgba(90,66,40,.07) 0 2px, transparent 3px), radial-gradient(circle at 70% 58%, rgba(90,66,40,.06) 0 2px, transparent 3px), radial-gradient(circle at 46% 86%, rgba(90,66,40,.065) 0 2px, transparent 3px)',
    ink: '#3b2a1a',
    muted: '#836a4c',
    accent: '#8a5a2b',
    gold: '#b8912f',
    frame: 'rgba(110,78,42,0.34)',
  },
  {
    id: 'shush',
    label: 'شوش',
    bg: 'linear-gradient(165deg, #123f6b 0%, #0f4f74 45%, #0b2f52 100%)',
    grain:
      'radial-gradient(circle at 24% 28%, rgba(232,185,80,.07) 0 2px, transparent 3px), radial-gradient(circle at 76% 64%, rgba(80,200,190,.06) 0 2px, transparent 3px)',
    ink: '#f3e7c8',
    muted: '#8fb9c9',
    accent: '#e0a83a',
    gold: '#f0c85c',
    frame: 'rgba(240,200,92,0.42)',
    dark: true,
  },
  {
    id: 'arghavan',
    label: 'ارغوان شاهی',
    bg: 'linear-gradient(160deg, #3d1a3f 0%, #2c1230 55%, #1b0a1f 100%)',
    grain:
      'radial-gradient(circle at 30% 22%, rgba(230,190,110,.06) 0 1.5px, transparent 2.5px), radial-gradient(circle at 70% 74%, rgba(230,190,110,.05) 0 1.5px, transparent 2.5px)',
    ink: '#f2e4cf',
    muted: '#b596b3',
    accent: '#d9a441',
    gold: '#e8c56a',
    frame: 'rgba(232,197,106,0.38)',
    dark: true,
  },
  {
    id: 'zar',
    label: 'زر هخامنشی',
    bg: 'linear-gradient(160deg, #f4e4b6 0%, #e6c97e 50%, #cfa650 100%)',
    grain:
      'radial-gradient(circle at 18% 24%, rgba(120,80,20,.07) 0 2px, transparent 3px), radial-gradient(circle at 72% 62%, rgba(120,80,20,.06) 0 2px, transparent 3px)',
    ink: '#4a2e0e',
    muted: '#8c6a2a',
    accent: '#8a4a1c',
    gold: '#a8741a',
    frame: 'rgba(138,74,28,0.36)',
  },
]

export const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]))
export const DEFAULT_THEME = 'kaghaz'
