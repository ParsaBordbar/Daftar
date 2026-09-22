import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useControlSections } from './components/Controls'
import Sidebar from './components/Sidebar'
import MobileDock from './components/MobileDock'
import Sheet from './components/Sheet'
import { useDesktop } from './lib/media'
import GanjoorBrowser, { type Insertion } from './components/GanjoorBrowser'
import Preview from './components/Preview'
import PageStrip from './components/PageStrip'
import { Button, Section } from './components/ui'
import { loadChromeFonts, loadFont } from './lib/fonts'
import { FORMAT_BY_ID } from './lib/formats'
import { fitFontSize, INITIAL, parseStanzas, toFa, type PoemState } from './lib/poem'
import { hashFor, readHash, shareUrl } from './lib/share'
import {
  bundleZip,
  copyPng,
  downloadBlob,
  exportPng,
  renderPng,
  shareBundle,
  sharePng,
} from './lib/export'
import { withStagedPage } from './lib/stage'
import {
  activePage,
  addPage,
  docTitle,
  duplicatePage,
  mapActive,
  movePage,
  newDoc,
  patchActive,
  removePage,
  setActive,
  type Doc,
} from './lib/doc'
import { bumpCounter, readCounter, type CounterState } from './lib/counter'
import { BRAND } from './lib/brand'
import { Ltr, Mark, SoonTag, Wordmark } from './components/Wordmark'
import { DownloadIcon, KeyboardIcon, PagesIcon, RedoIcon, ShareIcon, UndoIcon } from './components/Icons'
import { useUndoable } from './lib/history'
import { imageFrom, readImage } from './lib/image'
import { coupletsToText, looksLikeVerse, randomPoem, toCouplets, trailSource } from './lib/ganjoor'
import { keysOf, SHORTCUTS, type Shortcut, type ShortcutId } from './lib/shortcuts'

const DRAFT_KEY = 'daftar:draft'
const DOC_KEY = 'daftar:doc'
const COLLAPSED_KEY = 'daftar:collapsed'

const loadCollapsed = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem(COLLAPSED_KEY) ?? '{}') as Record<string, boolean>
  } catch {
    return {}
  }
}

const loadDraft = (): Doc => {
  const shared = readHash()
  if (shared) return shared
  try {
    const raw = localStorage.getItem(DOC_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Doc>
      if (Array.isArray(parsed.pages) && parsed.pages.length) {
        const pages = parsed.pages.map((p) => ({ ...INITIAL, ...p }))
        return setActive({ pages, active: 0 }, parsed.active ?? 0)
      }
    }

    const old = localStorage.getItem(DRAFT_KEY)
    if (old) return newDoc({ ...INITIAL, ...JSON.parse(old) })
  } catch {
  }
  return newDoc()
}

const fitted = (s: PoemState): PoemState => {
  const stanzas = parseStanzas(s.text)
  const lines = stanzas.reduce((n, st) => n + st.lines.length, 0)
  return { ...s, fontSize: fitFontSize(s, lines, stanzas.length) }
}

type Toast = { text: string; tone: 'ok' | 'err' } | null

type Cast = (Shortcut & { at: number }) | null

function persist(doc: Doc) {
  try {
    localStorage.setItem(DOC_KEY, JSON.stringify(doc))
  } catch {
    try {
      const pages = doc.pages.map((p) => (p.bgImage.startsWith('data:') ? { ...p, bgImage: '' } : p))
      localStorage.setItem(DOC_KEY, JSON.stringify({ ...doc, pages }))
    } catch {
    }
  }
}

