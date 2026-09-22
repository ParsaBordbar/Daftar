import { useEffect, useRef, useState, type ReactNode } from 'react'

const CLOSE_AT = 90

export default function Sheet({
  title,
  icon,
  hint,
  onClose,
  children,
}: {
  title: string
  icon?: ReactNode
  hint?: ReactNode
  onClose: () => void
  children: ReactNode
}) {
  const [dy, setDy] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startY = useRef<number | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
    setDy(0)
  }, [title])

  const onPointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (startY.current === null) return
    setDy(Math.max(0, e.clientY - startY.current))
  }
  const onPointerUp = () => {
    startY.current = null
    setDragging(false)
    if (dy > CLOSE_AT) onClose()
    else setDy(0)
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden" style={{ bottom: 'var(--dock-h, 0px)' }}>
      <div
        className="sheet-backdrop absolute inset-0 bg-ink/35 dark:bg-black/55"
        style={{ opacity: 1 - Math.min(1, dy / 300) }}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="sheet-panel absolute inset-x-0 bottom-0 flex max-h-[86dvh] flex-col rounded-t-[22px] bg-paper shadow-[0_-12px_40px_-10px_rgba(0,0,0,0.35)] dark:bg-night-2"
        style={{
          transform: `translateY(${dy}px)`,
          transition: dragging ? 'none' : 'transform 320ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <div
          className="shrink-0 cursor-grab touch-none select-none active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span className="mx-auto mt-2 block h-[5px] w-9 rounded-full bg-line dark:bg-night-line" />
          <header className="flex items-center justify-between gap-3 px-4 pt-2 pb-2.5">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink dark:text-night-ink">
              {icon && (
                <span className="[--icon-line:#513423] dark:[--icon-line:#e0c98a]" aria-hidden>
                  {icon}
                </span>
              )}
              {title}
              {hint && (
                <span className="text-[11px] font-normal tabular-nums text-ink-2/70 dark:text-night-ink-2">
                  {hint}
                </span>
              )}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="-me-2 rounded-lg px-2 py-1 text-[15px] font-semibold text-tan active:opacity-60"
            >
              تمام
            </button>
          </header>
        </div>
        <div
          ref={bodyRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
