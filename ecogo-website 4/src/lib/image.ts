/**
 * Shrinks a photo before upload so product pages stay fast on mobile data.
 * Phone photos are often 4 to 8 MB; this brings them to roughly 100 to 300 KB.
 */
export async function prepareImage(file: File, maxSide = 1200): Promise<{ blob: Blob; ext: 'webp' | 'jpg' }> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file (JPG, PNG or WebP).')
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('This browser cannot process images.')
  ctx.fillStyle = '#ffffff' // flatten transparent PNGs onto white
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const toBlob = (type: string, quality: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))

  const webp = await toBlob('image/webp', 0.82)
  if (webp && webp.type === 'image/webp') return { blob: webp, ext: 'webp' }
  const jpg = await toBlob('image/jpeg', 0.85)
  if (!jpg) throw new Error('Could not process that image. Try a different one.')
  return { blob: jpg, ext: 'jpg' }
}
