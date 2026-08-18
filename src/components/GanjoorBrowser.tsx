import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  coupletsToText,
  fetchCategory,
  fetchManifest,
  fetchPoem,
  looksLikeVerse,
  searchPoems,
  SEARCH_PAGE_SIZE,
  splitFullTitle,
  toCouplets,
  type CatRef,
  type Category,
  type Couplet,
  type Poem,
  type PoetRef,
  type SearchHit,
} from '../lib/ganjoor'
import { toFa, type Layout } from '../lib/poem'
import { Button, TextInput } from './ui'

export interface Insertion {
  text: string
  title: string
  poet: string
  source: string
  layout: Layout
}

interface Crumb {
  title: string
  fullUrl: string
}

const DEFAULT_COUPLETS = 4
const MIN_QUERY = 2
const SEARCH_DEBOUNCE = 350
/** Cap the entrance cascade so a long result list still finishes quickly. */
const stagger = (i: number) => ({ '--anim-delay': `${Math.min(i, 10) * 30}ms` }) as React.CSSProperties

/** Two lines around the first match, so a hit shows why it matched. */
function snippet(text: string, term: string) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const at = lines.findIndex((l) => l.includes(term))
  const start = at > 0 ? at : 0
  return lines.slice(start, start + 2).join(' ⁘ ')
}

function Highlight({ text, term }: { text: string; term: string }) {
  if (!term) return <>{text}</>
  const parts = text.split(term)
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <mark className="bg-gold/30 text-inherit">{term}</mark>}
        </span>
      ))}
    </>
  )
}

