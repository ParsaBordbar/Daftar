
const MOD = 'Ctrl'
const SHIFT = 'Shift'

export interface Shortcut {
  keys: string[]
  label: string
}

export const SHORTCUTS = {
  undo: { keys: [MOD, 'Z'], label: 'واگرد' },
  redo: { keys: [MOD, SHIFT, 'Z'], label: 'ازنو' },
  download: { keys: [MOD, 'S'], label: 'دانلود این صفحه' },
  downloadAll: { keys: [MOD, SHIFT, 'S'], label: 'دانلود همهٔ صفحه‌ها' },
  copy: { keys: [MOD, SHIFT, 'C'], label: 'کپی تصویر' },
  link: { keys: [MOD, SHIFT, 'L'], label: 'کپی پیوند' },
  ganjoor: { keys: [MOD, 'K'], label: 'گنجور' },
  newPage: { keys: [MOD, 'Enter'], label: 'صفحهٔ تازه' },
  duplicate: { keys: [MOD, 'D'], label: 'تکثیر صفحه' },
  next: { keys: ['Alt', '←'], label: 'صفحهٔ بعد' },
  prev: { keys: ['Alt', '→'], label: 'صفحهٔ قبل' },
  paste: { keys: [MOD, 'V'], label: 'چسباندن تصویر پس‌زمینه' },
} as const satisfies Record<string, Shortcut>

export type ShortcutId = keyof typeof SHORTCUTS

export const keysOf = (id: ShortcutId) => `\u2066${SHORTCUTS[id].keys.join('+')}\u2069`
