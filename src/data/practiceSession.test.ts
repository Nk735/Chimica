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

test('returns only the selected paragraph questions when a paragraph is requested', () => {
  const questions = [
    { id: 'q-1', topic: '1.1 Matter' },
    { id: 'q-2', topic: '1.2 Atoms' },
    { id: 'q-3', topic: '1.1 Matter' },
  ]

  assert.deepEqual(getQuestionsForMode(questions, '1.1 Matter'), [
    { id: 'q-1', topic: '1.1 Matter' },
    { id: 'q-3', topic: '1.1 Matter' },
  ])
})

test('limits a random chapter mix to the requested number of questions', () => {
  const questions = [
    { id: 'q-1', topic: '1.1 Matter' },
    { id: 'q-2', topic: '1.2 Atoms' },
    { id: 'q-3', topic: '1.3 Properties' },
    { id: 'q-4', topic: '1.1 Matter' },
  ]

  const result = getQuestionsForMode(questions, 'Capitolo 1', { questionLimit: 2 })

  assert.equal(result.length, 2)
  assert.ok(result.every((question) => question.topic.startsWith('1.')))
})
