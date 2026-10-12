import { LivesDisplay } from '../components/LivesDisplay'
import { ProgressBar } from '../components/ProgressBar'
import { QuestionCard } from '../components/QuestionCard'
import { useQuizSession } from '../hooks/useQuizSession'
import type { ChemistryQuestion, QuizResult } from '../types/quiz'

interface QuizScreenProps {
  mode: 'practice' | 'mistakes'
  questions: ChemistryQuestion[]
  onFinish: (result: QuizResult) => void
  onInterrupt: () => void
  durationMinutes: number
}

export const QuizScreen = ({ mode, questions, onFinish, onInterrupt, durationMinutes }: QuizScreenProps) => {
  const {
    currentQuestion,
    questionNumber,
    totalQuestions,
    lives,
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
    isLastQuestion,
  } = useQuizSession({ questions, mode })

  if (!currentQuestion) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 py-10 text-center">
        <h2 className="text-2xl font-bold text-slate-900">No questions available for this mode.</h2>
        <button
          type="button"
          onClick={onInterrupt}
          className="rounded-full bg-slate-200 px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-300"
        >
          Torna alla home
        </button>
      </section>
    )
  }

  const nextLabel = isComplete || isLastQuestion || lives === 0 ? 'View Results' : 'Next'

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <header className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-4">
          <LivesDisplay lives={lives} />
          <div className="flex items-center gap-3">
            <p className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">XP {xp}</p>
            <button type="button" onClick={onInterrupt} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-200">
              Interrompi
            </button>
          </div>
        </div>
        <ProgressBar progress={progress} />
        <p className="mt-3 text-sm font-semibold text-slate-500">
        Question {questionNumber} of {totalQuestions} · Tempo prova: {durationMinutes} min
        </p>
      </header>

      <QuestionCard
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        feedback={feedback}
        onAnswerSelect={selectAnswer}
      />

      {selectedAnswer !== null && !hasAnsweredCurrent && (
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={confirmAnswer} className="flex-1 rounded-full bg-green-500 px-6 py-3 text-base font-bold text-white transition hover:bg-green-600">
            Conferma risposta
          </button>
          <button type="button" onClick={clearSelection} className="rounded-full bg-slate-100 px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-200">
            Cambia risposta
          </button>
        </div>
      )}

      {hasAnsweredCurrent && (
        <button
          type="button"
          onClick={() => {
            if (isComplete || isLastQuestion || lives === 0) {
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

      {selectedAnswer === null && !hasAnsweredCurrent && (
        <button type="button" onClick={deferCurrentQuestion} className="rounded-full border-2 border-amber-300 bg-amber-50 px-6 py-3 text-base font-bold text-amber-800 hover:bg-amber-100">
          Lascia per la fine
        </button>
      )}
    </section>
  )
}
