import type { ChemistryQuestion, QuizResult } from '../types/quiz'

interface ResultsScreenProps {
  result: QuizResult
  allQuestions: ChemistryQuestion[]
  onPracticeAgain: () => void
  onReviewMistakes: () => void
  onBackHome: () => void
}

export const ResultsScreen = ({
  result,
  allQuestions,
  onPracticeAgain,
  onReviewMistakes,
  onBackHome,
}: ResultsScreenProps) => {
  const accuracy = result.answeredQuestions > 0 ? Math.round((result.correctAnswers / result.answeredQuestions) * 100) : 0

  const wrongQuestions = allQuestions.filter((question) => result.wrongQuestionIds.includes(question.id))

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <article className="rounded-3xl border-2 border-green-100 bg-white p-8 text-center shadow-sm">
        <h1 className="text-4xl font-extrabold text-slate-900">Session Complete 🎉</h1>
        <p className="mt-4 text-slate-600">Here is your chemistry practice summary.</p>
        <dl className="mt-8 grid gap-4 text-left sm:grid-cols-2">
          <div className="rounded-2xl bg-green-50 p-4">
            <dt className="text-sm font-semibold text-green-700">Score</dt>
            <dd className="text-2xl font-bold text-green-900">
              {result.correctAnswers}/{result.answeredQuestions}
            </dd>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4">
            <dt className="text-sm font-semibold text-amber-700">Accuracy</dt>
            <dd className="text-2xl font-bold text-amber-900">{accuracy}%</dd>
          </div>
          <div className="rounded-2xl bg-sky-50 p-4">
            <dt className="text-sm font-semibold text-sky-700">XP Earned</dt>
            <dd className="text-2xl font-bold text-sky-900">{result.xpEarned}</dd>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4">
            <dt className="text-sm font-semibold text-rose-700">Lives Remaining</dt>
            <dd className="text-2xl font-bold text-rose-900">{result.livesRemaining}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onPracticeAgain}
            className="rounded-full bg-green-500 px-5 py-3 font-semibold text-white transition hover:bg-green-600"
          >
            Practice Again
          </button>
          <button
            type="button"
            disabled={wrongQuestions.length === 0}
            onClick={onReviewMistakes}
            className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Review Mistakes
          </button>
          <button
            type="button"
            onClick={onBackHome}
            className="rounded-full bg-slate-200 px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-300"
          >
            Back Home
          </button>
        </div>
      </article>

      {wrongQuestions.length > 0 && (
        <section className="mt-6 rounded-3xl border-2 border-red-100 bg-red-50 p-6">
          <h2 className="text-xl font-bold text-red-900">Questions to review</h2>
          <ul className="mt-4 space-y-3">
            {wrongQuestions.map((question) => (
              <li key={question.id} className="rounded-2xl bg-white p-4">
                <p className="text-sm font-semibold text-red-700">{question.topic}</p>
                <p className="font-medium text-slate-900">{question.prompt}</p>
                <p className="mt-2 text-sm text-slate-600">Correct answer: {question.correctAnswer}</p>
                <p className="text-sm text-slate-600">{question.explanation}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}
