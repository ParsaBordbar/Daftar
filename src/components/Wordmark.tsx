import { BRAND } from '../lib/brand'
import { toFa } from '../lib/poem'

export function Ltr({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span dir="ltr" className={`inline-block [unicode-bidi:isolate] ${className ?? ''}`} {...rest}>
      {children}
    </span>

  )
}

export function Dim({ w, h }: { w: number; h: number }) {
  return (
    <Ltr className="tabular-nums">
      {toFa(w)}×{toFa(h)}
    </Ltr>

  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <Ltr className={`font-mark whitespace-nowrap ${className ?? ''}`}>
      The <em className="text-tan not-italic italic">Booklet</em>

    </Ltr>

  )
}

export function SoonTag({ className }: { className?: string }) {
  if (!BRAND.comingSoon) return null
  return (
    <span
      className={`inline-flex items-center rounded-full border border-shangarf/35 bg-shangarf/10 px-2 py-[3px] text-[9.5px] leading-none tracking-[0.1em] text-shangarf ${className ?? ''}`}
    >
      {BRAND.faSoon}
    </span>

  )
}
