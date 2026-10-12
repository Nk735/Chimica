import type { ChemistryQuestion, QuizResult } from '../types/quiz'

interface HomeScreenProps {
  questionsByTopic: Record<string, ChemistryQuestion[]>
  lastResult: QuizResult | null
  onStartPractice: () => void
}

export const HomeScreen = ({ questionsByTopic, lastResult, onStartPractice }: HomeScreenProps) => {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <header className="rounded-3xl bg-gradient-to-r from-green-500 to-emerald-400 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-50">Chimica Practice</p>
        <h1 className="mt-2 text-4xl font-extrabold">Study chemistry like a game</h1>
        <p className="mt-3 max-w-2xl text-green-50">
          Practice exam-style questions, keep your lives, and stack XP as you master each chapter.
        </p>
        <button
          type="button"
          onClick={onStartPractice}
          className="mt-6 rounded-full bg-white px-6 py-3 text-base font-bold text-green-600 transition hover:scale-[1.02]"
        >
          Start Practice
        </button>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {Object.entries(questionsByTopic).map(([topic, topicQuestions]) => (
          <article key={topic} className="rounded-3xl border-2 border-green-100 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">{topic}</h2>
            <p className="mt-2 text-slate-600">{topicQuestions.length} questions available</p>
          </article>
        ))}
      </div>

      {lastResult && (
        <section className="mt-8 rounded-3xl border-2 border-amber-200 bg-amber-50 p-6 text-slate-900">
          <h3 className="text-lg font-bold">Last session summary</h3>
          <p className="mt-2">XP earned: {lastResult.xpEarned}</p>
          <p>
            Accuracy:{' '}
            {lastResult.answeredQuestions > 0
              ? Math.round((lastResult.correctAnswers / lastResult.answeredQuestions) * 100)
              : 0}
            %
          </p>
          <p>Mistakes to review: {lastResult.wrongQuestionIds.length}</p>
        </section>
      )}
    </section>
  )
}
