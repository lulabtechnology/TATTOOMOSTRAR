export type Style = 'caricatura'|'realismo_caras'|'mascotas'|'nombres_letras'|'geometrico'
export type BodyPart = 'brazo'|'antebrazo'|'muñeca'|'mano'|'pecho'|'espalda'|'hombro'|'pantorrilla'|'tobillo'|'cuello'|'costillas'


export type PriceInput = {
style: Style
bodyPart: BodyPart | string
widthIn: number | null
heightIn: number | null
sizePreset: string | null
complexityScore: number // 0..2 aprox
}
