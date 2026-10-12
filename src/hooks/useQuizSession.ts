import { useMemo, useState } from 'react'
import type { AnswerRecord, ChemistryQuestion, QuizResult } from '../types/quiz'

const STARTING_LIVES = 3

interface UseQuizSessionOptions {
  questions: ChemistryQuestion[]
  mode: 'practice' | 'mistakes'
}

export const useQuizSession = ({ questions, mode }: UseQuizSessionOptions) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lives, setLives] = useState(STARTING_LIVES)
  const [xp, setXp] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([])
  const [answerHistory, setAnswerHistory] = useState<AnswerRecord[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const currentQuestion = questions[currentIndex]
  const hasAnsweredCurrent = selectedAnswer !== null

  const progress = useMemo(() => {
    if (questions.length === 0) {
      return 0
    }

    const completed = answerHistory.length
    return Math.round((completed / questions.length) * 100)
  }, [answerHistory.length, questions.length])

  const registerAnswer = (choice: string) => {
    if (!currentQuestion || hasAnsweredCurrent || isComplete) {
      return
    }

    const isCorrect = choice === currentQuestion.correctAnswer
    const updatedRecord: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedAnswer: choice,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    }

    setSelectedAnswer(choice)
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    setAnswerHistory((prev) => [...prev, updatedRecord])

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
      setXp((prev) => prev + 15)
      return
    }

    setLives((prev) => prev - 1)
    setXp((prev) => prev + 3)
    setWrongQuestionIds((prev) => (prev.includes(currentQuestion.id) ? prev : [...prev, currentQuestion.id]))
  }

  const goToNextQuestion = () => {
    if (!currentQuestion || !hasAnsweredCurrent || isComplete) {
      return
    }

    const isLastQuestion = currentIndex >= questions.length - 1
    const noLivesLeft = lives <= 0

    if (isLastQuestion || noLivesLeft) {
      setIsComplete(true)
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setSelectedAnswer(null)
    setFeedback(null)
  }

  const result: QuizResult = {
    mode,
    totalQuestions: questions.length,
    answeredQuestions: answerHistory.length,
    correctAnswers,
    wrongQuestionIds,
    xpEarned: xp,
    livesRemaining: Math.max(lives, 0),
    answerHistory,
  }

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    lives: Math.max(lives, 0),
    xp,
    progress,
    feedback,
    selectedAnswer,
    hasAnsweredCurrent,
    isComplete,
    result,
    registerAnswer,
    goToNextQuestion,
  }
}
