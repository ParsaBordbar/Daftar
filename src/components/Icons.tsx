import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const LOGO = {
  line: 'var(--icon-line, #513423)',
  gold: '#cba139',
  goldDeep: '#b38c37',
  red: '#a8402a',
  blue: '#2f4f51',
  cream: '#e4e1dd',
} as const

function Base({ size = 16, children, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={LOGO.line}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  )
}

export function TabletIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M6 3.5h12l1.5 2v13l-1.5 2H6l-1.5-2v-13z" fill={LOGO.gold} />
      <path d="M8 8h8M8 11.5h6M8 15h8" strokeWidth="1.3" />
      <circle cx="16.5" cy="15" r="1" fill={LOGO.red} stroke="none" />
    </Base>
  )
}

export function QuillIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M20 4c-6 0-11 4-13 9l-1 6 6-1c5-2 9-7 9-13z" fill={LOGO.gold} />
      <path d="M6 18l7-7M12 8.5l1.5 1.5M9.5 11.5l1.5 1.5" strokeWidth="1.2" />
      <path d="M6 18l1.2-1.2" stroke={LOGO.red} strokeWidth="2" />
      <circle cx="16" cy="8" r="1" fill={LOGO.blue} stroke="none" />
    </Base>
  )
}

export function BotehIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path
        d="M10.5 21C5.5 20.5 3.5 16 4 11.5 4.5 6.5 8.5 3 13 3c3.5 0 6.5 2 6.5 5 0 2-1.5 3.5-3 3.5-1.3 0-2-1-1.8-2-1.7.5-2.2 3.5-1.7 6 .5 3-.5 5.5-2.5 5.5z"
        fill={LOGO.gold}
      />
      <path
        d="M4.2 9.5l-1.1.1M3.9 13l-1.2-.1M4.8 16.5l-1.1.5M7 19.5l-.8.9M10 21.4l-.1 1.1"
        strokeWidth="1.1"
      />
      <circle cx="8.5" cy="13.5" r="1.9" fill={LOGO.red} stroke="none" />
      <circle cx="8.5" cy="13.5" r=".6" fill={LOGO.cream} stroke="none" />
      <circle cx="12" cy="7.5" r="1.2" fill={LOGO.blue} stroke="none" />
      <circle cx="7.5" cy="18" r="1" fill={LOGO.blue} stroke="none" />
      <circle cx="11" cy="17" r=".8" fill={LOGO.cream} stroke="none" />
    </Base>
  )
}

export function LotusIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 20c-2.5-2-4-5-4-8.5 0-3 1.5-5.5 4-8 2.5 2.5 4 5 4 8 0 3.5-1.5 6.5-4 8.5z" fill={LOGO.gold} />
      <path d="M12 20c-4 0-7.5-2.5-9-6 3 0 5.5 1 7 3" fill={LOGO.blue} />
      <path d="M12 20c4 0 7.5-2.5 9-6-3 0-5.5 1-7 3" fill={LOGO.blue} />
      <path d="M3 8c2 0 4 .8 5.5 2.5M21 8c-2 0-4 .8-5.5 2.5" strokeWidth="1.2" />
      <circle cx="12" cy="12.5" r="1.1" fill={LOGO.red} stroke="none" />
    </Base>
  )
}

export function ScrollIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M7 5h11a2.5 2.5 0 0 1 0 5H7z" fill={LOGO.gold} />
      <path d="M7 5a2.5 2.5 0 0 0 0 5" />
      <path d="M7 10v9h9.5a2.5 2.5 0 0 0 2.5-2.5V10" fill={LOGO.cream} />
      <path d="M7 19a2.5 2.5 0 0 1 0-5" />
      <path d="M10 13h5M10 16h4" strokeWidth="1.2" />
      <circle cx="18" cy="7.5" r=".9" fill={LOGO.red} stroke="none" />
    </Base>
  )
}

export function ColumnIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M5 4h14M7 4l1.5 2.5h7L17 4" fill={LOGO.blue} />
      <path d="M9.5 6.5v11h5v-11" fill={LOGO.gold} />
      <path d="M12 8v8" strokeWidth="1.1" opacity=".55" />
      <path d="M7 17.5h10M5.5 20h13" />
      <path d="M7 17.5h10v2.5H7z" fill={LOGO.red} stroke="none" opacity=".85" />
    </Base>
  )
}

export function KongrehIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M3 20V13h3v-3h3V7h6v3h3v3h3v7z" fill={LOGO.gold} />
      <path d="M3 20h18" />
      <path d="M9 10h6v10H9z" fill={LOGO.red} stroke="none" opacity=".8" />
      <path d="M12 12v8" stroke={LOGO.cream} strokeWidth="1" opacity=".8" />
      <circle cx="12" cy="9" r=".9" fill={LOGO.blue} stroke="none" />
    </Base>
  )
}

