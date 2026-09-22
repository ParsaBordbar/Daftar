import { INITIAL, type PoemState } from './poem'

export interface Doc {
  pages: PoemState[]
  active: number
}

export const MAX_PAGES = 24

export const newDoc = (page: PoemState = INITIAL): Doc => ({ pages: [page], active: 0 })

export const activePage = (doc: Doc): PoemState => doc.pages[doc.active] ?? doc.pages[0]

const clampIndex = (doc: Doc, i: number) => Math.max(0, Math.min(doc.pages.length - 1, i))

export const setActive = (doc: Doc, active: number): Doc => ({
  ...doc,
  active: clampIndex(doc, active),
})

export function patchActive(doc: Doc, p: Partial<PoemState>): Doc {
  const pages = doc.pages.map((page, i) => {
    if (i === doc.active) return { ...page, ...p }
    return p.formatId !== undefined ? { ...page, formatId: p.formatId } : page
  })
  return { ...doc, pages }
}

export const mapActive = (doc: Doc, fn: (s: PoemState) => PoemState): Doc => ({
  ...doc,
  pages: doc.pages.map((page, i) => (i === doc.active ? fn(page) : page)),
})

export function addPage(doc: Doc): Doc {
  if (doc.pages.length >= MAX_PAGES) return doc
  const src = activePage(doc)
  const page: PoemState = { ...src, text: '', source: src.source, pageNumber: src.pageNumber + 1 }
  return insertAfter(doc, page)
}

export function duplicatePage(doc: Doc): Doc {
  if (doc.pages.length >= MAX_PAGES) return doc
  const src = activePage(doc)
  return insertAfter(doc, { ...src, pageNumber: src.pageNumber + 1 })
}

function insertAfter(doc: Doc, page: PoemState): Doc {
  const at = doc.active + 1
  const pages = [...doc.pages.slice(0, at), page, ...doc.pages.slice(at)]
  return renumber({ pages, active: at })
}

export function removePage(doc: Doc, index = doc.active): Doc {
  if (doc.pages.length <= 1) return doc
  const pages = doc.pages.filter((_, i) => i !== index)
  const active = index < doc.active ? doc.active - 1 : Math.min(doc.active, pages.length - 1)
  return renumber({ pages, active })
}

export function movePage(doc: Doc, from: number, to: number): Doc {
  if (from === to || to < 0 || to >= doc.pages.length) return doc
  const pages = [...doc.pages]
  const [page] = pages.splice(from, 1)
  pages.splice(to, 0, page)
  return renumber({ pages, active: to })
}

export function renumber(doc: Doc): Doc {
  const first = doc.pages[0]?.pageNumber ?? 1
  const pages = doc.pages.map((p, i) =>
    p.pageNumber === first + i ? p : { ...p, pageNumber: first + i },
  )
  return { ...doc, pages }
}

export const docTitle = (doc: Doc) => {
  const p = doc.pages[0]
  return (p.title || p.poet || 'daftar').replace(/[\\/:*?"<>|]/g, '')
}
