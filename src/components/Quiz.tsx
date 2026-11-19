import { AnimatePresence, motion } from 'motion/react'
import { Check, RotateCcw, X } from 'lucide-react'
import type { Question } from '../data/types'
import { tap } from '../lib/haptics'
import { CodeBlock } from './CodeBlock'
import { cx, spring } from './ui'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

/**
 * Uma questão com resposta imediata. Correto e incorreto são marcados por forma e ícone
 * (inversão, risco, ✓/✕), nunca só por cor.
 */
export function QuizCard({
  question,
  selected,
  onSelect,
  onRetry,
  index,
  total,
}: {
  question: Question
  selected: number | null
  onSelect: (i: number) => void
  onRetry?: () => void
  index?: number
  total?: number
}) {
  const answered = selected !== null
  const right = answered && selected === question.answer

  return (
    <div className="flex flex-col gap-4">
      {index !== undefined && total !== undefined && (
        <p className="label">
          Questão {index + 1} de {total}
        </p>
      )}
      <p className="text-[17px] font-semibold leading-snug">{question.q}</p>
      {question.code && <CodeBlock code={question.code} compact />}
      <div role="radiogroup" aria-label={question.q} className="flex flex-col gap-2">
        {question.options.map((opt, i) => {
          const isAnswer = i === question.answer
          const isPicked = i === selected
          const state = !answered ? 'idle' : isAnswer ? 'right' : isPicked ? 'wrong' : 'dim'
          return (
            <motion.button
              key={i}
              type="button"
              role="radio"
              aria-checked={isPicked}
              disabled={answered}
              whileTap={answered ? undefined : { scale: 0.98 }}
              animate={state === 'wrong' ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={state === 'wrong' ? { duration: 0.36 } : spring}
              onClick={() => {
                tap(i === question.answer ? 10 : [12, 40, 12])
                onSelect(i)
              }}
              className={cx(
                'flex min-h-13 w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left text-[14.5px] leading-snug transition-colors duration-200',
                state === 'idle' && 'border-line hover:border-faint',
                state === 'right' && 'border-fg bg-fg text-bg',
                state === 'wrong' && 'border-dashed border-fg text-fg',
                state === 'dim' && 'border-line text-faint',
              )}
            >
              <span
                className={cx(
                  'grid size-7 shrink-0 place-items-center rounded-full font-mono text-[12px] font-bold',
                  state === 'right' ? 'bg-bg text-fg' : state === 'wrong' ? 'bg-fg text-bg' : 'bg-surface text-muted',
                )}
                aria-hidden
              >
                {state === 'right' ? <Check size={15} strokeWidth={3} /> : state === 'wrong' ? <X size={15} strokeWidth={3} /> : LETTERS[i]}
              </span>
              <span className={cx('min-w-0 flex-1', state === 'wrong' && 'line-through decoration-2')}>{opt}</span>
              {state === 'right' && <span className="sr-only">(resposta correta)</span>}
              {state === 'wrong' && <span className="sr-only">(sua resposta, incorreta)</span>}
            </motion.button>
          )
        })}
      </div>
      <AnimatePresence initial={false}>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl bg-surface p-4" role="status">
              <p className="mb-1 font-semibold">{right ? 'Correto.' : 'Não foi dessa vez.'}</p>
              <p className="text-[14px] text-muted">{question.why}</p>
              {!right && onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold underline-offset-4 hover:underline"
                >
                  <RotateCcw size={14} /> Tentar de novo
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