export default function App() {
  const { value: doc, set: setDoc, undo, redo, canUndo, canRedo } = useUndoable<Doc>(loadDraft)
  const state = activePage(doc)
  const [scale, setScale] = useState(2)
  const [busy, setBusy] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast>(null)
  const [browsing, setBrowsing] = useState(false)
  const [cast, setCast] = useState<Cast>(null)
  const desktop = useDesktop()

  const [collapsed, setCollapsed] = useState(loadCollapsed)

  const [sheet, setSheet] = useState<string | null>(null)
  const toggleSection = (id: string) =>
    setCollapsed((c) => {
      const next = { ...c, [id]: !c[id] }
      try {
        localStorage.setItem(COLLAPSED_KEY, JSON.stringify(next))
      } catch {
      }
      return next
    })
  const [counter, setCounter] = useState<CounterState>({ global: null, local: 0 })
  const pageRef = useRef<HTMLDivElement>(null)

  const patch = useCallback((p: Partial<PoemState>) => setDoc((d) => patchActive(d, p)), [setDoc])

  const autoFit = useCallback(() => setDoc((d) => mapActive(d, fitted)), [setDoc])

  const format = FORMAT_BY_ID.get(state.formatId)!

  const made =
    counter.global !== null
      ? `${toFa(counter.global.toLocaleString('en-US'))} صفحه ساخته شده`
      : counter.local > 0
        ? `${toFa(counter.local)} صفحه در این مرورگر`
        : ''

  useEffect(() => {
    void loadFont(state.fontId)
  }, [state.fontId])

  useEffect(() => {
    setDoc(
      (d) =>
        mapActive(d, (s) => {
          const stanzas = parseStanzas(s.text)
          const lines = stanzas.reduce((n, st) => n + st.lines.length, 0)
          const fit = fitFontSize(s, lines, stanzas.length)
          return s.fontSize > fit ? { ...s, fontSize: fit } : s
        }),
      false,
    )
  }, [
    doc.active,
    state.fontId,
    state.formatId,
    state.text,
    state.padding,
    state.lineHeight,
    state.beitGap,
    state.title,
    state.poet,
    state.source,
    setDoc,
  ])

  useEffect(() => {
    const id = setTimeout(() => persist(doc), 400)
    return () => clearTimeout(id)
  }, [doc])

  useEffect(() => {
    void readCounter().then(setCounter)
    void loadChromeFonts()
  }, [])

  useEffect(() => {
    const id = setTimeout(() => {
      history.replaceState(null, '', `#${hashFor(doc)}`)
    }, 400)
    return () => clearTimeout(id)
  }, [doc])

  useEffect(() => {
    const onHash = () => {
      const shared = readHash()
      if (shared) setDoc(shared)
    }
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [setDoc])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(id)
  }, [toast])

  useEffect(() => {
    if (!cast) return
    const id = setTimeout(() => setCast(null), 1500)
    return () => clearTimeout(id)
  }, [cast])

  const exportOpts = useMemo(
    () => ({
      scale,
      width: format.w,
      height: format.h,
      filename: `${(state.title || state.poet || 'daftar').replace(/[\\/:*?"<>|]/g, '')}-${format.id}.png`,
    }),
    [scale, format, state.title, state.poet],
  )

  const withPage = async (name: string, fn: (node: HTMLElement) => Promise<void>) => {
    const node = pageRef.current
    if (!node) return
    setBusy(name)
    try {
      await loadFont(state.fontId)
      await fn(node)
    } catch (err) {
      console.error(err)
      setToast({ text: 'ساخت تصویر ناموفق بود. دوباره تلاش کنید.', tone: 'err' })
    } finally {
      setBusy(null)
    }
  }

  const onDownload = () =>
    withPage('download', async (node) => {
      await exportPng(node, exportOpts)
      setToast({ text: 'تصویر ذخیره شد.', tone: 'ok' })
      setCounter(await bumpCounter())
    })

  const onShare = () =>
    withPage('share', async (node) => {
      const shared = await sharePng(node, exportOpts, `${state.title} — ${state.poet}`)
      if (!shared) {
        await exportPng(node, exportOpts)
        setToast({ text: 'اشتراک‌گذاری پشتیبانی نشد؛ تصویر دانلود شد.', tone: 'ok' })
      }
      setCounter(await bumpCounter())
    })

  const onCopy = () =>
    withPage('copy', async (node) => {
      await copyPng(node, exportOpts)
      setToast({ text: 'تصویر در کلیپ‌بورد کپی شد.', tone: 'ok' })
    })

  const many = doc.pages.length > 1

  const renderAll = async () => {
    const blobs: Blob[] = []
    for (const page of doc.pages) {
      await loadFont(page.fontId)
      blobs.push(await withStagedPage(page, (node) => renderPng(node, exportOpts)))
    }
    return blobs
  }

  const onDownloadAll = async () => {
    setBusy('bundle')
    try {
      const blobs = await renderAll()
      downloadBlob(await bundleZip(blobs, docTitle(doc)), `${docTitle(doc)}-${format.id}.zip`)
      setToast({ text: `${toFa(blobs.length)} صفحه در یک فایل زیپ ذخیره شد.`, tone: 'ok' })
      setCounter(await bumpCounter(blobs.length))
    } catch (err) {
      console.error(err)
      setToast({ text: 'ساخت بسته ناموفق بود. دوباره تلاش کنید.', tone: 'err' })
    } finally {
      setBusy(null)
    }
  }

  const onShareAll = async () => {
    setBusy('bundle-share')
    try {
      const blobs = await renderAll()
      const shared = await shareBundle(blobs, docTitle(doc), `${state.title} — ${state.poet}`)
      if (!shared) {
        downloadBlob(await bundleZip(blobs, docTitle(doc)), `${docTitle(doc)}-${format.id}.zip`)
        setToast({ text: 'هم‌رسانی چندفایلی پشتیبانی نشد؛ بستهٔ زیپ دانلود شد.', tone: 'ok' })
      }
      setCounter(await bumpCounter(blobs.length))
    } catch (err) {
      console.error(err)
      setToast({ text: 'هم‌رسانی بسته ناموفق بود.', tone: 'err' })
    } finally {
      setBusy(null)
    }
  }

  const onRemovePage = () => {
    if (state.text.trim() && !confirm(`صفحهٔ ${toFa(doc.active + 1)} حذف شود؟`)) return
    setDoc((d) => removePage(d))
  }

  const onCopyLink = async () => {
    const url = shareUrl(doc)
    try {
      await navigator.clipboard.writeText(url)
      setToast({ text: `پیوند کپی شد (${toFa(url.length)} نویسه).`, tone: 'ok' })
    } catch {
      setToast({ text: 'کپی پیوند ناموفق بود.', tone: 'err' })
    }
  }

  const onReset = () => {
    if (!confirm('همه‌چیز به حالت اولیه برگردد؟')) return
    setDoc(newDoc())
  }

  const onRandom = async () => {
    setBusy('random')
    try {
      const r = await randomPoem()
      const slice = toCouplets(r.poem).slice(0, 4)
      setDoc((d) =>
        mapActive(d, (s) =>
          fitted({
            ...s,
            text: coupletsToText(slice),
            title: r.poem.Title,
            poet: r.poet.Nickname,
            source: trailSource(r),
            layout: looksLikeVerse(slice) ? 'single' : 'free',
          }),
        ),
      )
      setToast({ text: `«${r.poem.Title}» از ${r.poet.Nickname} درج شد.`, tone: 'ok' })
    } catch (err) {
      console.error(err)
      setToast({ text: 'شعر تصادفی پیدا نشد. اتصال اینترنت را بررسی کنید.', tone: 'err' })
    } finally {
      setBusy(null)
    }
  }

  const onImageFile = async (file: File | null) => {
    if (!file) return
    try {
      const bgImage = await readImage(file)
      patch({ bgImage })
      setToast({ text: 'تصویر پس‌زمینه گذاشته شد.', tone: 'ok' })
    } catch {
      setToast({ text: 'این فایل به‌عنوان تصویر خوانده نشد.', tone: 'err' })
    }
  }

  const goPage = (delta: number) => setDoc((d) => setActive(d, d.active + delta), false)

  const onKey = (e: KeyboardEvent) => {
    if (browsing) return
    const mod = e.metaKey || e.ctrlKey
    const t = e.target as HTMLElement | null
    const editing =
      !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
    const run = (id: ShortcutId, fn: () => void) => {
      e.preventDefault()
      setCast({ ...SHORTCUTS[id], at: Date.now() })
      fn()
    }
    if (mod && e.code === 'KeyZ') return e.shiftKey ? run('redo', redo) : run('undo', undo)
    if (mod && e.code === 'KeyY') return run('redo', redo)
    if (mod && e.code === 'KeyS') {
      return e.shiftKey && many ? run('downloadAll', onDownloadAll) : run('download', onDownload)
    }
    if (mod && e.shiftKey && e.code === 'KeyC') return run('copy', onCopy)
    if (mod && e.shiftKey && e.code === 'KeyL') return run('link', onCopyLink)
    if (mod && e.code === 'KeyK') return run('ganjoor', () => setBrowsing(true))
    if (mod && e.code === 'KeyD') return run('duplicate', () => setDoc((d) => duplicatePage(d)))
    if (mod && e.key === 'Enter') return run('newPage', () => setDoc((d) => addPage(d)))
    if (editing) return

    if (e.altKey && e.key === 'ArrowLeft') return run('next', () => goPage(1))
    if (e.altKey && e.key === 'ArrowRight') return run('prev', () => goPage(-1))
  }
  const keyRef = useRef(onKey)
  keyRef.current = onKey
  const imageRef = useRef(onImageFile)
  imageRef.current = onImageFile

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => keyRef.current(e)
    const onPaste = (e: ClipboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
      const file = imageFrom(e.clipboardData)
      if (file) {
        e.preventDefault()
        setCast({ ...SHORTCUTS.paste, at: Date.now() })
        void imageRef.current(file)
      }
    }
    addEventListener('keydown', onKeyDown)
    addEventListener('paste', onPaste)
    return () => {
      removeEventListener('keydown', onKeyDown)
      removeEventListener('paste', onPaste)
    }
  }, [])

  const sections = useControlSections({
    state,
    patch,
    onBrowse: () => setBrowsing(true),
    onRandom,
    onAutoFit: autoFit,
    scale,
    setScale,
    busy: busy !== null,
  })

  const actions = (
    <>
      {many && (
        <p className="mb-2 text-[11px] text-ink-2 dark:text-night-ink-2">
          این صفحه ({toFa(doc.active + 1)} از {toFa(doc.pages.length)})
        </p>
      )}
      <div className="grid grid-cols-2 gap-2">
        {many && (
          <Button onClick={onDownload} disabled={busy !== null} className="tip" data-tip={keysOf('download')}>
            {busy === 'download' ? '…' : 'دانلود این صفحه'}
          </Button>
        )}
        {!many && !desktop && (
          <Button onClick={onDownload} disabled={busy !== null}>
            {busy === 'download' ? '…' : 'دانلود'}
          </Button>
        )}

        <Button onClick={onShare} disabled={busy !== null}>
          {busy === 'share' ? '…' : 'هم‌رسانی'}
        </Button>

        <Button
          onClick={onCopy}
          disabled={busy !== null}
          className={`tip ${many || !desktop ? 'col-span-2' : ''}`}
          data-tip={keysOf('copy')}
        >
          {busy === 'copy' ? '…' : 'کپی تصویر'}
        </Button>

        {many && (
          <>
            <p className="col-span-2 mt-1 text-[11px] text-ink-2 dark:text-night-ink-2">
              همهٔ {toFa(doc.pages.length)} صفحه با هم
            </p>
            <Button onClick={onDownloadAll} disabled={busy !== null} className="tip" data-tip={keysOf('downloadAll')}>
              {busy === 'bundle' ? '…' : 'دانلود زیپ'}
            </Button>
            <Button onClick={onShareAll} disabled={busy !== null}>
              {busy === 'bundle-share' ? '…' : 'هم‌رسانی همه'}
            </Button>
          </>
        )}

        {!desktop && (
          <Button onClick={onCopyLink} className="tip" data-tip={keysOf('link')}>
            کپی پیوند
          </Button>
        )}

        <Button onClick={onReset} className="sm:col-span-2">
          بازنشانی
        </Button>
      </div>

      <details className="group mt-3 hidden sm:block">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] text-ink-2 hover:text-tan dark:text-night-ink-2 [&::-webkit-details-marker]:hidden">
          <KeyboardIcon size={14} className="[--icon-line:#787774]" />
          کلیدهای میانبر
        </summary>
        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-ink-2 dark:text-night-ink-2">
          {Object.values(SHORTCUTS).map(({ keys, label }) => (
            <li key={label} className="flex items-center justify-between gap-2">
              <span>{label}</span>
              <span className="flex shrink-0 gap-0.5" dir="ltr">
                {keys.map((k) => (
                  <kbd key={k}>{k}</kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </details>

      <p className="mt-3 text-[11px] leading-relaxed text-ink-2/85 dark:text-night-ink-2">
        همه‌چیز در مرورگر شما اجرا می‌شود. متن صفحه به هیچ سروری فرستاده نمی‌شود — پیوند
        هم‌رسانی، خودِ صفحه را در آدرس نگه می‌دارد. تنها استثنا: عبارتی که در جست‌وجوی
        گنجور می‌نویسید، به گنجور فرستاده می‌شود.
      </p>

      {made && (
        <p className="mt-2 text-[11px] text-ink-2/70 lg:hidden dark:text-night-ink-2">{made}</p>
      )}
    </>
  )

  const promo = (
    <section
      className="anim-rise jadval rounded-2xl bg-tan/8 p-4"
      style={{ '--anim-delay': '280ms' } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <Wordmark className="h-10" />
        <SoonTag />
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-ink-2 dark:text-night-ink-2">
        {BRAND.faPitch}
      </p>

      <p className="mt-3">
        <Ltr className="font-mark text-[13.5px] text-tan">{BRAND.enTeaser}</Ltr>
      </p>
    </section>
  )

  const dockItems = [
    ...sections.map((s) => ({ id: s.id, title: s.dock, icon: s.icon })),
    { id: 'export', title: 'خروجی', icon: <PagesIcon /> },
  ]
  const openSheet = sheet === 'export'
    ? { title: 'خروجی', icon: <PagesIcon />, hint: undefined, content: (<>{actions}<div className="mt-4">{promo}</div></>) }
    : sections.find((s) => s.id === sheet)

  return (
    <div className="flex h-full flex-col bg-paper text-ink dark:bg-night dark:text-night-ink">
      <header className="anim-fade z-30 flex shrink-0 items-center justify-between gap-2 border-b border-line/50 bg-paper/90 px-3 py-2.5 backdrop-blur-md sm:px-4 dark:border-night-line dark:bg-night/90">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex min-w-0 items-center gap-2.5">
            <Mark className="h-8 w-8 sm:h-9 sm:w-9" />
            <Wordmark className="h-7 sm:h-8" />
            <span className="hidden h-4 w-px shrink-0 bg-line lg:block dark:bg-night-line" />
            <span className="hidden min-w-0 flex-col leading-tight lg:flex">
              <span className="truncate text-[12px]">{BRAND.faTagline}</span>
            </span>

          </span>

          {desktop && <SoonTag />}
        </div>

        {desktop ? (
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {made && (
            <span className="hidden text-[11px] text-ink-2 lg:inline dark:text-night-ink-2">
              {made}
            </span>

          )}
          <span className="inline-flex items-center gap-0.5">
            <HeaderIconButton data-tip={`واگرد · ${keysOf('undo')}`} disabled={!canUndo} onClick={undo}>
              <UndoIcon size={18} />
            </HeaderIconButton>
            <HeaderIconButton data-tip={`ازنو · ${keysOf('redo')}`} disabled={!canRedo} onClick={redo}>
              <RedoIcon size={18} />
            </HeaderIconButton>
          </span>

          <Button onClick={onCopyLink} className="tip tip-below" data-tip={keysOf('link')}>
            پیوند
          </Button>

          <Button
            variant="primary"
            onClick={many ? onDownloadAll : onDownload}
            disabled={busy !== null}
            className="tip tip-below"
            data-tip={keysOf(many ? 'downloadAll' : 'download')}
          >
            {busy === 'download' || busy === 'bundle' ? (
              <span className="anim-breathe">در حال ساخت…</span>
            ) : many ? (
              `دانلود همه (${toFa(doc.pages.length)})`
            ) : (
              'دانلود'
            )}
          </Button>

        </div>
        ) : (
          <div className="flex shrink-0 items-center gap-1">
            <HeaderIconButton
              aria-label={many ? 'هم‌رسانی همه' : 'هم‌رسانی'}
              disabled={busy !== null}
              onClick={many ? onShareAll : onShare}
            >
              {busy === 'share' || busy === 'bundle-share' ? (
                <span className="anim-breathe text-[11px]">…</span>
              ) : (
                <ShareIcon size={22} />
              )}
            </HeaderIconButton>
            <HeaderIconButton
              aria-label={many ? `دانلود همه (${toFa(doc.pages.length)})` : 'دانلود'}
              disabled={busy !== null}
              onClick={many ? onDownloadAll : onDownload}
            >
              {busy === 'download' || busy === 'bundle' ? (
                <span className="anim-breathe text-[11px]">…</span>
              ) : (
                <DownloadIcon size={22} />
              )}
            </HeaderIconButton>
          </div>
        )}

      </header>

      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section
          className="relative flex min-h-0 flex-1 flex-col bg-paper-2/40 lg:order-2 lg:bg-transparent dark:bg-night-2/30 lg:dark:bg-transparent"
          style={desktop ? undefined : { paddingBottom: 'var(--dock-h, 0px)' }}
          onDragOver={(e) => {
            if (imageFrom(e.dataTransfer)) e.preventDefault()
          }}
          onDrop={(e) => {
            const file = imageFrom(e.dataTransfer)
            if (!file) return
            e.preventDefault()
            void onImageFile(file)
          }}
        >
          <div className="anim-fade absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(55,53,47,0.05),transparent_65%)]" />
          <div className="relative min-h-0 flex-1">
            <Preview state={state} pageRef={pageRef} />
            {cast && (
              <div
                key={cast.at}
                aria-live="polite"
                className="keycast anim-toast pointer-events-none absolute bottom-3 left-3 z-20 flex items-center gap-2.5 rounded-xl bg-ink/92 px-3 py-2 text-[12px] text-paper shadow-lg backdrop-blur-sm dark:bg-night-ink dark:text-night"
              >
                <span className="flex gap-1" dir="ltr">
                  {cast.keys.map((k) => (
                    <kbd key={k}>{k}</kbd>
                  ))}
                </span>
                <span>{cast.label}</span>
              </div>
            )}
          </div>
          <PageStrip
            doc={doc}
            onSelect={(i) => setDoc((d) => setActive(d, i), false)}
            onAdd={() => setDoc((d) => addPage(d))}
            onDuplicate={() => setDoc((d) => duplicatePage(d))}
            onRemove={onRemovePage}
            onMove={(from, to) => setDoc((d) => movePage(d, from, to))}
          />
        </section>

        {desktop ? (
          <aside className="min-h-0 w-98 shrink-0 overflow-y-auto border-l border-line/50 bg-paper p-3 lg:order-1 dark:border-night-line dark:bg-night">
            <div className="flex flex-col gap-3">
              <Sidebar sections={sections} collapsed={collapsed} onToggle={toggleSection} />

              <Section
                title="خروجی"
                icon={<PagesIcon />}
                delay={240}
                open={!collapsed.export}
                onToggle={() => toggleSection('export')}
              >
                {actions}
              </Section>

              {promo}
            </div>
          </aside>
        ) : (
          <MobileDock items={dockItems} active={sheet} onPick={(id) => setSheet((s) => (s === id ? null : id))} />
        )}

      </main>

      {!desktop && openSheet && (
        <Sheet title={openSheet.title} icon={openSheet.icon} hint={openSheet.hint} onClose={() => setSheet(null)}>
          {openSheet.content}
        </Sheet>
      )}

      {browsing && (
        <GanjoorBrowser
          onClose={() => setBrowsing(false)}
          onInsert={(v: Insertion) => {
            setDoc((d) => mapActive(d, (s) => fitted({ ...s, ...v })))
            setBrowsing(false)
            setToast({ text: `«${v.title}» درج شد.`, tone: 'ok' })
          }}
        />

      )}

      {toast && (
        <div
          className={`anim-toast fixed bottom-5 left-1/2 z-50 rounded-xl px-4 py-2.5 text-[13px] shadow-lg ${
            toast.tone === 'ok' ? 'bg-ink text-paper' : 'bg-[#e03e3e] text-white'
          }`}
        >
          {toast.text}
        </div>

      )}
    </div>

  )
}

function HeaderIconButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="tip tip-below inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink transition-[background-color,transform] lg:h-9 lg:w-9 duration-200 ease-page hover:bg-tan/10 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent [--icon-line:#513423] dark:text-night-ink dark:[--icon-line:#e0c98a]"
    />
  )
}
