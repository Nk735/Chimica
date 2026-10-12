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
  const [unansweredIndices, setUnansweredIndices] = useState(() => questions.map((_, index) => index))
  const [deferredIndices, setDeferredIndices] = useState<number[]>([])

  const activeIndex = unansweredIndices[0] ?? deferredIndices[0]
  const currentQuestion = activeIndex === undefined ? undefined : questions[activeIndex]
  const hasAnsweredCurrent = feedback !== null

  const progress = useMemo(() => {
    if (questions.length === 0) {
      return 0
    }

    const completed = answerHistory.length
    return Math.round((completed / questions.length) * 100)
  }, [answerHistory.length, questions.length])

  const selectAnswer = (choice: string) => {
    if (!currentQuestion || feedback !== null || isComplete) {
      return
    }

    setSelectedAnswer(choice)
  }

  const clearSelection = () => {
    if (!hasAnsweredCurrent && !isComplete) {
      setSelectedAnswer(null)
    }
  }

  const confirmAnswer = () => {
    if (!currentQuestion || selectedAnswer === null || hasAnsweredCurrent || isComplete) {
      return
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    const updatedRecord: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    }

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

  const moveCurrentToNext = () => {
    if (!currentQuestion || isComplete) {
      return
    }

    const isDeferred = unansweredIndices.length === 0
    if (isDeferred) {
      setDeferredIndices((prev) => prev.slice(1))
    } else {
      setUnansweredIndices((prev) => prev.slice(1))
    }

    setCurrentIndex((prev) => prev + 1)
    setSelectedAnswer(null)
    setFeedback(null)
  }

  const goToNextQuestion = () => {
    if (!currentQuestion || !hasAnsweredCurrent || isComplete) {
      return
    }

    const hasMoreQuestions =
      unansweredIndices.length > 0
        ? unansweredIndices.length > 1 || deferredIndices.length > 0
        : deferredIndices.length > 1
    const noLivesLeft = lives <= 0

    if (!hasMoreQuestions || noLivesLeft) {
      if (unansweredIndices.length > 0) {
        setUnansweredIndices((prev) => prev.slice(1))
      } else {
        setDeferredIndices((prev) => prev.slice(1))
      }
      setIsComplete(true)
      return
    }

    moveCurrentToNext()
  }

  const deferCurrentQuestion = () => {
    if (!currentQuestion || hasAnsweredCurrent || isComplete || unansweredIndices.length === 0) {
      return
    }

    setUnansweredIndices((prev) => prev.slice(1))
    setDeferredIndices((prev) => [...prev, activeIndex])
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
    currentIndex: activeIndex ?? currentIndex,
    questionNumber: Math.min(answerHistory.length + 1, questions.length),
    totalQuestions: questions.length,
    lives: Math.max(lives, 0),
    xp,
    progress,
    feedback,
    selectedAnswer,
    hasAnsweredCurrent,
    isComplete,
    result,
    selectAnswer,
    clearSelection,
    confirmAnswer,
    deferCurrentQuestion,
    goToNextQuestion,
    isLastQuestion:
      (unansweredIndices.length > 0 && unansweredIndices.length === 1 && deferredIndices.length === 0) ||
      (unansweredIndices.length === 0 && deferredIndices.length <= 1),
  }
}