export default function GanjoorBrowser({
  onInsert,
  onClose,
}: {
  onInsert: (v: Insertion) => void
  onClose: () => void
}) {
  const [poets, setPoets] = useState<PoetRef[] | null>(null)
  const [poet, setPoet] = useState<PoetRef | null>(null)
  const [trail, setTrail] = useState<Crumb[]>([])
  const [cat, setCat] = useState<Category | null>(null)
  const [poem, setPoem] = useState<Poem | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [from, setFrom] = useState(0)
  const [count, setCount] = useState(DEFAULT_COUPLETS)
  const [hits, setHits] = useState<SearchHit[] | null>(null)
  const [hitTotal, setHitTotal] = useState(0)
  const [hitMore, setHitMore] = useState(false)
  const [hitPage, setHitPage] = useState(1)
  const [searching, setSearching] = useState(false)
  /** Set when the open poem was reached through search, not the category tree. */
  const [fromSearch, setFromSearch] = useState(false)
  const [hitTerm, setHitTerm] = useState('')

  useEffect(() => {
    fetchManifest()
      .then((m) => setPoets(m.Poets))
      .catch(() => setError('فهرست شاعران بارگیری نشد. اتصال اینترنت را بررسی کنید.'))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [onClose])

  const openCat = useCallback(async (ref: Crumb, poetRef: PoetRef, depth: number) => {
    setBusy(true)
    setError(null)
    setPoem(null)
    setFromSearch(false)
    setHits(null)
    setQ('')
    try {
      const c = await fetchCategory(ref.fullUrl)
      setPoet(poetRef)
      setCat(c)
      setTrail((t) => [...t.slice(0, depth), { title: ref.title, fullUrl: ref.fullUrl }])
    } catch {
      setError('این بخش بارگیری نشد.')
    } finally {
      setBusy(false)
    }
  }, [])

  const openPoem = useCallback(async (ref: CatRef) => {
    setBusy(true)
    setError(null)
    try {
      const p = await fetchPoem(ref.FullUrl)
      setPoem(p)
      setFromSearch(false)
      setFrom(0)
      setCount(DEFAULT_COUPLETS)
    } catch {
      setError('این شعر بارگیری نشد.')
    } finally {
      setBusy(false)
    }
  }, [])

  // Debounced full-text search, scoped to the current poet when inside one.
  useEffect(() => {
    const term = q.trim()
    if (poem) return
    if (term.length < MIN_QUERY) {
      setHits(null)
      setSearching(false)
      setHitPage(1)
      return
    }
    const ctrl = new AbortController()
    setSearching(true)
    const id = setTimeout(() => {
      searchPoems(term, { poetId: poet?.Id, signal: ctrl.signal })
        .then((r) => {
          setHits(r.hits)
          setHitTotal(r.total)
          setHitMore(r.hasMore)
          setHitTerm(term)
          setHitPage(1)
        })
        .catch(() => {
          if (!ctrl.signal.aborted) setHits([])
        })
        .finally(() => {
          if (!ctrl.signal.aborted) setSearching(false)
        })
    }, SEARCH_DEBOUNCE)
    return () => {
      clearTimeout(id)
      ctrl.abort()
    }
  }, [q, poet, poem])

  const openHit = useCallback(async (hit: SearchHit) => {
    setBusy(true)
    setError(null)
    try {
      const p = await fetchPoem(hit.fullUrl)
      setPoem(p)
      setFromSearch(true)
      setFrom(0)
      setCount(DEFAULT_COUPLETS)
    } catch {
      setError('این شعر بارگیری نشد.')
    } finally {
      setBusy(false)
    }
  }, [])

  const loadMore = async () => {
    if (!hits || searching) return
    setSearching(true)
    try {
      const r = await searchPoems(hitTerm, { poetId: poet?.Id, page: hitPage + 1 })
      setHits((h) => [...(h ?? []), ...r.hits])
      setHitMore(r.hasMore)
      setHitPage((n) => n + 1)
    } catch {
      setHitMore(false)
    } finally {
      setSearching(false)
    }
  }

  const couplets: Couplet[] = useMemo(() => (poem ? toCouplets(poem) : []), [poem])
  const slice = useMemo(
    () => couplets.slice(from, from + count),
    [couplets, from, count],
  )

  const filtered = useMemo(() => {
    const needle = q.trim()
    if (!poet) {
      const list = poets ?? []
      return needle ? list.filter((p) => p.Nickname.includes(needle)) : list
    }
    if (!cat) return []
    const cats = needle ? cat.ChildCats.filter((c) => c.Title.includes(needle)) : cat.ChildCats
    const poems = needle ? cat.Poems.filter((p) => p.Title.includes(needle)) : cat.Poems
    return [...cats.map((c) => ({ ...c, kind: 'cat' as const })), ...poems.map((p) => ({ ...p, kind: 'poem' as const }))]
  }, [q, poets, poet, cat])

  const reset = () => {
    setPoet(null)
    setCat(null)
    setTrail([])
    setPoem(null)
    setFromSearch(false)
    setHits(null)
    setQ('')
    setError(null)
  }

  const insert = () => {
    if (!poem) return
    const meta = splitFullTitle(poem.FullTitle)
    const trailSource = fromSearch ? '' : trail.map((t) => t.title).slice(1).join(' » ')
    onInsert({
      text: coupletsToText(slice),
      title: poem.Title,
      poet: poet?.Nickname || meta.poet,
      source: trailSource || meta.source || (cat?.BookName ?? ''),
      layout: looksLikeVerse(slice) ? 'single' : 'free',
    })
  }

  return (
    <div className="anim-fade fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="انتخاب شعر از گنجور"
        className="anim-sheet jadval flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-paper sm:max-h-[86dvh] sm:rounded-3xl dark:bg-night-2"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line/50 px-4 py-3 dark:border-night-line">
          <div className="min-w-0">
            <h2 className="text-[15px] font-medium">گنجور</h2>

            <p className="truncate text-[11px] text-ink-2 dark:text-night-ink-2">
              {poets
                ? `${toFa(poets.length)} شاعر · گنجینهٔ شعر پارسی`
                : 'در حال بارگیری…'}
            </p>

          </div>

          <Button onClick={onClose}>بستن</Button>

        </header>

        {(poet || fromSearch) && (
          <nav className="anim-fade flex shrink-0 flex-wrap items-center gap-1 border-b border-line/40 px-4 py-2 text-[11.5px] dark:border-night-line">
            <button onClick={reset} className="text-tan hover:underline">
              همهٔ شاعران
            </button>

            {fromSearch && (
              <span className="flex items-center gap-1">
                <span className="text-ink-2/50">»</span>

                <button
                  onClick={() => {
                    setPoem(null)
                    setFromSearch(false)
                  }}
                  className="text-tan hover:underline"
                >
                  نتایج «{hitTerm}»
                </button>

              </span>

            )}

            {poet &&
              trail.map((c, i) => (
              <span key={c.fullUrl} className="flex items-center gap-1">
                <span className="text-ink-2/50">»</span>

                <button
                  onClick={() => openCat(c, poet, i)}
                  disabled={i === trail.length - 1 && !poem}
                  className="text-ink-2 hover:text-tan hover:underline disabled:no-underline disabled:hover:text-ink-2 dark:text-night-ink-2"
                >
                  {c.title}
                </button>

              </span>

            ))}
            {poem && (
              <span className="flex items-center gap-1">
                <span className="text-ink-2/50">»</span>

                <span className="text-ink dark:text-night-ink">{poem.Title}</span>

              </span>

            )}
          </nav>

        )}

        {!poem && (
          <div className="shrink-0 px-4 pt-3">
            <TextInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={
                poet ? `جست‌وجو در آثار ${poet.Nickname}…` : 'نام شاعر یا مصرعی از شعر…'
              }
              aria-label="جست‌وجو"
            />
          </div>

        )}

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {error && (
            <p className="rounded-xl border border-shangarf/35 bg-shangarf/10 p-3 text-[12px] text-shangarf">
              {error}
            </p>

          )}

          {busy && (
            <p className="anim-breathe p-4 text-center text-[12px] text-ink-2">در حال بارگیری…</p>
          )}

          {poem && !busy && (
            <div className="flex flex-col gap-4">
              {fromSearch && (
                <p className="anim-fade truncate text-[12px] text-tan">{poem.FullTitle}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-2 dark:text-night-ink-2">
                {poem.Metre?.Rhythm && <span>وزن: {poem.Metre.Rhythm}</span>}

                {poem.RhymeLetters && <span>قافیه: {poem.RhymeLetters}</span>}

                <span>{toFa(couplets.length)} بیت</span>

              </div>

              {couplets.length > 1 && (
                <div className="jadval rounded-xl p-3">
                  <div className="mb-2 flex items-baseline justify-between text-[11px] text-ink-2 dark:text-night-ink-2">
                    <span>کدام بیت‌ها؟</span>

                    <span className="tabular-nums">
                      {toFa(from + 1)} تا {toFa(Math.min(from + count, couplets.length))}
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-[11px] text-ink-2 dark:text-night-ink-2">
                      از بیت
                      <input
                        type="range"
                        min={0}
                        max={Math.max(0, couplets.length - 1)}
                        value={from}
                        onChange={(e) => setFrom(Number(e.target.value))}
                        className="w-full"
                      />
                    </label>

                    <label className="text-[11px] text-ink-2 dark:text-night-ink-2">
                      چند بیت
                      <input
                        type="range"
                        min={1}
                        max={Math.min(24, couplets.length)}
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="w-full"
                      />
                    </label>

                  </div>

                </div>

              )}

              <div className="jadval rounded-xl bg-white/50 p-4 text-center leading-[2.4] dark:bg-night/40">
                {slice.map((c, i) => (
                  <p key={i} className={`text-[13.5px] ${c.prose ? 'text-start' : ''}`}>
                    {c.lines.join(' ⁘ ')}
                  </p>

                ))}
              </div>

              <Button variant="primary" onClick={insert}>
                درج در صفحه
              </Button>

            </div>

          )}

          {!poem && !busy && (
            <div className="flex flex-col gap-5">
            <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {(filtered as (PoetRef | (CatRef & { kind: 'cat' | 'poem' }))[]).map((item, i) => {
                const isPoet = !poet
                const label = isPoet ? (item as PoetRef).Nickname : (item as CatRef).Title
                const kind = isPoet ? 'cat' : (item as { kind: 'cat' | 'poem' }).kind
                return (
                  <li key={item.FullUrl} className="anim-rise" style={stagger(i)}>
                    <button
                      onClick={() =>
                        kind === 'poem'
                          ? openPoem(item as CatRef)
                          : openCat(
                              { title: label, fullUrl: item.FullUrl },
                              isPoet ? (item as PoetRef) : poet!,
                              trail.length,
                            )
                      }
                      className="flex w-full items-center gap-2 rounded-xl border border-line/60 px-3 py-2.5 text-start text-[12.5px] transition-[background-color,border-color,transform] duration-200 ease-page hover:-translate-y-px hover:border-tan hover:bg-tan/8 active:scale-[0.98] dark:border-night-line"
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          kind === 'poem' ? 'bg-tan' : 'bg-gold/70'
                        }`}
                        aria-hidden
                      />
                      <span className="truncate">{label}</span>

                    </button>

                  </li>

                )
              })}
              {filtered.length === 0 && !error && !hits?.length && (
                <li className="col-span-full p-6 text-center text-[12px] text-ink-2">
                  {q.trim().length >= MIN_QUERY ? 'در این فهرست چیزی نبود.' : 'چیزی پیدا نشد.'}
                </li>

              )}
            </ul>

            {q.trim().length >= MIN_QUERY && (
              <section className="anim-fade flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-2 border-t border-line/40 pt-3 text-[11px] text-ink-2 dark:border-night-line dark:text-night-ink-2">
                  <span>
                    متن شعرها {poet ? `— آثار ${poet.Nickname}` : '— همهٔ گنجور'}
                  </span>

                  {hits && !searching && (
                    <span className="tabular-nums">
                      {toFa(hitTotal.toLocaleString('en-US'))} نتیجه
                    </span>

                  )}
                </div>

                {searching && !hits?.length && (
                  <p className="anim-breathe p-3 text-center text-[12px] text-ink-2">
                    در حال جست‌وجو…
                  </p>

                )}

                {hits?.length === 0 && !searching && (
                  <p className="p-3 text-center text-[12px] text-ink-2">
                    مصرعی با این نوشته پیدا نشد.
                  </p>

                )}

                <ul className="flex flex-col gap-1.5">
                  {hits?.map((h, i) => (
                    <li key={h.id} className="anim-rise" style={stagger(i)}>
                      <button
                        onClick={() => openHit(h)}
                        className="flex w-full flex-col gap-1 rounded-xl border border-line/60 px-3 py-2.5 text-start transition-[background-color,border-color,transform] duration-200 ease-page hover:-translate-y-px hover:border-tan hover:bg-tan/8 active:scale-[0.99] dark:border-night-line"
                      >
                        <span className="truncate text-[12.5px]">
                          <Highlight text={h.fullTitle} term={hitTerm} />

                        </span>

                        <span className="line-clamp-2 text-[11px] leading-relaxed text-ink-2 dark:text-night-ink-2">
                          <Highlight text={snippet(h.plainText, hitTerm)} term={hitTerm} />

                        </span>

                      </button>

                    </li>

                  ))}
                </ul>

                {hitMore && (
                  <Button onClick={loadMore} disabled={searching}>
                    {searching ? (
                      <span className="anim-breathe">در حال بارگیری…</span>
                    ) : (
                      `${toFa(SEARCH_PAGE_SIZE)} نتیجهٔ بعدی`
                    )}
                  </Button>

                )}
              </section>

            )}
            </div>

          )}
        </div>

        <footer className="shrink-0 border-t border-line/40 px-4 py-2.5 text-[10.5px] text-ink-2/75 dark:border-night-line dark:text-night-ink-2">
          متن‌ها از گنجور (ganjoor.net) — مستقیم از مخزن عمومی خوانده می‌شود. جست‌وجوی متن شعرها
          از API گنجور می‌آید؛ تنها همان عبارت جست‌وجو فرستاده می‌شود.
        </footer>

      </div>

    </div>

  )
}
