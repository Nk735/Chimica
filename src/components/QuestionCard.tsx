import type { ChemistryQuestion } from '../types/quiz'

interface QuestionCardProps {
  question: ChemistryQuestion
  selectedAnswer: string | null
  feedback: 'correct' | 'incorrect' | null
  onAnswerSelect: (answer: string) => void
}

export const QuestionCard = ({
  question,
  selectedAnswer,
  feedback,
  onAnswerSelect,
}: QuestionCardProps) => {
  return (
    <article className="rounded-3xl border-2 border-green-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-green-500">{question.topic}</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">{question.prompt}</h2>
      <ul className="mt-6 space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option
          const isCorrect = option === question.correctAnswer
          const showResult = feedback !== null && isSelected

          let optionClassName = 'border-slate-200 bg-white hover:border-green-300'
          if (showResult && feedback === 'correct') {
            optionClassName = 'border-green-500 bg-green-100 text-green-900'
          }

          if (showResult && feedback === 'incorrect') {
            optionClassName = 'border-red-500 bg-red-100 text-red-900'
          }

          if (feedback === 'incorrect' && isCorrect) {
            optionClassName = 'border-green-500 bg-green-50 text-green-900'
          }

          return (
            <li key={option}>
              <button
                type="button"
                disabled={feedback !== null}
                onClick={() => onAnswerSelect(option)}
                className={`w-full rounded-2xl border-2 px-4 py-3 text-left font-medium transition ${optionClassName}`}
              >
                {option}
              </button>
            </li>
          )
        })}
      </ul>

      {feedback && (
        <div
          className={`mt-5 rounded-2xl p-4 text-sm ${
            feedback === 'correct' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
          }`}
        >
          <p className="font-semibold">{feedback === 'correct' ? 'Great job!' : 'Not quite.'}</p>
          <p className="mt-1">{question.explanation}</p>
        </div>
      )}
    </article>
  )
}
