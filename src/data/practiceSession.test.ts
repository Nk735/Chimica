import test from 'node:test'
import assert from 'node:assert/strict'

import { getQuestionsForMode } from './practiceSession.ts'

test('returns all questions for the full practice mode', () => {
  const questions = [
    { id: 'q-1', topic: 'Atomic Structure' },
    { id: 'q-2', topic: 'Chemical Bonding' },
  ]

  assert.deepEqual(getQuestionsForMode(questions, 'all'), questions)
})

test('returns only the selected chapter questions for chapter mode', () => {
  const questions = [
    { id: 'q-1', topic: 'Atomic Structure' },
    { id: 'q-2', topic: 'Chemical Bonding' },
    { id: 'q-3', topic: 'Atomic Structure' },
  ]

  assert.deepEqual(getQuestionsForMode(questions, 'Atomic Structure'), [
    { id: 'q-1', topic: 'Atomic Structure' },
    { id: 'q-3', topic: 'Atomic Structure' },
  ])
})
