import rawChaptersOneTwo from '../../banca_dati_chimica_capitoli_1_e_2.md?raw'
import rawChaptersThreeFive from '../../banca_dati_chimica_capitoli_3_4_e_5.md?raw'
import { parseChemistryDatabase } from './parseQuestions'
import type { ChemistryQuestion } from '../types/quiz'

export const chapterDescriptions: Record<string, string> = {
  'Capitolo 1': 'Fondamenti della materia, proprietà e misure.',
  'Capitolo 2': 'Elementi, simboli e struttura atomica.',
  'Capitolo 3': 'Stechiometria e bilanciamento delle reazioni.',
  'Capitolo 4': 'Soluzioni, precipitati e reazioni acido-base.',
  'Capitolo 5': 'Legami, energia e trasformazioni chimiche.',
}

export const questions = [
  ...parseChemistryDatabase(rawChaptersOneTwo, 'chapters-1-2'),
  ...parseChemistryDatabase(rawChaptersThreeFive, 'chapters-3-5'),
]

export const questionsByTopic = questions.reduce<Record<string, ChemistryQuestion[]>>(
  (grouped, question) => {
    const chapterMatch = question.topic.match(/^\d+/)
    const chapterKey = chapterMatch ? `Capitolo ${chapterMatch[0]}` : question.topic

    grouped[chapterKey] ??= []
    grouped[chapterKey].push(question)
    return grouped
  },
  {},
)