export function CuneiformIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M5 5l3 2.5L5 10z" fill={LOGO.red} stroke="none" />
      <path d="M8 7.5h12" />
      <path d="M5 14l3 2.5L5 19z" fill={LOGO.blue} stroke="none" />
      <path d="M8 16.5h9" />
      <path d="M14 9.5l2.5 3L14 15.5z" fill={LOGO.gold} />
    </Base>
  )
}

export function WingIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M9.5 11C7 9.5 4.5 9 2 9.5c1 2.5 3 4 5.5 4.5z" fill={LOGO.gold} />
      <path d="M14.5 11c2.5-1.5 5-2 7.5-1.5-1 2.5-3 4-5.5 4.5z" fill={LOGO.gold} />
      <path d="M3.5 12.5c1.5 1.5 3 2 4.5 2M20.5 12.5c-1.5 1.5-3 2-4.5 2" strokeWidth="1.2" />
      <circle cx="12" cy="11" r="2.6" fill={LOGO.red} />
      <circle cx="12" cy="11" r=".9" fill={LOGO.cream} stroke="none" />
      <path d="M12 13.5v5M10.5 17l1.5 1.5 1.5-1.5" stroke={LOGO.blue} strokeWidth="1.3" />
    </Base>
  )
}

export function BackIcon(p: IconProps) {
  return (
    <Base {...p} strokeWidth="1.7">
      <path d="M10 6l6 6-6 6" />
      <path d="M16 12H5" />
    </Base>
  )
}

export function PlusIcon(p: IconProps) {
  return (
    <Base {...p} strokeWidth="1.7">
      <path d="M12 5v14M5 12h14" />
    </Base>
  )
}

export function DuplicateIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M9 8h9a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 18 21H9a1.5 1.5 0 0 1-1.5-1.5v-10A1.5 1.5 0 0 1 9 8z" fill={LOGO.gold} />
      <path d="M6 15.5H5A1.5 1.5 0 0 1 3.5 14V4.5A1.5 1.5 0 0 1 5 3h9a1.5 1.5 0 0 1 1.5 1.5v1" fill={LOGO.cream} />
      <path d="M11 13h5M11 16h3.5" strokeWidth="1.2" />
    </Base>
  )
}

export function TrashIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M5 7h14M9 7V5h6v2" />
      <path d="M7 7l1 13h8l1-13z" fill={LOGO.cream} />
      <path d="M10.5 10.5v6M13.5 10.5v6" stroke={LOGO.red} strokeWidth="1.3" />
    </Base>
  )
}

export function ChevronRightIcon(p: IconProps) {
  return (
    <Base {...p} strokeWidth="1.7">
      <path d="M10 6l6 6-6 6" />
    </Base>
  )
}

export function ChevronLeftIcon(p: IconProps) {
  return (
    <Base {...p} strokeWidth="1.7">
      <path d="M14 6l-6 6 6 6" />
    </Base>
  )
}

export function PagesIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M8 3.5h8l3 3v11H8z" fill={LOGO.gold} />
      <path d="M16 3.5v3h3" />
      <path d="M5 7.5v13h10" fill={LOGO.cream} />
      <path d="M11 10h5M11 13h4" strokeWidth="1.2" />
      <circle cx="17" cy="14.5" r=".9" fill={LOGO.red} stroke="none" />
    </Base>
  )
}

export function UndoIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M9 7 5 11l4 4" />
      <path d="M5 11h9a5 5 0 0 1 0 10h-3" />
    </Base>
  )
}

export function RedoIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="m15 7 4 4-4 4" />
      <path d="M19 11h-9a5 5 0 0 0 0 10h3" />
    </Base>
  )
}

export function DiceIcon(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="4" y="4" width="16" height="16" rx="3.5" fill={LOGO.gold} fillOpacity="0.35" />
      <circle cx="9" cy="9" r="1.2" fill={LOGO.line} stroke="none" />
      <circle cx="15" cy="9" r="1.2" fill={LOGO.red} stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill={LOGO.line} stroke="none" />
      <circle cx="9" cy="15" r="1.2" fill={LOGO.red} stroke="none" />
      <circle cx="15" cy="15" r="1.2" fill={LOGO.line} stroke="none" />
    </Base>
  )
}

export function ImageIcon(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" fill={LOGO.gold} stroke="none" />
      <path d="m4 17 5-5 3 3 3-4 5 6" fill={LOGO.blue} fillOpacity="0.35" />
    </Base>
  )
}

export function KeyboardIcon(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="3" y="7" width="18" height="11" rx="2.2" />
      <path d="M7 11h.01M11 11h.01M15 11h.01M17 11h.01M7 14h10" />
    </Base>
  )
}

export function ShareIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 3v12" />
      <path d="m8 7 4-4 4 4" />
      <path d="M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12" />
    </Base>
  )
}

export function DownloadIcon(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 3v12" />
      <path d="m8 11 4 4 4-4" />
      <path d="M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15" />
    </Base>
  )
}
