import { forwardRef } from 'react'
import { FORMAT_BY_ID } from '../lib/formats'
import { THEME_BY_ID } from '../lib/themes'
import { fontStack, FONT_BY_ID } from '../lib/fonts'
import { pairBeits, parseStanzas, toFa, type PoemState } from '../lib/poem'
import { BeitMark, Corner, Divider, Shamse } from './Ornaments'
import { DECOR_BY_ID, decorUrl, type Decor } from '../lib/decor'
import { BRAND } from '../lib/brand'

const FOX_SPOTS: [number, number, number, number][] = [
  [8, 12, 9, 0.16], [91, 7, 7, 0.12], [15, 88, 11, 0.18], [86, 82, 8, 0.14],
  [50, 4, 6, 0.1], [4, 50, 7, 0.12], [96, 45, 6, 0.1], [62, 94, 9, 0.13],
  [28, 30, 5, 0.08], [72, 22, 4, 0.07], [40, 70, 6, 0.09], [78, 60, 5, 0.08],
  [22, 58, 4, 0.06], [58, 42, 3, 0.05],
]

const PoemPage = forwardRef<HTMLDivElement, { state: PoemState }>(function PoemPage(
  { state },
  ref,
) {
  const format = FORMAT_BY_ID.get(state.formatId)!
  const theme = THEME_BY_ID.get(state.themeId)!
  const font = FONT_BY_ID.get(state.fontId)

  const k = format.w / 1080
  const px = (n: number) => n * k

  const body = px(state.fontSize) * (font?.sizeAdjust ?? 1)
  const leading = state.lineHeight * (font?.lineHeightAdjust ?? 1)
  const pad = px(state.padding)
  const stanzas = parseStanzas(state.text)
  const num = (n: number) => (state.persianDigits ? toFa(n) : String(n))

  const wide = format.w / format.h > 1.2
  const decor = DECOR_BY_ID.get(state.ornament)

  const decorNode = (d: Decor, width: number) => {
    const height = (width * d.h) / d.w
    const url = decorUrl(d)
    if (d.kind === 'color') {
      return (
        <img
          src={url}
          alt=""
          draggable={false}
          style={{ width, height, display: 'block', opacity: d.opacity ?? 1 }}
        />
      )
    }
    const mask = `url(${url}) center / contain no-repeat`
    return (
      <div
        aria-hidden
        style={{
          width,
          height,
          backgroundColor: theme.ink,
          opacity: d.opacity ?? 1,
          WebkitMaskImage: `url(${url})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          mask,
        }}
      />
    )
  }

  const tint = theme.dark ? '255,220,160' : '110,70,25'
  const foxSpots = FOX_SPOTS.map(
    ([x, y, r, a]) => `radial-gradient(circle at ${x}% ${y}%, rgba(${tint},${a}) 0, rgba(${tint},${a * 0.5}) ${r * 0.5}%, transparent ${r}%)`,
  ).join(', ')
  const fiberLine = theme.dark ? 'rgba(255,240,210,.09)' : 'rgba(90,60,30,.10)'
  const fibersImage = `repeating-linear-gradient(94deg, transparent 0 ${px(11)}px, ${fiberLine} ${px(11)}px ${px(12)}px), repeating-linear-gradient(-86deg, transparent 0 ${px(23)}px, ${fiberLine} ${px(23)}px ${px(24)}px)`
  const creaseShadow = theme.dark ? 'rgba(0,0,0,.42)' : 'rgba(80,50,20,.16)'
  const creaseLight = theme.dark ? 'rgba(255,240,210,.06)' : 'rgba(255,255,255,.5)'

  const verseStyle: React.CSSProperties = {
    fontFamily: fontStack(state.fontId),
    fontSize: body,
    lineHeight: leading,
    letterSpacing: px(state.letterSpacing),
    color: theme.ink,
  }

  return (
    <div
      ref={ref}
      dir="rtl"
      lang="fa"
      style={{
        width: format.w,
        height: format.h,
        position: 'relative',
        overflow: 'hidden',
        background: theme.bg,

        isolation: 'isolate',
        fontFamily: fontStack(state.fontId),
      }}
    >
      {state.bgImage && (
        <img
          src={state.bgImage}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: state.bgOpacity / 100,
            pointerEvents: 'none',
          }}
        />
      )}

      {theme.grain && state.grain > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: theme.grain,
            backgroundSize: `${px(260)}px ${px(260)}px`,
            opacity: state.grain / 100,
            pointerEvents: 'none',
          }}
        />

      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: theme.dark
            ? `radial-gradient(120% 85% at 50% 40%, transparent 45%, rgba(0,0,0,.75) 100%)`
            : `radial-gradient(120% 85% at 50% 40%, transparent 50%, rgba(90,60,30,.19) 100%)`,
          opacity: state.vignette / 100,
          pointerEvents: 'none',
        }}
      />

      {state.fibers > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: fibersImage,
            opacity: (state.fibers / 100) * 0.6,
            pointerEvents: 'none',
          }}
        />
      )}

      {state.foxing > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: foxSpots,
            opacity: state.foxing / 100,
            pointerEvents: 'none',
          }}
        />
      )}

      {state.crease && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent 0 calc(50% - ${px(14)}px), ${creaseShadow} 50%, ${creaseLight} calc(50% + ${px(1.5)}px), transparent calc(50% + ${px(14)}px) 100%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {state.ornament === 'frame' && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: pad * 0.52,
              border: `${Math.max(1, px(1.6))}px solid ${theme.frame}`,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: pad * 0.52 + px(9),
              border: `${Math.max(1, px(0.8))}px solid ${theme.frame}`,
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          />

        </>

      )}

      {state.ornament === 'corners' &&
        ([
          { top: pad * 0.45, right: pad * 0.45, rotate: 90 },
          { top: pad * 0.45, left: pad * 0.45, rotate: 0 },
          { bottom: pad * 0.45, right: pad * 0.45, rotate: 180 },
          { bottom: pad * 0.45, left: pad * 0.45, rotate: 270 },
        ] as const).map((pos, i) => {
          const { rotate, ...offset } = pos
          return (
            <div
              key={i}
              style={{ position: 'absolute', ...offset, transform: `rotate(${rotate}deg)`, pointerEvents: 'none' }}
            >
              <Corner color={theme.accent} gold={theme.gold} size={px(96)} />

            </div>

          )
        })}

      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: pad,
          paddingInline: pad,
          paddingBottom: pad + (state.showPageNumber || state.watermark ? px(38) : 0),
          textAlign: 'center',
          gap: px(10),
        }}
      >
        {state.ornament === 'shamse' && (
          <div style={{ marginBottom: px(18) }}>
            <Shamse color={theme.accent} gold={theme.gold} size={px(110)} />

          </div>

        )}

        {decor?.place === 'crown' && (
          <div style={{ marginBottom: px(16), display: 'flex', justifyContent: 'center' }}>
            {decorNode(decor, px(decor.width))}
          </div>
        )}

        {(state.title || state.poet) && (
          <header style={{ marginBottom: px(state.ornament === 'rule' ? 14 : 34) }}>
            {state.title && (
              <h1
                style={{
                  fontFamily: fontStack(state.fontId),
                  fontSize: body * 0.68,
                  lineHeight: 1.6,
                  color: theme.accent,
                  fontWeight: 400,
                  letterSpacing: px(2),
                  margin: 0,
                }}
              >
                {state.title}
              </h1>

            )}
          </header>

        )}

        {state.ornament === 'rule' && (
          <div style={{ marginBottom: px(38), marginTop: px(4) }}>
            <Divider color={theme.accent} gold={theme.gold} width={px(220)} />

          </div>

        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: body * leading * state.beitGap,
            width: '100%',
            maxWidth: wide ? '82%' : '100%',
          }}
        >
          {stanzas.map((stanza, si) => (
            <div
              key={si}
              style={{ display: 'flex', flexDirection: 'column', gap: body * leading * state.beitGap * 0.3 }}
            >
              {state.layout === 'beit'
                ? pairBeits(stanza.lines).map((beit, bi) => (
                    <div
                      key={bi}
                      style={{
                        ...verseStyle,
                        display: 'grid',
                        gridTemplateColumns: beit[1] ? '1fr auto 1fr' : '1fr',
                        alignItems: 'center',
                        columnGap: px(28),
                      }}
                    >
                      <span style={{ textAlign: 'center' }}>{beit[0]}</span>

                      {beit[1] && <BeitMark color={theme.accent} size={body * 0.42} />}

                      {beit[1] && <span style={{ textAlign: 'center' }}>{beit[1]}</span>}

                    </div>

                  ))
                : stanza.lines.map((line, li) => (
                    <p
                      key={li}
                      style={{
                        ...verseStyle,
                        margin: 0,
                        textAlign: state.layout === 'free' ? 'start' : state.align,
                        textAlignLast: state.align === 'justify' ? 'center' : undefined,
                      }}
                    >
                      {line}
                    </p>

                  ))}
            </div>

          ))}
        </div>

        {(state.poet || state.source) && (
          <footer
            style={{
              marginTop: px(60),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: px(6),
            }}
          >
            <Divider color={theme.accent} gold={theme.gold} width={px(150)} />

            {state.poet && (
              <div
                style={{
                  fontFamily: fontStack(state.fontId),
                  fontSize: body * 0.5,
                  color: theme.ink,
                  opacity: 0.9,
                  letterSpacing: px(1),
                  marginTop: px(8),
                }}
              >
                {state.poet}
              </div>

            )}
            {state.source && (
              <div
                style={{
                  fontFamily: fontStack(state.fontId),
                  fontSize: body * 0.38,
                  color: theme.muted,
                  letterSpacing: px(1.5),
                }}
              >
                {state.source}
              </div>

            )}
          </footer>

        )}
      </div>

      {decor?.place === 'corner' && (
        <div
          style={{
            position: 'absolute',
            bottom: pad * 0.38,
            left: pad * 0.42,
            pointerEvents: 'none',
          }}
        >
          {decorNode(decor, px(decor.width))}
        </div>
      )}

      {state.watermark && (
        <div
          style={{
            position: 'absolute',

            bottom: state.ornament === 'corners' ? pad * 0.45 + px(104) : pad * 0.4,
            right: state.ornament === 'frame' ? pad * 0.52 + px(16) : pad * 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: px(7),
            direction: 'ltr',
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 24 24" width={px(15)} height={px(15)} fill="none" aria-hidden>
            <path
              d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z"
              stroke={theme.muted}
              strokeWidth="1.5"
            />
            <path
              d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z"
              stroke={theme.muted}
              strokeWidth="1.5"
            />
          </svg>

          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: px(16),
              letterSpacing: px(0.6),
              color: theme.muted,
              opacity: 0.85,
            }}
          >
            {BRAND.mark}
          </span>

        </div>

      )}

      {state.showPageNumber && (
        <div
          style={{
            position: 'absolute',
            bottom: pad * 0.42,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: fontStack(state.fontId),
            fontSize: px(22),
            color: theme.muted,
            letterSpacing: px(3),
          }}
        >
          {num(state.pageNumber)}
        </div>

      )}
    </div>

  )
})

export default PoemPage
