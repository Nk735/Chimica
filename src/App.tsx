import { useMemo, useState } from 'react'
import { questions, questionsByTopic } from './data/questions'
import { getQuestionsForMode } from './data/practiceSession'
import { HomeScreen } from './screens/HomeScreen'
import { QuizScreen } from './screens/QuizScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import type { QuizResult } from './types/quiz'

type AppScreen = 'home' | 'quiz' | 'results'

function App() {
  const [screen, setScreen] = useState<AppScreen>('home')
  const [mode, setMode] = useState<'practice' | 'mistakes'>('practice')
  const [selectedTopic, setSelectedTopic] = useState<'all' | string | string[]>('all')
  const [selectedQuestionLimit, setSelectedQuestionLimit] = useState<number | null>(null)
  const [practiceDuration, setPracticeDuration] = useState(30)
  const [result, setResult] = useState<QuizResult | null>(null)

  const mistakeQuestions = useMemo(() => {
    if (!result) {
      return []
    }

    return questions.filter((question) => result.wrongQuestionIds.includes(question.id))
  }, [result])

  const sessionQuestions = useMemo(() => {
    if (mode === 'mistakes') {
      return mistakeQuestions
    }

    const questionLimit = selectedQuestionLimit ?? undefined
    return getQuestionsForMode(questions, selectedTopic, { questionLimit })
  }, [mode, mistakeQuestions, selectedQuestionLimit, selectedTopic])

  return (
    <main className="min-h-screen bg-[#f3fbf8] text-slate-900">
      {screen === 'home' && (
        <HomeScreen
          questionsByTopic={questionsByTopic}
          lastResult={result}
          onStartPractice={(configuration) => {
            setMode('practice')
            setSelectedTopic(configuration.chapters)
            setSelectedQuestionLimit(configuration.questionLimit)
            setPracticeDuration(configuration.durationMinutes)
            setScreen('quiz')
          }}
          onStartChapterPractice={(topic, paragraph, questionLimit) => {
            setMode('practice')
            setSelectedTopic(paragraph ?? topic)
            setSelectedQuestionLimit(questionLimit ?? null)
            setPracticeDuration(30)
            setScreen('quiz')
          }}
        />
      )}

      {screen === 'quiz' && (
        <QuizScreen
          mode={mode}
          questions={sessionQuestions}
          durationMinutes={practiceDuration}
          onInterrupt={() => {
            setSelectedTopic('all')
            setScreen('home')
          }}
          onFinish={(nextResult) => {
            setResult(nextResult)
            setScreen('results')
          }}
        />
      )}

      {screen === 'results' && result && (
        <ResultsScreen
          result={result}
          allQuestions={questions}
          onPracticeAgain={() => {
            setMode('practice')
            setScreen('quiz')
          }}
          onReviewMistakes={() => {
            setMode('mistakes')
            setSelectedTopic('all')
            setScreen('quiz')
          }}
          onBackHome={() => {
            setSelectedTopic('all')
            setScreen('home')
          }}
        />
      )}
    </main>
  )
}

export default App
