// Personal fork: loaded bodyweight work is estimated on body + plate, then the body comes off.
import { describe, expect, it } from 'vitest'
import { bestSetOf } from './onerm.js'

const set = (w, r) => ({ w, r, done: true })

describe('bodyweight-aware 1RM', () => {
  it('reads +50 x 3 on a 71 kg lifter as the plate you could single', () => {
    const best = bestSetOf({ id: '0841', sets: [set(50, 3)] }, 'epley', 71)
    expect(best.est).toBeCloseTo(121 * (1 + 3 / 30) - 71, 1) // 62.1, not 55
  })
  it('keeps the plain reading without a body weight', () => {
    expect(bestSetOf({ id: '0841', sets: [set(50, 3)] }, 'epley', 0).est).toBeCloseTo(55, 1)
  })
  it('leaves a barbell lift alone', () => {
    expect(bestSetOf({ id: '1162', sets: [set(50, 3)] }, 'epley', 71).est).toBeCloseTo(55, 1)
  })
})
