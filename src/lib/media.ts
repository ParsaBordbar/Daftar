import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mql = matchMedia(query)
      mql.addEventListener('change', notify)
      return () => mql.removeEventListener('change', notify)
    },
    () => matchMedia(query).matches,
    () => false,
  )
}

export const useDesktop = () => useMediaQuery('(min-width: 64rem)')
