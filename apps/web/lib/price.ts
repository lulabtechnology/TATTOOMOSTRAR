import type { PriceInput } from './types'

const RATE_PER_HOUR = 80 // USD/h (demo)
const SHOP_MINIMUM = 60  // mínimo de tienda base

// Multiplicadores por estilo (tiempo)
const styleFactor: Record<string, number> = {
  caricatura: 0.8,
  realismo_caras: 1.5,
  mascotas: 1.2,
  nombres_letras: 0.6,
  geometrico: 1.0,
}

// Multiplicadores por parte del cuerpo (tiempo)
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

// ✅ Mínimo por zona (para que la zona pese aun en piezas pequeñas)
const zoneMinimumMultiplier: Record<string, number> = {
  costillas: 1.25, // 60 * 1.25 = 75
  cuello: 1.20,    // 72
  mano: 1.15,      // 69
  pecho: 1.10,     // 66
  espalda: 1.10,   // 66
  tobillo: 1.05,   // 63
}

// ✅ Recargo fijo por zona (molestia/sensibilidad)
const zoneFixedSurcharge: Record<string, number> = {
  costillas: 20,
  cuello: 15,
  mano: 10,
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

  // Horas estimadas proporcional a área * estilo * zona * complejidad
  let hours = (area * (s + extra) * b) / 12
  if(hours < 0.5) hours = 0.5
  hours = Math.round(hours*2)/2 // redondeo a 0.5h

  // Costos "explicativos"
  const baseCost = Math.round((area/12) * RATE_PER_HOUR)
  const complexityCost = Math.round(RATE_PER_HOUR * (s-1 + extra) * (area/12))
  const bodyPartCost = Math.round((b-1) * RATE_PER_HOUR * (area/12))

  // Subtotal por tiempo
  const subtotalTime = Math.round(hours * RATE_PER_HOUR)

  // Mínimo base y mínimo por zona
  const minBase = SHOP_MINIMUM
  const minByZone = Math.round(minBase * (zoneMinimumMultiplier[input.bodyPart] ?? 1))

  // Aplicar el mínimo más alto (zona puede superar al mínimo base)
  const subtotalWithMin = Math.max(subtotalTime, minByZone)
  const zoneMinAdj = Math.max(0, subtotalWithMin - Math.max(subtotalTime, minBase))

  // Recargo fijo adicional por zona
  const zoneSurcharge = zoneFixedSurcharge[input.bodyPart] ?? 0

  const total = subtotalWithMin + zoneSurcharge
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
      shopMinAdj: Math.max(0, minBase - subtotalTime), // ajuste por mínimo base (si aplicara)
      zoneMinAdj,            // nuevo: ajuste por mínimo de zona aplicado
      zoneSurcharge,         // nuevo: recargo fijo por zona
      minBase,
      minByZone,
      deposit
    }
  }
}
