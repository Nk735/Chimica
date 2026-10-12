import { LivesDisplay } from '../components/LivesDisplay'
import { ProgressBar } from '../components/ProgressBar'
import { QuestionCard } from '../components/QuestionCard'
import { useQuizSession } from '../hooks/useQuizSession'
import type { ChemistryQuestion, QuizResult } from '../types/quiz'

interface QuizScreenProps {
  mode: 'practice' | 'mistakes'
  questions: ChemistryQuestion[]
  onFinish: (result: QuizResult) => void
}

export const QuizScreen = ({ mode, questions, onFinish }: QuizScreenProps) => {
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    lives,
    xp,
    progress,
    feedback,
    selectedAnswer,
    hasAnsweredCurrent,
    isComplete,
    result,
    registerAnswer,
    goToNextQuestion,
  } = useQuizSession({ questions, mode })

  if (!currentQuestion) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10 text-center">
        <h2 className="text-2xl font-bold text-slate-900">No questions available for this mode.</h2>
      </section>
    )
  }

  const nextLabel = isComplete || currentIndex === totalQuestions - 1 || lives === 0 ? 'View Results' : 'Next'

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <header className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-4">
          <LivesDisplay lives={lives} />
          <p className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">XP {xp}</p>
        </div>
        <ProgressBar progress={progress} />
        <p className="mt-3 text-sm font-semibold text-slate-500">
          Question {Math.min(currentIndex + 1, totalQuestions)} of {totalQuestions}
        </p>
      </header>

      <QuestionCard
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        feedback={feedback}
        onAnswerSelect={registerAnswer}
      />

      {hasAnsweredCurrent && (
        <button
          type="button"
          onClick={() => {
            if (isComplete || currentIndex === totalQuestions - 1 || lives === 0) {
              onFinish(result)
              return
            }

            goToNextQuestion()
          }}
          className="rounded-full bg-green-500 px-6 py-3 text-base font-bold text-white transition hover:bg-green-600"
        >
          {nextLabel}
        </button>
      )}
    </section>
  )
}
