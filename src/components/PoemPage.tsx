import { forwardRef } from 'react'
import { FORMAT_BY_ID } from '../lib/formats'
import { THEME_BY_ID } from '../lib/themes'
import { fontStack, FONT_BY_ID } from '../lib/fonts'
import { pairBeits, parseStanzas, toFa, type PoemState } from '../lib/poem'
import { BeitMark, Corner, Divider, Shamse } from './Ornaments'
import { BRAND } from '../lib/brand'

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
      {theme.grain && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: theme.grain,
            backgroundSize: `${px(260)}px ${px(260)}px`,
            pointerEvents: 'none',
          }}
        />

      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: theme.dark
            ? `radial-gradient(120% 85% at 50% 40%, transparent 45%, rgba(0,0,0,.45) 100%)`
            : `radial-gradient(120% 85% at 50% 40%, transparent 50%, rgba(90,60,30,.11) 100%)`,
          pointerEvents: 'none',
        }}
      />

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
