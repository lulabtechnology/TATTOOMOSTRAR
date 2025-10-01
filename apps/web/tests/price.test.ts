import { describe, it, expect } from 'vitest'
import { computePrice } from '../lib/price'


describe('computePrice', ()=>{
it('2x2 caricatura antebrazo', ()=>{
const res = computePrice({ style:'caricatura', bodyPart:'antebrazo', widthIn:null, heightIn:null, sizePreset:'2x2', complexityScore:1 })
expect(res.total).toBeGreaterThanOrEqual(60)
})
it('6x6 realismo caras costillas (caro)', ()=>{
const res = computePrice({ style:'realismo_caras', bodyPart:'costillas', widthIn:null, heightIn:null, sizePreset:'6x6', complexityScore:1.8 })
expect(res.total).toBeGreaterThan(200)
})
})
