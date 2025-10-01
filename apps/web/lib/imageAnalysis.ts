'use client'

// Tipado del resultado
export type ImageMeta = {
  width: number
  height: number
  megapixels: number
  fileSizeKB: number
  edgeDensity: number
  complexityScore: number
}

// Análisis simple del lado del cliente (demo):
// - Lee resolución y tamaño de archivo
// - Calcula densidad de bordes con Sobel (aprox)
// - Devuelve complexityScore 0..2 basado en bordes y megapíxeles y tamaño de archivo
export async function analyzeImage(file: File): Promise<ImageMeta> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('analyzeImage debe ejecutarse en el cliente (browser)')
  }

  const blobUrl = URL.createObjectURL(file)
  const img = await loadImage(blobUrl) // ✅ Promise<HTMLImageElement>
  const { width, height } = img
  const megapixels = (width * height) / 1_000_000
  const fileSizeKB = file.size / 1024

  // Canvas en memoria
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  const { data } = ctx.getImageData(0, 0, width, height)

  // Gris rápido
  const gray = new Uint8ClampedArray(width * height)
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2]
    gray[i] = (0.299 * r + 0.587 * g + 0.114 * b) | 0
  }

  const { magnitudeAvg } = sobel(gray, width, height)
  const edgeDensity = Math.min(1, magnitudeAvg / 64) // 64 ~ bordes medios

  // Complexity score: bordes + megapíxeles + tamaño de archivo
  const complexityScore =
    edgeDensity +
    Math.min(1, megapixels / 2) * 0.5 +
    Math.min(1, fileSizeKB / 1500) * 0.5

  return { width, height, megapixels, fileSizeKB, edgeDensity, complexityScore }
}

// ✅ Tipado explícito para evitar inferencia a void
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img as HTMLImageElement)
    img.onerror = (e) => reject(e)
    img.src = src
  })
}

// Operador Sobel (promedio de magnitudes)
function sobel(gray: Uint8ClampedArray, w: number, h: number) {
  const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
  const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1]
  let sum = 0
  let count = 0
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let sx = 0, sy = 0
      let k = 0
      for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
          const idx = (y + j) * w + (x + i)
          const g = gray[idx]
          sx += g * gx[k]
          sy += g * gy[k]
          k++
        }
      }
      const mag = Math.sqrt(sx * sx + sy * sy)
      sum += mag
      count++
    }
  }
  const magnitudeAvg = sum / Math.max(1, count)
  return { magnitudeAvg }
}
