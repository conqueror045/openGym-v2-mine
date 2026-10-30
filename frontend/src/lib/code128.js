/* Code 128 (set B) for gym cards with a 1D barcode (personal fork). Whatever symbology the card
 * was printed in, a turnstile reader decodes the same text from a Code 128 of it, so one encoder
 * covers them all. Printable ASCII only; anything else returns null. */
const P = '212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 221312 231212 112232 122132 122231 113222 123122 123221 223211 221132 221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 212123 212321 232121 111323 131123 131321 112313 132113 132311 211313 231113 231311 112133 112331 132131 113123 113321 133121 313121 211331 231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 314111 221411 431111 111224 111422 121124 121421 141122 141221 112214 112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 214121 412121 111143 111341 131141 114113 114311 411113 411311 113141 114131 311141 411131 211412 211214 211232 2331112'.split(' ')
const START_B = 104, STOP = 106

/** Bar/space widths (alternating, bar first) for `value`, or null if it is not printable ASCII. */
export function code128Widths(value) {
  const s = String(value || '')
  if (!s || /[^\x20-\x7e]/.test(s)) return null
  const codes = [START_B, ...[...s].map(c => c.charCodeAt(0) - 32)]
  const check = codes.reduce((sum, c, i) => sum + c * (i || 1), 0) % 103
  return [...codes, check, STOP].flatMap(c => [...P[c]].map(Number))
}

/** Draws the code black on white with a quiet zone; returns the module count (0 if it can't). */
export function renderCode128(canvas, value, { height = 60, quiet = 10 } = {}) {
  const widths = code128Widths(value)
  if (!canvas || !widths) return 0
  const modules = widths.reduce((a, b) => a + b, 0) + 2 * quiet
  canvas.width = modules
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, modules, height)
  ctx.fillStyle = '#000000'
  let x = quiet
  widths.forEach((w, i) => { if (i % 2 === 0) ctx.fillRect(x, 0, w, height); x += w })
  return modules
}
