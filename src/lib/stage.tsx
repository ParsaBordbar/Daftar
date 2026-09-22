import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import PoemPage from '../components/PoemPage'
import type { PoemState } from './poem'

export async function withStagedPage<T>(
  state: PoemState,
  fn: (node: HTMLElement) => Promise<T>,
): Promise<T> {
  const host = document.createElement('div')
  host.setAttribute('aria-hidden', 'true')
  Object.assign(host.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    transform: 'translateX(-200vw)',
    pointerEvents: 'none',
  } satisfies Partial<CSSStyleDeclaration>)
  document.body.appendChild(host)
  const root = createRoot(host)
  try {
    flushSync(() => root.render(<PoemPage state={state} />))
    const node = host.firstElementChild as HTMLElement | null
    if (!node) throw new Error('stage produced no page')
    await document.fonts.ready
    await Promise.all(
      [...host.querySelectorAll('img')].map((img) =>
        img.complete ? Promise.resolve() : img.decode().catch(() => undefined),
      ),
    )
    return await fn(node)
  } finally {
    root.unmount()
    host.remove()
  }
}
