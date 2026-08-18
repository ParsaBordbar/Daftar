import type { ReactNode } from 'react'

const panel = 'anim-rise jadval rounded-2xl bg-white/45 dark:bg-night-2/70'

export function Section({
  title,
  hint,
  delay = 0,
  children,
}: {
  title: string
  hint?: ReactNode
  /** ms of entrance stagger — panels cascade down the sidebar. */
  delay?: number
  children: ReactNode
}) {
  return (
    <section
      className={`${panel} p-4`}
      style={{ '--anim-delay': `${delay}ms` } as React.CSSProperties}
    >
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="flex items-baseline gap-2 text-[13px] font-medium tracking-wide text-ink dark:text-night-ink">
          <span className="h-[7px] w-[7px] rotate-45 rounded-[1px] bg-gold/70" aria-hidden />
          {title}
        </h2>

        {hint && (
          <span className="text-[11px] tabular-nums text-ink-2/70 dark:text-night-ink-2">
            {hint}
          </span>

        )}
      </div>

      {children}
    </section>

  )
}

export function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] text-ink-2 dark:text-night-ink-2">{label}</span>

      {children}
    </label>

  )
}

const controlBase =
  'w-full rounded-xl border border-line/70 bg-paper/70 px-3 py-2 text-[13px] text-ink outline-none transition focus:border-tan focus:ring-2 focus:ring-tan/25 dark:border-night-line dark:bg-night/60 dark:text-night-ink'

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlBase} ${props.className ?? ''}`} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${controlBase} resize-y leading-[2] ${props.className ?? ''}`}
    />

  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${controlBase} ${props.className ?? ''}`} />
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = String,
}: {
  label: ReactNode
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  format?: (v: number) => string
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between text-[11px] text-ink-2 dark:text-night-ink-2">
        <span>{label}</span>

        <span className="tabular-nums opacity-70">{format(value)}</span>

      </span>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </label>

  )
}

export function Chips<T extends string | number>({
  options,
  value,
  onChange,
  columns,
}: {
  options: { id: T; label: ReactNode; title?: string }[]
  value: T
  onChange: (v: T) => void
  columns?: number
}) {
  return (
    <div
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0,1fr))` }}
    >
      {options.map((o) => {
        const active = o.id === value
        return (
          <button
            key={String(o.id)}
            type="button"
            title={o.title}
            onClick={() => onChange(o.id)}
            className={`rounded-xl border px-2 py-2 text-[12px] transition-[background-color,border-color,color,transform] duration-200 ease-page active:scale-[0.97] ${
              active
                ? 'scale-[1.03] border-tan bg-tan/15 text-ink dark:text-night-ink'
                : 'border-line/60 text-ink-2 hover:-translate-y-px hover:border-tan/60 hover:bg-tan/5 dark:border-night-line dark:text-night-ink-2'
            }`}
          >
            {o.label}
          </button>

        )
      })}
    </div>

  )
}

export function Button({
  variant = 'ghost',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) {
  const styles =
    variant === 'primary'
      ? 'bg-ink text-paper hover:-translate-y-px hover:bg-ink/88 active:translate-y-0 active:scale-[0.98] dark:bg-night-ink dark:text-night'
      : 'border border-line/70 text-ink hover:-translate-y-px hover:border-tan hover:bg-tan/10 active:translate-y-0 active:scale-[0.98] dark:border-night-line dark:text-night-ink'
  return (
    <button
      {...props}
      className={`inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-[background-color,border-color,transform,box-shadow] duration-200 ease-page disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100 ${styles} ${props.className ?? ''}`}
    />

  )
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-line/60 px-3 py-2 text-[12px] text-ink-2 transition hover:border-tan/60 dark:border-night-line dark:text-night-ink-2"
    >
      <span>{label}</span>

      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-tan' : 'bg-line/60 dark:bg-night-line'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ease-page ${
            checked ? 'right-0.5' : 'right-4.5'
          }`}
        />

      </span>

    </button>

  )
}
