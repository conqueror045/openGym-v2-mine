/* Personal fork: move logged sets from one exercise to another (a custom exercise that turned out
 * to exist in the library, or the wrong one picked). Sets, weights and reps stay as they are; only
 * the exercise they belong to changes. Two entries of the same exercise in one workout are joined. */

/** Workouts (newest first) that hold `exId`. */
export const workoutsWith = (S, exId) =>
  (S.workouts || []).filter(w => (w.entries || []).some(e => e.id === exId)).slice().reverse()

/** Mutates `S`: every entry of `fromId` in the chosen workouts (all when `ids` is null) becomes
 *  `toId`. Returns how many workouts changed. */
export function replaceExercise(S, fromId, toId, ids = null) {
  if (!fromId || !toId || fromId === toId) return 0
  let n = 0
  for (const w of S.workouts || []) {
    if (ids && !ids.has(w.id)) continue
    if (!(w.entries || []).some(e => e.id === fromId)) continue
    const out = []
    for (const e of w.entries) {
      if (e.id === fromId) {
        e.id = toId
        if (e.target && e.target.id === fromId) e.target.id = toId
      }
      const same = out.find(o => o.id === e.id)
      if (same) {
        same.sets = [...(same.sets || []), ...(e.sets || [])]
        if ((Number(e.topW) || 0) > (Number(same.topW) || 0)) same.topW = e.topW
      } else out.push(e)
    }
    w.entries = out
    if (Array.isArray(w.prs)) w.prs = [...new Set(w.prs.map(p => (p === fromId ? toId : p)))]
    n++
  }
  return n
}
