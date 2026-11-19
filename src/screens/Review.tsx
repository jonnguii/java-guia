import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { MODULE_BY_ID } from '../data/modules'
import { navigate, type Route } from '../lib/router'
import { useStore } from '../lib/store'
import { StackHeader } from '../components/Chrome'
import { QuizCard } from '../components/Quiz'
import { PrimaryButton } from '../components/ui'

/** Revisão espaçada simples: errou, a questão vai para o fim da fila; acertou, sai dela. */
export function Review({ route }: { route: Route }) {
  const review = useStore((s) => s.review)
  const answerReview = useStore((s) => s.answerReview)
  const [selected, setSelected] = useState<number | null>(null)
  const [session, setSession] = useState({ right: 0, total: 0 })

  // Ignora chaves de questões que não existem mais no conteúdo.
  const valid = review.filter((k) => {
    const [mid, i] = k.split(':')
    return MODULE_BY_ID[mid]?.quiz[Number(i)]
  })
  const key = valid[0]

  if (!key) {
    return (
      <>
        <StackHeader route={route} title="Revisão" />
        <div className="gutter flex flex-col items-start gap-4 pt-8">
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="grid size-14 place-items-center rounded-full bg-fg text-bg"
          >
            <Check size={26} strokeWidth={2.75} />
          </motion.span>
          <h1 className="font-display text-[30px] font-bold leading-tight tracking-tight">Nada para revisar.</h1>
          <p className="text-muted">
            {session.total > 0
              ? `Você acertou ${session.right} de ${session.total} nesta rodada.`
              : 'As questões que você errar nos módulos aparecem aqui até você acertar.'}
          </p>
          <PrimaryButton onClick={() => navigate({ name: 'trilha' }, { replace: true })}>Voltar à trilha</PrimaryButton>
        </div>
      </>
    )
  }

  const [mid, idx] = key.split(':')
  const m = MODULE_BY_ID[mid]
  const q = m.quiz[Number(idx)]
  const answered = selected !== null

  const next = () => {
    const correct = selected === q.answer
    setSession((s) => ({ right: s.right + (correct ? 1 : 0), total: s.total + 1 }))
    setSelected(null)
    answerReview(key, correct)
  }

  return (
    <>
      <StackHeader route={route} title="Revisão" />
      <div className="gutter flex flex-col gap-6 pb-20 pt-2">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="font-display text-[30px] font-bold tracking-tight">Revisão</h1>
          <span className="tnum font-mono text-[12px] text-muted">
            {valid.length} na fila
          </span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${key}-${session.total}`}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            <button
              type="button"
              onClick={() => navigate({ name: 'modulo', id: m.id })}
              className="label self-start underline-offset-4 hover:text-fg hover:underline"
            >
              {m.title}
            </button>
            <QuizCard question={q} selected={selected} onSelect={setSelected} />
          </motion.div>
        </AnimatePresence>
        <PrimaryButton onClick={next} disabled={!answered} className="w-full">
          {valid.length === 1 && answered && selected === q.answer ? 'Concluir revisão' : 'Próxima'}
          <ArrowRight size={18} />
        </PrimaryButton>
      </div>
    </>
  )
}
