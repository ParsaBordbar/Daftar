import { useCallback, useReducer, type Reducer } from 'react'

interface History<T> {
  past: T[]
  present: T
  future: T[]

  stamp: number
}

type Action<T> =
  | { type: 'set'; next: (t: T) => T; record: boolean }
  | { type: 'undo' }
  | { type: 'redo' }

const LIMIT = 80
const COALESCE = 600

function reducer<T>(h: History<T>, a: Action<T>): History<T> {
  switch (a.type) {
    case 'set': {
      const next = a.next(h.present)
      if (Object.is(next, h.present)) return h
      if (!a.record) return { ...h, present: next }
      const now = Date.now()
      if (h.stamp && now - h.stamp < COALESCE) {
        return { ...h, present: next, future: [], stamp: now }
      }
      return {
        past: [...h.past, h.present].slice(-LIMIT),
        present: next,
        future: [],
        stamp: now,
      }
    }
    case 'undo': {
      if (!h.past.length) return h
      return {
        past: h.past.slice(0, -1),
        present: h.past[h.past.length - 1],
        future: [h.present, ...h.future],
        stamp: 0,
      }
    }
    case 'redo': {
      if (!h.future.length) return h
      return {
        past: [...h.past, h.present],
        present: h.future[0],
        future: h.future.slice(1),
        stamp: 0,
      }
    }
  }
}

export type Updater<T> = T | ((t: T) => T)

export function useUndoable<T>(init: () => T) {
  const [h, dispatch] = useReducer(reducer as Reducer<History<T>, Action<T>>, undefined, () => ({
    past: [],
    present: init(),
    future: [],
    stamp: 0,
  }))

  const set = useCallback((up: Updater<T>, record = true) => {
    const next = typeof up === 'function' ? (up as (t: T) => T) : () => up
    dispatch({ type: 'set', next, record })
  }, [])
  const undo = useCallback(() => dispatch({ type: 'undo' }), [])
  const redo = useCallback(() => dispatch({ type: 'redo' }), [])

  return {
    value: h.present,
    set,
    undo,
    redo,
    canUndo: h.past.length > 0,
    canRedo: h.future.length > 0,
  }
}
