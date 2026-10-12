import { useEffect, useMemo, useState } from 'react'
import { chapterDescriptions } from '../data/questions'
import type { ChemistryQuestion, PracticeConfiguration, QuizResult } from '../types/quiz'

interface HomeScreenProps {
  questionsByTopic: Record<string, ChemistryQuestion[]>
  lastResult: QuizResult | null
  onStartPractice: (configuration: PracticeConfiguration) => void
  onStartChapterPractice: (topic: string, paragraph?: string, questionLimit?: number) => void
}

const getParagraphsForChapter = (questions: ChemistryQuestion[]) => {
  const grouped = new Map<string, ChemistryQuestion[]>()

  for (const question of questions) {
    const paragraphQuestions = grouped.get(question.topic) ?? []
    paragraphQuestions.push(question)
    grouped.set(question.topic, paragraphQuestions)
  }

  return Array.from(grouped.entries()).map(([paragraph, paragraphQuestions]) => ({
    paragraph,
    count: paragraphQuestions.length,
  }))
}

const chapterColors = ['coral', 'blue', 'violet', 'orange', 'teal']

export const HomeScreen = ({
  questionsByTopic,
  lastResult,
  onStartPractice,
  onStartChapterPractice,
}: HomeScreenProps) => {
  const [selectedParagraph, setSelectedParagraph] = useState<{
    chapter: string
    paragraph: string
    count: number
  } | null>(null)
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false)
  const [practiceQuestions, setPracticeQuestions] = useState(20)
  const [practiceDuration, setPracticeDuration] = useState(30)
  const [selectedChapters, setSelectedChapters] = useState<string[]>(() => Object.keys(questionsByTopic))

  const chapterMenus = useMemo(
    () =>
      Object.entries(questionsByTopic).map(([chapter, chapterQuestions], index) => ({
        chapter,
        paragraphs: getParagraphsForChapter(chapterQuestions),
        totalQuestions: chapterQuestions.length,
        color: chapterColors[index % chapterColors.length],
      })),
    [questionsByTopic],
  )

  const totalQuestions = Object.values(questionsByTopic).reduce((total, chapterQuestions) => total + chapterQuestions.length, 0)
  const selectedQuestionCount = selectedChapters.reduce(
    (total, chapter) => total + (questionsByTopic[chapter]?.length ?? 0),
    0,
  )

  useEffect(() => {
    if (!selectedParagraph) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedParagraph(null)
    }
    document.addEventListener('keydown', closeOnEscape)
    document.body.classList.add('modal-open')

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.classList.remove('modal-open')
    }
  }, [selectedParagraph])

  return (
    <div className="home-shell">
      <div className="lab-doodles" aria-hidden="true">
        <span className="doodle-shelf" />
        <span className="doodle-flask doodle-flask-one" />
        <span className="doodle-flask doodle-flask-two" />
        <span className="doodle-bubble bubble-one" />
        <span className="doodle-bubble bubble-two" />
        <span className="doodle-atom">✦</span>
      </div>

      <header className="home-header">
        <div className="brand-mark" aria-hidden="true">⚗</div>
        <div>
          <p className="eyebrow">Chimica · il tuo laboratorio</p>
          <h1>Impara la chimica, <span>un esperimento alla volta.</span></h1>
          <p className="home-intro">
            Segui il percorso, sblocca i paragrafi e conquista il prossimo capitolo.
          </p>
        </div>
        <button type="button" className="all-practice-button" onClick={() => setIsPracticeModalOpen(true)}>
          Allenati
          <span aria-hidden="true">→</span>
        </button>
      </header>

      <div className="lab-counter" aria-label={`${chapterMenus.length} capitoli disponibili`}>
        <span className="counter-dot" />
        <strong>{chapterMenus.length} capitoli</strong>
        <span>·</span>
        <span>il tuo percorso di scoperta</span>
      </div>

      <main className="chapter-scroller">
        {chapterMenus.map(({ chapter, paragraphs, totalQuestions, color }, chapterIndex) => (
          <section className={`chapter-section chapter-${color}`} id={`chapter-${chapterIndex + 1}`} key={chapter}>
            <div className="chapter-card">
              <div className="chapter-heading">
                <div className="chapter-number">{String(chapterIndex + 1).padStart(2, '0')}</div>
                <div>
                  <p className="chapter-kicker">Capitolo {chapterIndex + 1}</p>
                  <h2>{chapter.replace(/^Capitolo \d+\s*/, '')}</h2>
                  <p className="chapter-description">
                    {chapterDescriptions[chapter] ?? 'Esplora i concetti fondamentali della chimica.'}
                  </p>
                </div>
                <div className="question-total">
                  <strong>{totalQuestions}</strong>
                  <span>domande</span>
                </div>
              </div>

              <div className="chapter-path" aria-label={`Paragrafi di ${chapter}`}>
                {paragraphs.map(({ paragraph, count }, paragraphIndex) => (
                  <div className="path-stop" key={paragraph}>
                    {paragraphIndex > 0 && <span className="path-line" aria-hidden="true" />}
                    <button
                      type="button"
                      className="paragraph-node"
                      onClick={() => setSelectedParagraph({ chapter, paragraph, count })}
                      aria-label={`Apri ${paragraph}`}
                    >
                      <span className="node-icon" aria-hidden="true">
                        {paragraphIndex === 0 ? '★' : paragraphIndex === paragraphs.length - 1 ? '⚗' : '✦'}
                      </span>
                    </button>
                    <div className="paragraph-label">
                      <strong>{paragraph}</strong>
                      <span>{count} {count === 1 ? 'domanda' : 'domande'}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="chapter-hint">Scegli un paragrafo per scoprire cosa ti aspetta</p>
            </div>
          </section>
        ))}
      </main>

      {lastResult && (
        <section className="last-session">
          <div className="last-session-icon" aria-hidden="true">✓</div>
          <div>
            <p className="eyebrow">Ultimo esperimento</p>
            <h2>Hai guadagnato {lastResult.xpEarned} XP</h2>
            <p>
              {lastResult.answeredQuestions > 0
                ? Math.round((lastResult.correctAnswers / lastResult.answeredQuestions) * 100)
                : 0}% di risposte corrette · {lastResult.wrongQuestionIds.length} da ripassare
            </p>
          </div>
        </section>
      )}

      {selectedParagraph && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedParagraph(null)}>
          <section
            className={`paragraph-modal chapter-${chapterMenus.find(({ chapter }) => chapter === selectedParagraph.chapter)?.color ?? 'teal'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="paragraph-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={() => setSelectedParagraph(null)} aria-label="Chiudi">
              ×
            </button>
            <div className="modal-badge" aria-hidden="true">✦</div>
            <p className="chapter-kicker">{selectedParagraph.chapter}</p>
            <h2 id="paragraph-modal-title">{selectedParagraph.paragraph}</h2>
            <p className="modal-description">
              In questo paragrafo esplorerai {selectedParagraph.paragraph.toLowerCase()}, con esempi e domande
              per fissare ogni concetto importante.
            </p>
            <div className="modal-meta">
              <span>◎</span> {selectedParagraph.count} {selectedParagraph.count === 1 ? 'domanda' : 'domande'} di allenamento
            </div>
            <button
              type="button"
              className="modal-start"
              onClick={() => {
                onStartChapterPractice(selectedParagraph.chapter, selectedParagraph.paragraph)
                setSelectedParagraph(null)
              }}
            >
              Inizia il quiz <span aria-hidden="true">→</span>
            </button>
          </section>
        </div>
      )}

      {isPracticeModalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsPracticeModalOpen(false)}>
          <section
            className="practice-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="practice-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={() => setIsPracticeModalOpen(false)} aria-label="Chiudi">×</button>
            <p className="eyebrow">Laboratorio libero</p>
            <h2 id="practice-modal-title">Prepara il tuo allenamento</h2>
            <p className="practice-modal-intro">
              Scegli quanto vuoi allenarti e quali capitoli mettere alla prova.
            </p>

            <div className="practice-setting">
              <div className="setting-label">
                <label htmlFor="practice-question-slider">Numero di domande</label>
                <strong>{practiceQuestions}</strong>
              </div>
              <input
                id="practice-question-slider"
                type="range"
                min="5"
                max={Math.max(5, Math.min(totalQuestions, 50))}
                step="5"
                value={Math.min(practiceQuestions, Math.max(5, selectedQuestionCount))}
                onChange={(event) => setPracticeQuestions(Number(event.target.value))}
              />
              <small>Puoi scegliere fino a {selectedQuestionCount || 0} domande disponibili</small>
            </div>

            <div className="practice-setting">
              <div className="setting-label">
                <label htmlFor="practice-time-slider">Tempo della prova</label>
                <strong>{practiceDuration} min</strong>
              </div>
              <input
                id="practice-time-slider"
                type="range"
                min="5"
                max="120"
                step="5"
                value={practiceDuration}
                onChange={(event) => setPracticeDuration(Number(event.target.value))}
              />
              <small>Da 5 minuti fino a un massimo di 2 ore</small>
            </div>

            <fieldset className="chapter-picker">
              <legend>Capitoli inclusi</legend>
              <label className="chapter-select-all">
                <input
                  type="checkbox"
                  checked={selectedChapters.length === chapterMenus.length}
                  onChange={(event) =>
                    setSelectedChapters(event.target.checked ? chapterMenus.map(({ chapter }) => chapter) : [])
                  }
                />
                Tutti i capitoli
              </label>
              <div className="chapter-checkboxes">
                {chapterMenus.map(({ chapter, color }) => (
                  <label className={`chapter-checkbox ${color}`} key={chapter}>
                    <input
                      type="checkbox"
                      checked={selectedChapters.includes(chapter)}
                      onChange={(event) =>
                        setSelectedChapters((current) =>
                          event.target.checked ? [...current, chapter] : current.filter((item) => item !== chapter),
                        )
                      }
                    />
                    <span>{chapter}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="button"
              className="modal-start"
              disabled={selectedChapters.length === 0}
              onClick={() => {
                onStartPractice({
                  chapters: selectedChapters,
                  questionLimit: Math.min(practiceQuestions, selectedQuestionCount),
                  durationMinutes: practiceDuration,
                })
                setIsPracticeModalOpen(false)
              }}
            >
              Inizia allenamento <span aria-hidden="true">→</span>
            </button>
          </section>
        </div>
      )}
    </div>
  )
}
