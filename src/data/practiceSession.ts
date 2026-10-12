type TopicName = string

export type PracticeScope = 'all' | TopicName | TopicName[]

export interface QuestionSelectionOptions {
  questionLimit?: number
}

const shuffle = <T,>(items: T[]) => {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[randomIndex]] = [next[randomIndex], next[index]]
  }

  return next
}

const getChapterNumber = (selectedTopic: string) => {
  const chapterMatch = selectedTopic.match(/^Capitolo\s+(\d+)/)
  if (chapterMatch) {
    return chapterMatch[1]
  }

  const match = selectedTopic.match(/^\d+/)
  return match ? match[0] : null
}

export const getQuestionsForMode = <T extends { topic: string }>(
  questions: T[],
  selectedTopic: PracticeScope,
  options: QuestionSelectionOptions = {},
): T[] => {
  const { questionLimit } = options

  if (selectedTopic === 'all') {
    const result = questions
    if (typeof questionLimit === 'number' && questionLimit > 0) {
      return shuffle(result).slice(0, Math.min(questionLimit, result.length))
    }

    return result
  }

  if (Array.isArray(selectedTopic)) {
    const matches = questions.filter((question) =>
      selectedTopic.some((topic) => {
        const chapterNumber = getChapterNumber(topic)
        return topic === question.topic || (chapterNumber !== null && question.topic.startsWith(`${chapterNumber}.`))
      }),
    )
    if (typeof questionLimit === 'number' && questionLimit > 0) {
      return shuffle(matches).slice(0, Math.min(questionLimit, matches.length))
    }
    return matches
  }

  const exactMatches = questions.filter((question) => question.topic === selectedTopic)
  if (exactMatches.length > 0) {
    if (typeof questionLimit === 'number' && questionLimit > 0 && exactMatches.length > questionLimit) {
      return shuffle(exactMatches).slice(0, Math.min(questionLimit, exactMatches.length))
    }

    return exactMatches
  }

  const chapterNumber = getChapterNumber(selectedTopic)
  const matches = chapterNumber
    ? questions.filter((question) => question.topic.startsWith(`${chapterNumber}.`))
    : []

  if (typeof questionLimit === 'number' && questionLimit > 0 && matches.length > questionLimit) {
    return shuffle(matches).slice(0, Math.min(questionLimit, matches.length))
  }

  return matches
}
