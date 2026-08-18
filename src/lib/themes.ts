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
]

export const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]))
export const DEFAULT_THEME = 'kaghaz'
