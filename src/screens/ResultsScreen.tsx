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

  const questionById = new Map(allQuestions.map((question) => [question.id, question]))
  const answeredQuestions = result.answerHistory
    .map((answer) => ({ answer, question: questionById.get(answer.questionId) }))
    .filter((item): item is { answer: (typeof result.answerHistory)[number]; question: ChemistryQuestion } => item.question !== undefined)

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <article className="rounded-3xl border-2 border-green-100 bg-white p-8 text-center shadow-sm">
        <h1 className="text-4xl font-extrabold text-slate-900">Quiz completato 🎉</h1>
        <p className="mt-4 text-slate-600">Ecco come è andato il tuo allenamento.</p>
        <dl className="mt-8 grid gap-4 text-left sm:grid-cols-2">
          <div className="rounded-2xl bg-green-50 p-4">
            <dt className="text-sm font-semibold text-green-700">Score</dt>
            <dd className="text-2xl font-bold text-green-900">
              {result.correctAnswers}/{result.totalQuestions}
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
            disabled={result.wrongQuestionIds.length === 0}
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

      <section className="mt-6 rounded-3xl border-2 border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">Recap delle risposte</h2>
        <p className="mt-1 text-sm text-slate-600">
          {result.correctAnswers} corrette su {result.answeredQuestions} risposte date · {accuracy}% di precisione
        </p>
        <ul className="mt-4 space-y-3">
          {answeredQuestions.map(({ answer, question }, index) => (
            <li
              key={answer.questionId}
              className={`rounded-2xl border p-4 ${
                answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`recap-status ${answer.isCorrect ? 'recap-correct' : 'recap-wrong'}`} aria-hidden="true">
                  {answer.isCorrect ? '✓' : '×'}
                </span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold uppercase tracking-wide ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    Domanda {index + 1} · {answer.isCorrect ? 'Corretta' : 'Sbagliata'}
                  </p>
                  <p className="mt-1 font-medium text-slate-900">{question.prompt}</p>
                  <p className="mt-2 text-sm text-slate-600">La tua risposta: {answer.selectedAnswer}</p>
                  {!answer.isCorrect && (
                    <p className="text-sm font-semibold text-green-700">Risposta corretta: {answer.correctAnswer}</p>
                  )}
                  <p className="mt-1 text-sm text-slate-600">{question.explanation}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
