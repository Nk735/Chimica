import rawQuestions from './chemistry-questions.txt?raw'
import { parseChemistryQuestions } from './parseQuestions'
import type { ChemistryQuestion } from '../types/quiz'

export const questions = parseChemistryQuestions(rawQuestions)

export const questionsByTopic = questions.reduce<Record<string, ChemistryQuestion[]>>(
  (grouped, question) => {
    grouped[question.topic] ??= []
    grouped[question.topic].push(question)
    return grouped
  },
  {},
)
