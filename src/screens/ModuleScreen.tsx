import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { ArrowRight, Check, Clock } from 'lucide-react'
import { MODULE_BY_ID, MODULES } from '../data/modules'
import { AREA_LABEL, STAGES } from '../data/stages'
import type { Block, Module } from '../data/types'
import { moduleProgress, nextInTrack, overallProgress } from '../lib/insights'
import { navigate, type Route } from '../lib/router'
import { useStore, useUI } from '../lib/store'
import { tap } from '../lib/haptics'
import { StackHeader } from '../components/Chrome'
import { CodeBlock } from '../components/CodeBlock'
import { QuizCard } from '../components/Quiz'
import { CheckRow, Pressable, PrimaryButton, Rich, cx, spring } from '../components/ui'

export function ModuleScreen({ route, id }: { route: Route; id: string }) {
  const m = MODULE_BY_ID[id]
  const visit = useStore((s) => s.visitModule)
  useEffect(() => {
    if (m) visit(m.id)
  }, [m, visit])

  if (!m) {
    return (
      <>
        <StackHeader route={route} title="Módulo" />
        <div className="gutter flex flex-col gap-4 pt-6">
          <h1 className="font-display text-[28px] font-bold">Módulo não encontrado.</h1>
          <p className="text-muted">O link pode estar incompleto. Escolha um módulo na trilha.</p>
          <PrimaryButton onClick={() => navigate({ name: 'trilha' }, { replace: true })}>Abrir a trilha</PrimaryButton>
        </div>
      </>
    )
  }
  return <ModuleBody key={m.id} route={route} m={m} />
}

function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40 })
  return <motion.div aria-hidden className="h-0.5 origin-left bg-fg" style={{ scaleX }} />
}

