export type QuestionKind = 'multiple-choice' | 'true-false'

export interface ChemistryQuestion {
  id: string
  topic: string
  prompt: string
  type: QuestionKind
  options: string[]
  correctAnswer: string
  explanation: string
}

export interface AnswerRecord {
  questionId: string
  selectedAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

export interface QuizResult {
  mode: 'practice' | 'mistakes'
  totalQuestions: number
  answeredQuestions: number
  correctAnswers: number
  wrongQuestionIds: string[]
  xpEarned: number
  livesRemaining: number
  answerHistory: AnswerRecord[]
}

export interface PracticeConfiguration {
  chapters: string[]
  questionLimit: number
  durationMinutes: number
}
