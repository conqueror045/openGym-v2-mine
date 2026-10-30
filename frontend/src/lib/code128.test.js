import { describe, expect, it } from 'vitest'
import { code128Widths } from './code128.js'

describe('code 128', () => {
  it('builds start, data, check and stop symbols of the right width', () => {
    const w = code128Widths('0820')
    // start + 4 chars + check = 6 symbols of 11 modules, stop is 13
    expect(w.reduce((a, b) => a + b, 0)).toBe(6 * 11 + 13)
  })
  it('refuses what set B cannot carry', () => {
    expect(code128Widths('')).toBeNull()
    expect(code128Widths('é')).toBeNull()
  })
})
