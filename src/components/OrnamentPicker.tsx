import { DECOR, decorUrl, type Decor } from '../lib/decor'
import { ORNAMENT_LABELS, type BaseOrnament, type Ornament } from '../lib/poem'
import { Corner, Divider, Shamse } from './Ornaments'

const BASE: BaseOrnament[] = ['none', 'rule', 'frame', 'corners', 'shamse']

const INK = 'var(--icon-line, #513423)'
const GOLD = '#cba139'

function BasePreview({ id }: { id: BaseOrnament }) {
  const lines = (
    <g stroke={INK} strokeWidth="1.4" strokeLinecap="round" opacity=".45">
      <path d="M14 22h20M12 27h24M14 32h20" />
    </g>
  )
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden fill="none">
      {id === 'none' && lines}
      {id === 'rule' && (
        <>
          <path d="M14 18h20M14 34h20" stroke={INK} strokeWidth="1.4" strokeLinecap="round" opacity=".45" />
          <g transform="translate(9 20) scale(0.136)">
            <Divider color={INK} gold={GOLD} width={220} />
          </g>
        </>
      )}
      {id === 'frame' && (
        <>
          <rect x="7" y="7" width="34" height="34" stroke={INK} strokeWidth="1.3" opacity=".7" />
          <rect x="10.5" y="10.5" width="27" height="27" stroke={INK} strokeWidth=".8" opacity=".4" />
          {lines}
        </>
      )}
      {id === 'corners' && (
        <>
          {lines}
          {[0, 90, 180, 270].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 24 24) translate(5 5) scale(0.17)`}>
              <Corner color={INK} gold={GOLD} size={96} />
            </g>
          ))}
        </>
      )}
      {id === 'shamse' && (
        <>
          <g transform="translate(12 3) scale(0.2)">
            <Shamse color={INK} gold={GOLD} size={120} />
          </g>
          <path d="M14 33h20M16 39h16" stroke={INK} strokeWidth="1.4" strokeLinecap="round" opacity=".45" />
        </>
      )}
    </svg>
  )
}

function DecorPreview({ d }: { d: Decor }) {
  const url = decorUrl(d)
  if (d.kind === 'color') {
    return <img src={url} alt="" draggable={false} loading="lazy" className="h-full w-full object-contain" />
  }
  return (
    <div
      aria-hidden
      className="h-full w-full"
      style={{
        backgroundColor: INK,
        WebkitMaskImage: `url(${url})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskImage: `url(${url})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
    />
  )
}

export default function OrnamentPicker({
  value,
  onChange,
}: {
  value: Ornament
  onChange: (o: Ornament) => void
}) {
  const tile = (id: Ornament, hint: string, preview: React.ReactNode) => {
    const active = id === value
    return (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        aria-label={ORNAMENT_LABELS[id]}
        aria-pressed={active}
        data-tip={hint}
        className={`tip aspect-square rounded-xl border p-1.5 transition-[background-color,border-color,transform] duration-200 ease-page active:scale-[0.96] [--icon-line:#513423] dark:[--icon-line:#e0c98a] ${
          active
            ? 'scale-[1.04] border-tan bg-tan/15'
            : 'border-line/60 hover:-translate-y-px hover:border-tan/60 hover:bg-tan/5 dark:border-night-line'
        }`}
      >
        {preview}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-5 gap-1.5">
        {BASE.map((id) => tile(id, ORNAMENT_LABELS[id], <BasePreview id={id} />))}
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {DECOR.map((d) =>
          tile(d.id, `${d.label} · ${d.place === 'crown' ? 'بالای عنوان' : 'گوشهٔ صفحه'}`, <DecorPreview d={d} />),
        )}
      </div>
    </div>
  )
}
