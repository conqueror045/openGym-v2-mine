import { describe, expect, it } from 'vitest'
import { replaceExercise, workoutsWith } from './replace-exercise.js'

const S = () => ({
  workouts: [
    { id: 'a', entries: [{ id: 'old', sets: [{ w: 50, r: 3 }], topW: 50 }], prs: ['old'] },
    { id: 'b', entries: [{ id: 'old', sets: [{ w: 40, r: 5 }] }, { id: 'new', sets: [{ w: 30, r: 7 }] }] },
    { id: 'c', entries: [{ id: 'other', sets: [] }] },
  ],
})

describe('replace exercise in past workouts', () => {
  it('moves every set to the new exercise, keeping the numbers', () => {
    const s = S()
    expect(replaceExercise(s, 'old', 'new')).toBe(2)
    expect(s.workouts[0].entries[0]).toMatchObject({ id: 'new', sets: [{ w: 50, r: 3 }] })
    expect(s.workouts[0].prs).toEqual(['new'])
  })
  it('joins two entries of the same exercise in one workout', () => {
    const s = S()
    replaceExercise(s, 'old', 'new')
    expect(s.workouts[1].entries).toHaveLength(1)
    expect(s.workouts[1].entries[0].sets).toHaveLength(2)
  })
  it('touches only the chosen workouts', () => {
    const s = S()
    expect(replaceExercise(s, 'old', 'new', new Set(['b']))).toBe(1)
    expect(s.workouts[0].entries[0].id).toBe('old')
    expect(workoutsWith(s, 'old').map(w => w.id)).toEqual(['a'])
  })
})
