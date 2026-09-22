import type { ReactNode } from 'react'

const panel = 'anim-rise jadval rounded-2xl bg-paper dark:bg-night-2'

export function Section({
  title,
  hint,
  icon,
  delay = 0,
  open = true,
  onToggle,
  children,
}: {
  title: string
  hint?: ReactNode

  icon?: ReactNode

  delay?: number

  open?: boolean
  onToggle?: () => void
  children: ReactNode
}) {
  const collapsible = !!onToggle
  const head = (
    <>
      <h2 className="flex items-center gap-2 text-[13px] font-medium tracking-wide text-ink dark:text-night-ink">
        {icon ? (
          <span className="[--icon-line:#513423] dark:[--icon-line:#e0c98a]" aria-hidden>
            {icon}
          </span>
        ) : (
          <span className="h-[7px] w-[7px] rotate-45 rounded-[1px] bg-gold/70" aria-hidden />
        )}
        {title}
      </h2>

      <span className="flex items-center gap-2">
        {hint && (
          <span className="text-[11px] tabular-nums text-ink-2/70 dark:text-night-ink-2">
            {hint}
          </span>
        )}
        {collapsible && (
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={`text-ink-2/70 transition-transform duration-200 ease-page dark:text-night-ink-2 ${
              open ? '' : '-rotate-90'
            }`}
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        )}
      </span>
    </>
  )
  return (
    <section
      className={`${panel} ${open ? 'p-4' : 'px-4 py-3'}`}
      style={{ '--anim-delay': `${delay}ms` } as React.CSSProperties}
    >
      {collapsible ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className={`-mx-1 flex w-[calc(100%+0.5rem)] items-center justify-between gap-2 rounded-lg px-1 text-start transition-colors hover:bg-tan/5 ${
            open ? 'mb-3' : ''
          }`}
        >
          {head}
        </button>
      ) : (
        <div className="mb-3 flex items-center justify-between gap-2">{head}</div>
      )}

      {open && children}
    </section>

  )
}

export function Field({
  label,
  as: Tag = 'label',
  children,
}: {
  label: ReactNode
  as?: 'label' | 'div'
  children: ReactNode
}) {
  return (
    <Tag className="block">
      <span className="mb-1.5 block text-[11px] text-ink-2 dark:text-night-ink-2">{label}</span>

      {children}
    </Tag>

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
