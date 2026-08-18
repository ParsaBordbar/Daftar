import { FORMATS, FORMAT_GROUPS, type Format } from '../lib/formats'
import { Dim } from './Wordmark'

function Swatch({ format, active }: { format: Format; active: boolean }) {
  const BOX = 40
  const ratio = format.w / format.h
  const w = ratio >= 1 ? BOX : BOX * ratio
  const h = ratio >= 1 ? BOX / ratio : BOX

  return (
    <span
      className="flex items-end justify-center"
      style={{ width: BOX, height: BOX }}
      aria-hidden
    >
      <span
        className={`block rounded-[2px] border transition-[width,height,background-color,border-color] duration-300 ease-page ${
          active
            ? 'border-tan bg-tan/25'
            : 'border-ink-2/40 bg-ink-2/8 group-hover:border-tan/60 dark:border-night-ink-2/50 dark:bg-night-ink-2/10'
        }`}
        style={{ width: w, height: h }}
      />

    </span>

  )
}

export default function FormatPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-3.5">
      {FORMAT_GROUPS.map((group) => (
        <div key={group}>
          <div className="mb-2 text-[10.5px] tracking-[0.14em] text-ink-2/70 dark:text-night-ink-2">
            {group}
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-3">
            {FORMATS.filter((f) => f.group === group).map((f) => {
              const active = f.id === value
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onChange(f.id)}
                  aria-pressed={active}
                  title={`${f.hint} — ${f.w}×${f.h}`}
                  className={`group flex flex-col items-center gap-1.5 rounded-xl border px-1.5 py-2.5 transition-[background-color,border-color,transform] duration-200 ease-page active:scale-[0.97] ${
                    active
                      ? 'border-tan bg-tan/12'
                      : 'border-line/60 hover:-translate-y-px hover:border-tan/60 hover:bg-tan/5 dark:border-night-line'
                  }`}
                >
                  <Swatch format={f} active={active} />

                  <span
                    className={`text-center text-[10.5px] leading-tight ${
                      active ? 'text-ink dark:text-night-ink' : 'text-ink-2 dark:text-night-ink-2'
                    }`}
                  >
                    {f.label}
                  </span>

                  <span className="text-[9px] tabular-nums text-ink-2/55 dark:text-night-ink-2/70">
                    <Dim w={f.w} h={f.h} />

                  </span>

                </button>

              )
            })}
          </div>

        </div>

      ))}
    </div>

  )
}
