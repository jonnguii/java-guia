import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import { ASSESSMENT } from '../data/assessment'
import { AREA_LABEL } from '../data/stages'
import { scoreAssessment } from '../lib/insights'
import { goBack, navigate, type Route } from '../lib/router'
import { useStore } from '../lib/store'
import { tap } from '../lib/haptics'
import { CodeBlock } from '../components/CodeBlock'
import { ProgressBar, cx, spring } from '../components/ui'

const LETTERS = ['A', 'B', 'C', 'D']

/** Diagnóstico: uma questão por tela, sem correção no meio, para não influenciar as próximas respostas. */
export function Assessment({ route }: { route: Route }) {
  const saveAssessment = useStore((s) => s.saveAssessment)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [picked, setPicked] = useState<number | null>(null)
  const dir = useRef(1)
  const locked = useRef(false)

  const q = ASSESSMENT[index]
  const total = ASSESSMENT.length

  const commit = (value: number | null) => {
    if (locked.current) return
    locked.current = true
    setPicked(value)
    tap(value === null ? 6 : 10)
    const next = { ...answers, [q.id]: value }
    setAnswers(next)
    setTimeout(() => {
      locked.current = false
      setPicked(null)
      if (index + 1 < total) {
        dir.current = 1
        setIndex(index + 1)
      } else {
        saveAssessment(scoreAssessment(next))
        navigate({ name: 'resultado' }, { replace: true })
      }
    }, 260)
  }

  const previous = () => {
    if (index === 0 || locked.current) return
    dir.current = -1
    setIndex(index - 1)
  }

  return (
    <div className="flex min-h-dvh flex-col" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}>
      <header className="gutter sticky z-20 bg-bg pb-3 pt-2" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex h-12 items-center justify-between gap-3">
          <button
            type="button"
            onClick={previous}
            disabled={index === 0}
            aria-label="Questão anterior"
            className="-ml-2 grid size-10 place-items-center rounded-full hover:bg-surface disabled:opacity-0"
          >
            <ArrowLeft size={20} />
          </button>
          <p className="label tnum" aria-live="polite">
            {index + 1} / {total}
          </p>
          <button
            type="button"
            onClick={() => goBack(route)}
            aria-label="Sair do nivelamento"
            className="-mr-2 grid size-10 place-items-center rounded-full hover:bg-surface"
          >
            <X size={20} />
          </button>
        </div>
        <ProgressBar value={index / total} label="Progresso do nivelamento" />
      </header>

      <div className="gutter relative flex-1 overflow-hidden pt-6">
        <AnimatePresence mode="popLayout" initial={false} custom={dir.current}>
          <motion.section
            key={q.id}
            custom={dir.current}
            initial="in"
            animate="center"
            exit="out"
            variants={{
              in: (d: number) => ({ x: 40 * d, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              out: (d: number) => ({ x: -40 * d, opacity: 0 }),
            }}
            transition={{ duration: 0.22, ease: [0.25, 0.8, 0.25, 1] }}
            className="flex flex-col gap-5"
            aria-labelledby={`q-${q.id}`}
          >
            <p className="label">{AREA_LABEL[q.area]}</p>
            <h1 id={`q-${q.id}`} className="font-display text-[26px] font-bold leading-tight tracking-[-0.02em]">
              {q.q}
            </h1>
            {q.code && <CodeBlock code={q.code} compact />}
            <div className="flex flex-col gap-2.5">
              {q.options.map((opt, i) => {
                const chosen = picked === i || (picked === null && answers[q.id] === i)
                return (
                  <motion.button
                    key={i}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    transition={spring}
                    onClick={() => commit(i)}
                    aria-pressed={chosen}
                    className={cx(
                      'flex min-h-14 w-full items-center gap-3.5 rounded-2xl border px-4 py-3 text-left text-[15px] leading-snug transition-colors duration-150',
                      chosen ? 'border-fg bg-fg text-bg' : 'border-line hover:border-faint',
                    )}
                  >
                    <span
                      aria-hidden
                      className={cx(
                        'grid size-7 shrink-0 place-items-center rounded-full font-mono text-[12px] font-bold',
                        chosen ? 'bg-bg text-fg' : 'bg-surface text-muted',
                      )}
                    >
                      {LETTERS[i]}
                    </span>
                    <span className="min-w-0 flex-1">{opt}</span>
                  </motion.button>
                )
              })}
            </div>
            {index === 0 && (
              <p className="text-[13px] text-muted">
                Não sabe? Toque em “Não sei”. Chutar deixa o resultado menos preciso.
              </p>
            )}
          </motion.section>
        </AnimatePresence>
      </div>

      <div className="gutter pt-4">
        <button
          type="button"
          onClick={() => commit(null)}
          className={cx(
            'h-12 w-full rounded-full text-[15px] font-medium transition-colors',
            picked === null && answers[q.id] === null ? 'bg-surface-2 text-fg' : 'text-muted hover:bg-surface hover:text-fg',
          )}
        >
          Não sei
        </button>
      </div>
    </div>
  )
}
