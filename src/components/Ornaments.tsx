export function Divider({ color, gold, width = 220 }: { color: string; gold: string; width?: number }) {
  return (
    <svg viewBox="0 0 220 24" width={width} height={(width * 24) / 220} aria-hidden fill="none">
      <path d="M8 12h74" stroke={color} strokeWidth="1" strokeLinecap="round" opacity=".55" />
      <path d="M138 12h74" stroke={color} strokeWidth="1" strokeLinecap="round" opacity=".55" />
      <path
        d="M110 3.5c4.6 4.2 7.5 6.6 7.5 8.5s-2.9 4.3-7.5 8.5c-4.6-4.2-7.5-6.6-7.5-8.5s2.9-4.3 7.5-8.5Z"
        fill={gold}
        opacity=".85"
      />
      <circle cx="94" cy="12" r="2.4" fill={color} opacity=".6" />
      <circle cx="126" cy="12" r="2.4" fill={color} opacity=".6" />
    </svg>

  )
}

export function Corner({ color, gold, size = 96 }: { color: string; gold: string; size?: number }) {
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} aria-hidden fill="none">
      <path d="M4 44V12a8 8 0 0 1 8-8h32" stroke={color} strokeWidth="1.6" opacity=".7" />
      <path d="M12 40V20a8 8 0 0 1 8-8h20" stroke={gold} strokeWidth="1.2" opacity=".7" />
      <path
        d="M22 22c8 0 14 5 14 12 0-7 6-12 14-12-8 0-14-5-14-12 0 7-6 12-14 12Z"
        fill={gold}
        opacity=".55"
      />
    </svg>

  )
}

export function Shamse({ color, gold, size = 110 }: { color: string; gold: string; size?: number }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden fill="none">
      <g transform="translate(60 60)">
        {petals.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-38"
            rx="7"
            ry="16"
            fill={gold}
            opacity=".5"
            transform={`rotate(${deg})`}
          />

        ))}
        <circle r="26" stroke={color} strokeWidth="1.4" opacity=".6" />
        <circle r="19" stroke={gold} strokeWidth="1" opacity=".75" />
        <circle r="7" fill={color} opacity=".45" />
      </g>

    </svg>

  )
}

export function BeitMark({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="none">
      <path d="M12 4c2.6 2.6 4.2 4.2 4.2 8s-1.6 5.4-4.2 8c-2.6-2.6-4.2-4.2-4.2-8S9.4 6.6 12 4Z" fill={color} opacity=".45" />
    </svg>

  )
}
