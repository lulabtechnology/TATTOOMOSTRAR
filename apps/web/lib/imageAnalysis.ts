// Análisis simple del lado del cliente (demo):
// - Lee resolución y tamaño de archivo
// - Calcula densidad de bordes con Sobel (aprox)
// - Devuelve complexityScore 0..2 basado en bordes y megapíxeles


export async function analyzeImage(file: File){
const blobUrl = URL.createObjectURL(file)
const img = await loadImage(blobUrl)
const { width, height } = img
const megapixels = (width*height)/1_000_000
const fileSizeKB = file.size/1024


// Canvas
const canvas = document.createElement('canvas')
canvas.width = width
canvas.height = height
const ctx = canvas.getContext('2d')!
ctx.drawImage(img, 0, 0)
const { data } = ctx.getImageData(0,0,width,height)


const gray = new Uint8ClampedArray(width*height)
for(let i=0;i<width*height;i++){
const r = data[i*4], g = data[i*4+1], b = data[i*4+2]
gray[i] = (0.299*r + 0.587*g + 0.114*b) | 0
}
const { magnitudeAvg } = sobel(gray, width, height)
// normalizamos: 0..255 -> 0..1
const edgeDensity = Math.min(1, magnitudeAvg / 64) // 64 ~ bordes medios


// Complexity score: bordes + megapíxeles + tamaño de archivo
let complexityScore = edgeDensity + Math.min(1, megapixels/2) * 0.5 + Math.min(1, fileSizeKB/1500) * 0.5


return { width, height, megapixels, fileSizeKB, edgeDensity, complexityScore }
}


function loadImage(src:string){
}
