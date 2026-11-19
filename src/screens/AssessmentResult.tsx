import { motion } from 'motion/react'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { AREAS } from '../data/stages'
import { LEVEL_INFO, recommendedModule } from '../lib/insights'
import { navigate, type Route } from '../lib/router'
import { useStore, type Level } from '../lib/store'
import { StackHeader } from '../components/Chrome'
import { AreaBars } from '../components/AreaBars'
import { CountUp, GhostButton, PrimaryButton, cx } from '../components/ui'

const LEVELS: Level[] = ['Iniciante', 'Básico', 'Intermediário', 'Avançado']

export function AssessmentResult({ route }: { route: Route }) {
  const state = useStore()
  const a = state.assessment

  if (!a) {
    return (
      <>
        <StackHeader route={route} title="Seu nível" />
        <div className="gutter flex flex-col gap-4 pt-6">
          <h1 className="font-display text-[30px] font-bold tracking-tight">Você ainda não fez o nivelamento.</h1>
          <p className="text-muted">São 16 questões. No fim, você vê seu nível e por onde começar.</p>
          <PrimaryButton onClick={() => navigate({ name: 'nivelamento' })}>Fazer agora</PrimaryButton>
        </div>
      </>
    )
  }

  const info = LEVEL_INFO[a.level]
  const rec = recommendedModule(state)
  const levelIdx = LEVELS.indexOf(a.level)
  const rows = AREAS.map((x) => ({ id: x.id, label: x.label, value: a.scores[x.id] })).sort((p, q) => p.value - q.value)

  return (
    <>
      <StackHeader route={route} title={`Nível ${a.level}`} />
      <div className="gutter flex flex-col gap-10 pb-16 pt-2">
        <section className="flex flex-col gap-5">
          <p className="label">Seu nível</p>
          <h1 className="overflow-hidden font-display text-[52px] font-extrabold leading-none tracking-[-0.04em]">
            <motion.span
              className="inline-block"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.1 }}
            >
              {a.level}
            </motion.span>
          </h1>

          <div className="flex flex-col gap-2" role="img" aria-label={`Nível ${levelIdx + 1} de 4: ${a.level}`}>
            <div className="grid grid-cols-4 gap-1.5">
              {LEVELS.map((l, i) => (
                <motion.span
                  key={l}
                  className={cx('h-1.5 origin-left rounded-full', i <= levelIdx ? 'bg-fg' : 'bg-surface-2')}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.3 }}
                />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-[11px] text-muted">
              {LEVELS.map((l, i) => (
                <span key={l} className={cx('truncate', i === levelIdx && 'font-semibold text-fg')}>
                  {l}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-[44px] font-semibold leading-none tracking-tight">
              <CountUp value={a.overall} suffix="%" />
            </span>
            <span className="text-[14px] text-muted">de acerto ponderado</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[17px] font-semibold">{info.headline}</p>
            <p className="text-muted">{info.advice}</p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="font-display text-[22px] font-bold tracking-tight">Onde focar</h2>
            <p className="text-[14px] text-muted">Da área mais fraca para a mais forte. Abaixo de 67% vira foco.</p>
          </div>
          <AreaBars rows={rows} threshold={67} />
        </section>

        <section className="flex flex-col gap-3">
          {rec && (
            <PrimaryButton onClick={() => navigate({ name: 'modulo', id: rec.module.id })} className="w-full">
              <span className="truncate">Começar: {rec.module.title}</span>
              <ArrowRight size={18} className="shrink-0" />
            </PrimaryButton>
          )}
          <GhostButton onClick={() => navigate({ name: 'hoje' }, { replace: true })} className="w-full">
            Ir para o início
          </GhostButton>
          <button
            type="button"
            onClick={() => navigate({ name: 'nivelamento' })}
            className="mx-auto mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-fg"
          >
            <RotateCcw size={14} /> Refazer nivelamento
          </button>
        </section>
      </div>
    </>
  )
}
