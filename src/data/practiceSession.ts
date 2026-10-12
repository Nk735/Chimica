type TopicName = string

export type PracticeScope = 'all' | TopicName

export const getQuestionsForMode = <T extends { topic: string }>(
  questions: T[],
  selectedTopic: PracticeScope,
): T[] => {
  if (selectedTopic === 'all') {
    return questions
  }

  return questions.filter((question) => question.topic === selectedTopic)
}
