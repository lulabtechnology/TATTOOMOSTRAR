import type { PriceInput } from './types'

const RATE_PER_HOUR = 80 // USD/h (demo)
const SHOP_MINIMUM = 60 // mínimo de tienda

const styleFactor: Record<string, number> = {
  caricatura: 0.8,
  realismo_caras: 1.5,
  mascotas: 1.2,
  nombres_letras: 0.6,
  geometrico: 1.0,
}

const bodyFactor: Record<string, number> = {
  brazo: 1.0,
  antebrazo: 0.9,
  muñeca: 0.8,
  mano: 1.2,
  pecho: 1.1,
  espalda: 1.2,
  hombro: 1.0,
  pantorrilla: 1.0,
  tobillo: 0.9,
  cuello: 1.3,
  costillas: 1.4
}

export function areaSqIn(input: PriceInput){
  if(input.sizePreset){
    const [w,h] = input.sizePreset.split('x').map(Number)
    return w*h
  }
  if(input.widthIn && input.heightIn){
    return input.widthIn * input.heightIn
  }
  return 0
}

export function computePrice(input: PriceInput){
  const area = Math.max(1, areaSqIn(input))
  const s = styleFactor[input.style] ?? 1.0
  const b = bodyFactor[input.bodyPart] ?? 1.0
  const extra = Math.min(Math.max(input.complexityScore ?? 1.0, 0), 2) * 0.2 // 0..0.4

  // Horas estimadas proporcional al área y complejidad
  let hours = (area * (s + extra) * b) / 12 // calibrado
  if(hours < 0.5) hours = 0.5
  // redondeo a 0.5h
  hours = Math.round(hours*2)/2

  const baseCost = Math.round((area/12) * RATE_PER_HOUR)
  const complexityCost = Math.round(RATE_PER_HOUR * (s-1 + extra) * (area/12))
  const bodyPartCost = Math.round((b-1) * RATE_PER_HOUR * (area/12))
  let subtotal = Math.max(Math.round(hours * RATE_PER_HOUR), SHOP_MINIMUM)

  // Ajuste por mínimo de tienda
  const shopMinAdj = subtotal < SHOP_MINIMUM ? (SHOP_MINIMUM - subtotal) : 0
  const total = Math.max(subtotal, SHOP_MINIMUM)
  const deposit = Math.max(50, Math.round(total * 0.2))

  return {
    total,
    breakdown: {
      area,
      hours,
      ratePerHour: RATE_PER_HOUR,
      baseCost: Math.max(0, baseCost),
      complexityCost: Math.max(0, complexityCost),
      bodyPartCost: Math.max(0, bodyPartCost),
      shopMinAdj,
      deposit
    }
  }
}
