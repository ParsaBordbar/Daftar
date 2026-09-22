
const MAX_EDGE = 2600
const MAX_PNG_CHARS = 3_000_000

const readAsDataUrl = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(r.error)
    r.readAsDataURL(file)
  })

export async function readImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('not an image')
  if (file.type === 'image/svg+xml') return readAsDataUrl(file)

  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    const k = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight))
    const w = Math.max(1, Math.round(img.naturalWidth * k))
    const h = Math.max(1, Math.round(img.naturalHeight * k))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('no canvas')
    ctx.drawImage(img, 0, 0, w, h)

    const mayHaveAlpha = /png|webp|gif/.test(file.type)
    if (mayHaveAlpha) {
      const png = canvas.toDataURL('image/png')
      if (png.length <= MAX_PNG_CHARS) return png
    }
    return canvas.toDataURL('image/jpeg', 0.86)
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function imageFrom(dt: DataTransfer | null | undefined): File | null {
  if (!dt) return null
  for (const item of dt.items ?? []) {
    if (item.kind === 'file' && item.type.startsWith('image/')) return item.getAsFile()
  }
  for (const f of dt.files ?? []) if (f.type.startsWith('image/')) return f
  return null
}
