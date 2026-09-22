import { toPng, toBlob } from 'html-to-image'
import { embeddedFontCss } from './fonts'
import { makeZip } from './zip'

export interface ExportOptions {
  scale: number

  width: number
  height: number
  filename: string
}

async function capture<T>(
  node: HTMLElement,
  opts: ExportOptions,
  run: (node: HTMLElement, cfg: Parameters<typeof toPng>[1]) => Promise<T>,
): Promise<T> {
  const prevTransform = node.style.transform
  const prevOrigin = node.style.transformOrigin
  node.style.transform = 'none'
  node.style.transformOrigin = 'top left'

  await document.fonts.ready
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

  const cfg = {
    width: opts.width,
    height: opts.height,
    pixelRatio: opts.scale,
    cacheBust: false,

    skipFonts: true,
    fontEmbedCSS: embeddedFontCss(),
    style: { transform: 'none', transformOrigin: 'top left' },
  }

  try {
    await toPng(node, { ...cfg, pixelRatio: 0.1 })
    return await run(node, cfg)
  } finally {
    node.style.transform = prevTransform
    node.style.transformOrigin = prevOrigin
  }
}

export async function exportPng(node: HTMLElement, opts: ExportOptions) {
  const url = await capture(node, opts, (n, cfg) => toPng(n, cfg))
  const a = document.createElement('a')
  a.href = url
  a.download = opts.filename
  a.click()
}

export async function sharePng(node: HTMLElement, opts: ExportOptions, text: string) {
  const blob = await capture(node, opts, (n, cfg) => toBlob(n, cfg))
  if (!blob) throw new Error('render produced no image')
  const file = new File([blob], opts.filename, { type: 'image/png' })
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], text })
    return true
  }
  return false
}

export async function copyPng(node: HTMLElement, opts: ExportOptions) {
  const blob = await capture(node, opts, (n, cfg) => toBlob(n, cfg))
  if (!blob) throw new Error('render produced no image')
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
}

export async function renderPng(node: HTMLElement, opts: ExportOptions): Promise<Blob> {
  const blob = await capture(node, opts, (n, cfg) => toBlob(n, cfg))
  if (!blob) throw new Error('render produced no image')
  return blob
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export const pageFilename = (base: string, index: number, total: number) =>
  `${base}-${String(index + 1).padStart(String(total).length, '0')}.png`

export async function bundleZip(pages: Blob[], base: string): Promise<Blob> {
  const entries = await Promise.all(
    pages.map(async (blob, i) => ({
      name: pageFilename(base, i, pages.length),
      data: new Uint8Array(await blob.arrayBuffer()),
    })),
  )
  return makeZip(entries)
}

export async function shareBundle(pages: Blob[], base: string, text: string) {
  const files = pages.map(
    (blob, i) => new File([blob], pageFilename(base, i, pages.length), { type: 'image/png' }),
  )
  if (navigator.canShare?.({ files })) {
    await navigator.share({ files, text })
    return true
  }
  return false
}