function ModuleBody({ route, m }: { route: Route; m: Module }) {
  const state = useStore()
  const toggleCheck = useStore((s) => s.toggleCheck)
  const answerQuiz = useStore((s) => s.answerQuiz)
  const toggleComplete = useStore((s) => s.toggleComplete)
  const showToast = useUI((s) => s.showToast)

  const stageIdx = STAGES.findIndex((s) => s.id === m.stage)
  const number = MODULES.indexOf(m) + 1
  const p = moduleProgress(state, m)
  const next = nextInTrack(m.id)

  // Seleção local de cada questão. Uma resposta certa já registrada volta marcada.
  const [picks, setPicks] = useState<(number | null)[]>(() =>
    m.quiz.map((q, i) => (state.quiz[`${m.id}:${i}`]?.correct ? q.answer : null)),
  )

  const complete = () => {
    const wasDone = p.done
    tap(wasDone ? 8 : [10, 50, 18])
    toggleComplete(m.id)
    if (!wasDone) {
      const total = overallProgress(useStore.getState())
      showToast(`Módulo concluído · ${total.done} de ${total.total}`)
    }
  }

  return (
    <>
      <StackHeader route={route} title={m.title} progress={<ReadingProgress />} />

      <article className="gutter flex flex-col gap-10 pb-20 pt-2">
        {/* Abertura */}
        <header className="flex flex-col gap-4">
          <p className="label">
            Módulo {String(number).padStart(2, '0')} · Etapa {stageIdx + 1}, {STAGES[stageIdx].title}
          </p>
          <h1 className="font-display text-[36px] font-extrabold leading-[1.04] tracking-[-0.03em]">{m.title}</h1>
          <p className="text-[16px] text-muted">{m.summary}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} aria-hidden /> {m.minutes} min de leitura
            </span>
            <span>{AREA_LABEL[m.area]}</span>
            {p.done && (
              <span className="inline-flex items-center gap-1 rounded-full bg-fg px-2.5 py-0.5 text-[12px] font-semibold text-bg">
                <Check size={12} strokeWidth={3} /> Concluído
              </span>
            )}
          </div>
        </header>

        {/* Conteúdo */}
        {m.sections.map((s, i) => (
          <section key={s.title} className="flex flex-col gap-4" aria-labelledby={`sec-${i}`}>
            <div className="flex items-baseline gap-3">
              <span className="tnum font-mono text-[12px] text-faint">
                {i + 1}/{m.sections.length}
              </span>
              <h2 id={`sec-${i}`} className="font-display text-[23px] font-bold leading-tight tracking-[-0.02em]">
                {s.title}
              </h2>
            </div>
            {s.blocks.map((b, j) => (
              <BlockView key={j} b={b} />
            ))}
          </section>
        ))}

        {/* Autoavaliação */}
        <section className="flex flex-col gap-2" aria-labelledby="checklist-title">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="checklist-title" className="font-display text-[23px] font-bold tracking-[-0.02em]">
              Você consegue…
            </h2>
            <span className="tnum font-mono text-[12px] text-muted">
              {p.checks}/{m.checklist.length}
            </span>
          </div>
          <p className="text-[14px] text-muted">Marque só o que você faria sem consultar.</p>
          <div className="mt-1 divide-y divide-line border-y border-line">
            {m.checklist.map((item, i) => (
              <CheckRow key={i} checked={Boolean(state.checks[`${m.id}:${i}`])} onToggle={() => toggleCheck(`${m.id}:${i}`)}>
                {item}
              </CheckRow>
            ))}
          </div>
        </section>

        {/* Quiz */}
        <section className="flex flex-col gap-6" aria-labelledby="quiz-title">
          <div>
            <h2 id="quiz-title" className="font-display text-[23px] font-bold tracking-[-0.02em]">
              Teste rápido
            </h2>
            <p className="text-[14px] text-muted">Conta para o seu desempenho. Erros vão para a revisão.</p>
          </div>
          {m.quiz.map((q, i) => {
            const key = `${m.id}:${i}`
            const prior = state.quiz[key]
            return (
              <div key={i} className="flex flex-col gap-2">
                {prior && !prior.correct && picks[i] === null && (
                  <p className="text-[13px] text-muted">Você errou esta antes. Tente de novo.</p>
                )}
                <QuizCard
                  question={q}
                  index={i}
                  total={m.quiz.length}
                  selected={picks[i]}
                  onSelect={(choice) => {
                    setPicks((arr) => arr.map((v, k) => (k === i ? choice : v)))
                    answerQuiz(key, choice === q.answer)
                  }}
                  onRetry={() => setPicks((arr) => arr.map((v, k) => (k === i ? null : v)))}
                />
              </div>
            )
          })}
        </section>

        {/* Conclusão */}
        <section className="flex flex-col gap-4">
          <motion.button
            type="button"
            layout
            onClick={complete}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            aria-pressed={p.done}
            className={cx(
              'flex h-14 w-full items-center justify-center gap-2 rounded-full text-[16px] font-semibold transition-colors duration-200',
              p.done ? 'border border-line text-fg' : 'bg-fg text-bg',
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={p.done ? 'done' : 'todo'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.16 }}
                className="inline-flex items-center gap-2"
              >
                {p.done ? (
                  <>
                    <Check size={18} strokeWidth={2.75} /> Concluído · toque para desfazer
                  </>
                ) : (
                  'Concluir módulo'
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <AnimatePresence>
            {p.done && next && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                transition={spring}
              >
                <Pressable
                  onClick={() => navigate({ name: 'modulo', id: next.id }, { replace: true })}
                  className="flex w-full items-center gap-4 rounded-[22px] bg-fg p-4 text-left text-bg"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[11px] uppercase tracking-[0.08em] text-bg/60">Próximo módulo</span>
                    <span className="mt-0.5 block font-display text-[19px] font-bold leading-tight">{next.title}</span>
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-bg text-fg">
                    <ArrowRight size={18} />
                  </span>
                </Pressable>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </article>
    </>
  )
}

function BlockView({ b }: { b: Block }) {
  switch (b.kind) {
    case 'text':
      return (
        <p className="text-[16px] leading-[1.7] text-fg/90">
          <Rich text={b.body} />
        </p>
      )
    case 'code':
      return <CodeBlock code={b.code} lang={b.lang} caption={b.caption} />
    case 'list':
      return (
        <ul className="flex flex-col gap-2.5">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[15.5px] leading-[1.6]">
              <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 bg-fg" />
              <span className="min-w-0">
                <Rich text={it} />
              </span>
            </li>
          ))}
        </ul>
      )
    case 'tip':
      return (
        <aside className="rounded-2xl bg-surface p-4">
          <p className="label mb-1.5 text-fg">Dica</p>
          <p className="text-[15px] leading-[1.6] text-fg/85">
            <Rich text={b.body} />
          </p>
        </aside>
      )
    case 'pitfall':
      return (
        <aside className="rounded-2xl border border-dashed border-fg/60 p-4">
          <p className="label mb-1.5 text-fg">Armadilha</p>
          <p className="text-[15px] leading-[1.6] text-fg/85">
            <Rich text={b.body} />
          </p>
        </aside>
      )
  }
}
