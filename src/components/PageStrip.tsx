import { useEffect, useRef } from 'react'
import PoemPage from './PoemPage'
import { FORMAT_BY_ID } from '../lib/formats'
import { MAX_PAGES, type Doc } from '../lib/doc'
import { toFa } from '../lib/poem'
import { keysOf } from '../lib/shortcuts'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DuplicateIcon,
  PlusIcon,
  TrashIcon,
} from './Icons'

const THUMB_H = 76

export default function PageStrip({
  doc,
  onSelect,
  onAdd,
  onDuplicate,
  onRemove,
  onMove,
}: {
  doc: Doc
  onSelect: (i: number) => void
  onAdd: () => void
  onDuplicate: () => void
  onRemove: () => void
  onMove: (from: number, to: number) => void
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const format = FORMAT_BY_ID.get(doc.pages[0].formatId)!
  const scale = THUMB_H / format.h
  const thumbW = Math.round(format.w * scale)
  const count = doc.pages.length
  const full = count >= MAX_PAGES
  const single = count <= 1

  useEffect(() => {
    const rail = railRef.current
    const el = rail?.querySelector<HTMLElement>(`[data-page="${doc.active}"]`)
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }, [doc.active, count])

  return (
    <div className="anim-fade relative z-10 flex shrink-0 flex-col gap-1.5 border-t border-line/50 bg-paper/80 px-3 pt-2 pb-2.5 backdrop-blur-md dark:border-night-line dark:bg-night/80">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] tabular-nums text-ink-2 dark:text-night-ink-2">
          صفحهٔ {toFa(doc.active + 1)} از {toFa(count)}
        </span>

        <div className="flex items-center gap-0.5">
          <RailButton data-tip="جابه‌جایی به قبل" disabled={doc.active === 0} onClick={() => onMove(doc.active, doc.active - 1)}>
            <ChevronRightIcon />
          </RailButton>
          <RailButton data-tip="جابه‌جایی به بعد" disabled={doc.active === count - 1} onClick={() => onMove(doc.active, doc.active + 1)}>
            <ChevronLeftIcon />
          </RailButton>
          <span className="mx-1 h-4 w-px bg-line dark:bg-night-line" />
          <RailButton data-tip={`کپی صفحه · ${keysOf('duplicate')}`} disabled={full} onClick={onDuplicate}>
            <DuplicateIcon />
          </RailButton>
          <RailButton data-tip="حذف صفحه" disabled={single} onClick={onRemove}>
            <TrashIcon />
          </RailButton>
        </div>
      </div>

      <div ref={railRef} className="flex items-center gap-2 overflow-x-auto overflow-y-hidden py-1">
        {doc.pages.map((page, i) => {
          const active = i === doc.active
          return (
            <button
              key={i}
              type="button"
              data-page={i}
              onClick={() => onSelect(i)}
              title={page.title || `صفحهٔ ${toFa(i + 1)}`}
              className={`group relative shrink-0 overflow-hidden rounded-[3px] ring-1 transition-[transform,box-shadow] duration-200 ease-page ${
                active
                  ? 'shadow-[0_0_0_2px_var(--color-tan)] ring-tan'
                  : 'ring-black/10 hover:-translate-y-px hover:shadow-md dark:ring-white/10'
              }`}
              style={{ width: thumbW, height: THUMB_H }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute top-0 right-0"
                style={{
                  width: format.w,
                  height: format.h,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top right',
                }}
              >
                <PoemPage state={page} />
              </div>
              <span
                className={`absolute bottom-0.5 left-0.5 rounded px-1 text-[9.5px] tabular-nums leading-4 ${
                  active ? 'bg-tan text-white' : 'bg-black/45 text-white'
                }`}
              >
                {toFa(i + 1)}
              </span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={onAdd}
          disabled={full}
          data-tip={full ? `حداکثر ${toFa(MAX_PAGES)} صفحه` : `صفحهٔ تازه · ${keysOf('newPage')}`}
          className="tip flex shrink-0 flex-col items-center justify-center gap-1 rounded-[3px] border border-dashed border-line text-[10.5px] text-ink-2 transition hover:border-tan hover:bg-tan/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 dark:border-night-line dark:text-night-ink-2 dark:hover:text-night-ink"
          style={{ width: Math.max(thumbW, 44), height: THUMB_H }}
        >
          <PlusIcon className="[--icon-line:currentColor]" />
          صفحه
        </button>
      </div>
    </div>
  )
}

function RailButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="tip grid h-7 w-7 place-items-center rounded-lg text-ink-2 transition hover:bg-tan/10 hover:text-ink disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent [--icon-line:#513423] dark:text-night-ink-2 dark:[--icon-line:#e0c98a] dark:hover:text-night-ink"
    />
  )
}
