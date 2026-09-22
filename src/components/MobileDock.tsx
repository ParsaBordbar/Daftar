import { useEffect, useRef, type ReactNode } from 'react'

export interface DockItem {
  id: string
  title: string
  icon: ReactNode
}

export default function MobileDock({
  items,
  active,
  onPick,
}: {
  items: DockItem[]
  active: string | null
  onPick: (id: string) => void
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const root = document.documentElement
    const set = () => root.style.setProperty('--dock-h', `${el.offsetHeight}px`)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => {
      ro.disconnect()
      root.style.removeProperty('--dock-h')
    }
  }, [])

  return (
    <nav
      ref={ref}
      aria-label="تنظیمات"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-line/60 bg-paper/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden dark:border-night-line dark:bg-night/92"
    >
      <div className="flex px-0.5">
        {items.map((it) => {
          const on = it.id === active
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => onPick(it.id)}
              aria-pressed={on}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 px-0.5 pt-1.5 pb-1 text-[10px] transition-colors active:opacity-60 [--icon-line:#513423] dark:[--icon-line:#e0c98a] ${
                on ? 'text-tan [--icon-line:#9f6b53]' : 'text-ink-2 dark:text-night-ink-2'
              }`}
            >
              <span
                className={`grid h-7 w-10 place-items-center rounded-lg transition-colors ${on ? 'bg-tan/15' : ''}`}
              >
                {it.icon}
              </span>
              <span className="max-w-full truncate">{it.title}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
