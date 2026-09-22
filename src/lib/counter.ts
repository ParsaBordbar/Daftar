const NAMESPACE = import.meta.env.VITE_COUNTER_NS ?? 'booklet-persian-demo'
const KEY = import.meta.env.VITE_COUNTER_KEY ?? 'pages'

const COUNTER = {
  up: `https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`,
  get: `https://abacus.jasoncameron.dev/get/${NAMESPACE}/${KEY}`,

  pick: (json: unknown): number | null => {
    const j = json as Record<string, unknown>
    for (const k of ['value', 'count', 'Count']) {
      if (typeof j?.[k] === 'number') return j[k] as number
    }
    return null
  },
}

const LOCAL_KEY = 'daftar:local-count'
const TIMEOUT = 4000

const localCount = () => Number(localStorage.getItem(LOCAL_KEY) ?? 0)

const bumpLocal = (by: number) => {
  const n = localCount() + by
  localStorage.setItem(LOCAL_KEY, String(n))
  return n
}

async function hit(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) })
    if (!res.ok) return null
    return COUNTER.pick(await res.json())
  } catch {
    return null
  }
}

export interface CounterState {
  global: number | null

  local: number
}

export const readCounter = async (): Promise<CounterState> => ({
  global: await hit(COUNTER.get),
  local: localCount(),
})

export const bumpCounter = async (pages = 1): Promise<CounterState> => {
  const n = Math.max(1, Math.floor(pages))
  const local = bumpLocal(n)
  const results = await Promise.all(Array.from({ length: n }, () => hit(COUNTER.up)))
  const seen = results.filter((v): v is number => v !== null)
  return { global: seen.length ? Math.max(...seen) : null, local }
}
