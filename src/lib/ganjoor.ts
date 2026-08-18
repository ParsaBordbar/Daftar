const COMMIT = import.meta.env.VITE_GANJOOR_REF ?? 'main'
export const GANJOOR_BASE = `https://cdn.jsdelivr.net/gh/ganjoor/ganjoor-data@${COMMIT}`
export const GANJOOR_SITE = 'https://ganjoor.net'

export interface PoetRef {
  Id: number
  Nickname: string

  FullUrl: string
}

export interface Manifest {
  SchemaVersion: number
  PoetsCount: number
  PoemsCount: number
  Poets: PoetRef[]
}

export interface CatRef {
  Id: number
  Title: string
  FullUrl: string
}

export interface Category {
  Id: number
  Title: string
  FullUrl: string
  BookName?: string
  ChildCats: CatRef[]
  Poems: CatRef[]
}

export type VersePosition =
  | 'Right'
  | 'Left'
  | 'CenteredVerse1'
  | 'CenteredVerse2'
  | 'Single'
  | 'Paragraph'
  | 'Comment'

export interface Verse {
  VOrder: number
  Position: VersePosition
  Text: string
  CoupletIndex: number
}

export interface Poem {
  Id: number
  Title: string
  FullTitle: string
  FullUrl: string
  Metre?: { Rhythm?: string } | null
  RhymeLetters?: string
  Verses: Verse[]
}

const mem = new Map<string, unknown>()

function cached<T>(key: string): T | null {
  if (mem.has(key)) return mem.get(key) as T
  try {
    const raw = sessionStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw) as T
      mem.set(key, parsed)
      return parsed
    }
  } catch {
  }
  return null
}

function store(key: string, value: unknown) {
  mem.set(key, value)
  try {
    const raw = JSON.stringify(value)

    if (raw.length < 400_000) sessionStorage.setItem(key, raw)
  } catch {
  }
}

async function getJson<T>(path: string): Promise<T> {
  const key = `ganjoor:${COMMIT}:${path}`
  const hit = cached<T>(key)
  if (hit) return hit
  const res = await fetch(GANJOOR_BASE + path)
  if (!res.ok) throw new Error(`گنجور ${res.status}`)
  const data = (await res.json()) as T
  store(key, data)
  return data
}

export const fetchManifest = () => getJson<Manifest>('/manifest.json')

export const fetchCategory = (fullUrl: string) =>
  getJson<Category>(`/poets${fullUrl}/_cat.json`)

export const fetchPoem = (fullUrl: string) => getJson<Poem>(`/poets${fullUrl}.json`)

/**
 * Full-text search. The browsable tree comes from the ganjoor-data snapshot on
 * jsDelivr, but that snapshot has no index — searching it client-side would mean
 * downloading ~132k poems. So the query (and only the query) goes to Ganjoor's
 * public API; the poem itself is still read from the CDN afterwards, because a
 * hit's `fullUrl` is the same path the snapshot uses.
 */
export const GANJOOR_API = 'https://api.ganjoor.net'

export interface SearchHit {
  id: number
  title: string
  fullTitle: string
  fullUrl: string
  plainText: string
}

export interface SearchPage {
  hits: SearchHit[]
  total: number
  hasMore: boolean
}

export const SEARCH_PAGE_SIZE = 12

export async function searchPoems(
  term: string,
  { poetId, page = 1, signal }: { poetId?: number; page?: number; signal?: AbortSignal } = {},
): Promise<SearchPage> {
  const params = new URLSearchParams({
    term,
    PageNumber: String(page),
    PageSize: String(SEARCH_PAGE_SIZE),
  })
  if (poetId) params.set('poetId', String(poetId))

  const key = `ganjoor:search:${params}`
  const hit = cached<SearchPage>(key)
  if (hit) return hit

  const res = await fetch(`${GANJOOR_API}/api/ganjoor/poems/search?${params}`, { signal })
  if (!res.ok) throw new Error(`گنجور ${res.status}`)
  const hits = (await res.json()) as SearchHit[]

  // Totals ride along in a custom header the API explicitly exposes to CORS.
  let total = hits.length
  let hasMore = hits.length === SEARCH_PAGE_SIZE
  try {
    const paging = res.headers.get('paging-headers')
    if (paging) {
      const p = JSON.parse(paging) as { totalCount?: number; hasNextPage?: boolean }
      if (typeof p.totalCount === 'number') total = p.totalCount
      if (typeof p.hasNextPage === 'boolean') hasMore = p.hasNextPage
    }
  } catch {
  }

  const out = { hits, total, hasMore }
  store(key, out)
  return out
}

/** "حافظ » غزلیات » غزل ۱" -> poet, the middle path, and the leaf title. */
export function splitFullTitle(fullTitle: string | undefined) {
  const parts = (fullTitle ?? '').split('»').map((s) => s.trim()).filter(Boolean)
  return {
    poet: parts[0] ?? '',
    source: parts.slice(1, -1).join(' » '),
    title: parts.at(-1) ?? '',
  }
}

export interface Couplet {
  lines: string[]

  prose: boolean
}

export function toCouplets(poem: Poem): Couplet[] {
  const out: Couplet[] = []
  const byIndex = new Map<number, Couplet>()

  for (const v of poem.Verses ?? []) {
    if (v.Position === 'Comment') continue
    const text = v.Text?.trim()
    if (!text) continue

    if (v.Position === 'Right' || v.Position === 'Left') {
      let c = byIndex.get(v.CoupletIndex)
      if (!c) {
        c = { lines: [], prose: false }
        byIndex.set(v.CoupletIndex, c)
        out.push(c)
      }

      if (v.Position === 'Right') c.lines.unshift(text)
      else c.lines.push(text)
    } else {
      out.push({ lines: [text], prose: v.Position === 'Paragraph' })
    }
  }
  return out
}

export const coupletsToText = (couplets: Couplet[]) =>
  couplets.map((c) => c.lines.join('\n')).join('\n\n')

export const looksLikeVerse = (couplets: Couplet[]) =>
  couplets.some((c) => c.lines.length === 2)
