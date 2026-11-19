import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { MODULES } from '../data/modules'
import { AREA_LABEL, STAGES } from '../data/stages'
import type { StageId } from '../data/types'
import { moduleProgress, overallProgress, recommendedModule, stageProgress } from '../lib/insights'
import { navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { tap } from '../lib/haptics'
import { Pressable, ProgressBar, Ring, cx, spring } from '../components/ui'

let rememberedStage: StageId | null = null

export function Track() {
  const state = useStore()
  const rec = recommendedModule(state)
  const [stage, setStage] = useState<StageId>(rememberedStage ?? rec?.module.stage ?? 'base')
  const total = overallProgress(state)
  const stageIdx = STAGES.findIndex((s) => s.id === stage)
  const current = STAGES[stageIdx]
  const sp = stageProgress(state, stage)
  const modules = MODULES.filter((m) => m.stage === stage)
  const nav = useRef<HTMLElement>(null)

  // Mantém a etapa ativa visível na faixa rolável, sem mexer na rolagem da página.
  useEffect(() => {
    const el = nav.current?.querySelector<HTMLElement>('[aria-current="step"]')
    const box = nav.current
    if (!el || !box) return
    const left = el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2
    box.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [stage])

  const pick = (id: StageId) => {
    if (id !== stage) tap(6)
    rememberedStage = id
    setStage(id)
  }

  return (
    <div className="flex flex-col gap-6 pb-36" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}>
      <header className="gutter flex flex-col gap-4 pt-2">
        <h1 className="font-display text-[34px] font-extrabold leading-tight tracking-[-0.03em]">Trilha</h1>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between text-[14px]">
            <span className="text-muted">Módulos concluídos</span>
            <span className="tnum font-semibold">
              {total.done} de {total.total}
            </span>
          </div>
          <ProgressBar value={total.ratio} thick label="Progresso total da trilha" />
        </div>
      </header>

      {/* Etapas: são uma sequência real, por isso numeradas */}
      <nav ref={nav} aria-label="Etapas da trilha" className="gutter no-scrollbar relative flex scroll-px-4 gap-2 overflow-x-auto">
        {STAGES.map((s, i) => {
          const on = s.id === stage
          const p = stageProgress(state, s.id)
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => pick(s.id)}
              aria-current={on ? 'step' : undefined}
              className={cx(
                'relative flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-medium transition-colors',
                on ? 'text-bg' : 'border border-line text-fg hover:border-faint',
              )}
            >
              {on && <motion.span layoutId="stage-pill" className="absolute inset-0 rounded-full bg-fg" transition={spring} />}
              <span className={cx('relative font-mono text-[11px]', on ? 'text-bg/60' : 'text-muted')}>{i + 1}</span>
              <span className="relative whitespace-nowrap">{s.title}</span>
              {p.done === p.total && <Check size={14} strokeWidth={2.5} className="relative" aria-label="concluída" />}
            </button>
          )
        })}
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={stage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="gutter flex flex-col gap-5"
          aria-label={current.title}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="max-w-[38ch] text-[14px] text-muted">{current.description}</p>
            <span className="tnum shrink-0 font-mono text-[12px] text-muted">
              {sp.done}/{sp.total}
            </span>
          </div>

          <ol className="relative flex flex-col">
            {/* trilho vertical ligando os módulos */}
            <span aria-hidden className="absolute bottom-6 left-[21px] top-6 w-px bg-line" />
            {modules.map((m, i) => {
              const p = moduleProgress(state, m)
              const isRec = rec?.module.id === m.id
              return (
                <motion.li
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.22 }}
                  className="relative"
                >
                  <Pressable
                    onClick={() => navigate({ name: 'modulo', id: m.id })}
                    className="flex w-full items-start gap-4 rounded-[22px] py-3.5 pr-3 text-left"
                  >
                    <span className="relative z-[1] rounded-full bg-bg">
                      {p.done ? (
                        <span className="grid size-[43px] place-items-center rounded-full bg-fg text-bg">
                          <Check size={18} strokeWidth={2.75} aria-label="Concluído" />
                        </span>
                      ) : (
                        <Ring value={p.ratio} size={43} stroke={2.5} label={`${Math.round(p.ratio * 100)}% feito`}>
                          <span className="font-mono text-[12px] font-bold">
                            {String(MODULES.indexOf(m) + 1).padStart(2, '0')}
                          </span>
                        </Ring>
                      )}
                    </span>
                    <span className="min-w-0 flex-1 pt-0.5">
                      <span className="flex items-center gap-2">
                        <span className={cx('text-[16px] font-semibold leading-snug', p.done && 'text-muted')}>{m.title}</span>
                      </span>
                      <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{m.summary}</span>
                      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
                        <span className="tnum">{m.minutes} min</span>
                        <span aria-hidden>·</span>
                        <span>{AREA_LABEL[m.area]}</span>
                        {isRec && (
                          <span className="rounded-full bg-fg px-2 py-px font-mono text-[10px] uppercase tracking-wider text-bg">
                            Recomendado
                          </span>
                        )}
                      </span>
                    </span>
                  </Pressable>
                </motion.li>
              )
            })}
          </ol>

          {stageIdx < STAGES.length - 1 && (
            <button
              type="button"
              onClick={() => pick(STAGES[stageIdx + 1].id)}
              className="self-start text-[14px] font-medium underline-offset-4 hover:underline"
            >
              Próxima etapa: {STAGES[stageIdx + 1].title} →
            </button>
          )}
        </motion.section>
      </AnimatePresence>
    </div>
  )
}
