import type { ChemistryQuestion } from '../types/quiz'

const REQUIRED_KEYS = ['TOPIC', 'QUESTION', 'TYPE', 'OPTIONS', 'ANSWER', 'EXPLANATION'] as const

const normalizeType = (value: string): ChemistryQuestion['type'] => {
  if (value === 'true-false') {
    return 'true-false'
  }
  return 'multiple-choice'
}

export const parseChemistryQuestions = (raw: string): ChemistryQuestion[] => {
  return raw
    .trim()
    .split('\n---\n')
    .map((block, index) => {
      const entries = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const separatorIndex = line.indexOf(':')
          const key = line.slice(0, separatorIndex).trim().toUpperCase()
          const value = line.slice(separatorIndex + 1).trim()
          return [key, value] as const
        })

      const map = new Map(entries)
      for (const key of REQUIRED_KEYS) {
        if (!map.get(key)) {
          throw new Error(`Missing ${key} in question block ${index + 1}`)
        }
      }

      const options = map
        .get('OPTIONS')!
        .split('|')
        .map((option) => option.trim())
        .filter(Boolean)

      const correctAnswer = map.get('ANSWER')!
      if (!options.includes(correctAnswer)) {
        throw new Error(`Answer mismatch in question block ${index + 1}`)
      }

      return {
        id: `q-${index + 1}`,
        topic: map.get('TOPIC')!,
        prompt: map.get('QUESTION')!,
        type: normalizeType(map.get('TYPE')!.toLowerCase()),
        options,
        correctAnswer,
        explanation: map.get('EXPLANATION')!,
      }
    })
}
