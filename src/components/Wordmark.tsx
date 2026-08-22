import { BRAND } from '../lib/brand'
import { toFa } from '../lib/poem'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

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

export function Mark({ className }: { className?: string }) {
  return (
    <img
      src={asset('brand/daftar-mark-128.png')}
      srcSet={`${asset('brand/daftar-mark-128.png')} 128w, ${asset('brand/daftar-mark-256.png')} 256w, ${asset('brand/daftar-mark.png')} 1024w`}
      sizes="36px"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`shrink-0 select-none object-contain ${className ?? ''}`}
    />

  )
}

export function Wordmark({ className, full = false }: { className?: string; full?: boolean }) {
  const file = full ? 'daftar-logo' : 'daftar-wordmark'
  return (
    <span
      role="img"
      aria-label={BRAND.logoAlt}
      className={`inline-flex shrink-0 items-center ${className ?? ''}`}
    >
      <img
        src={asset(`brand/${file}.png`)}
        alt=""
        draggable={false}
        className="h-full w-auto select-none object-contain dark:hidden"
      />

      <img
        src={asset(`brand/${file}-light.png`)}
        alt=""
        draggable={false}
        className="hidden h-full w-auto select-none object-contain dark:block"
      />

    </span>

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
