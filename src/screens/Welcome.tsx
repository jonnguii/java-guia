import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { MODULES } from '../data/modules'
import { STAGES } from '../data/stages'
import { navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { GhostButton, PrimaryButton } from '../components/ui'

const lines = [
  { t: '$ java --version', dim: false },
  { t: 'openjdk 25 2025-09-16 LTS', dim: true },
  { t: '$ java Guia.java', dim: false },
  ...STAGES.map((s) => {
    const n = MODULES.filter((m) => m.stage === s.id).length
    return { t: `${s.title.padEnd(22, '.')} ${n} módulos`, dim: true }
  }),
]

export function Welcome() {
  const setWelcomed = useStore((s) => s.setWelcomed)

  return (
    <div
      className="gutter flex min-h-dvh flex-col justify-between gap-10"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 28px)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
    >
      <div className="flex flex-col gap-8">
        <p className="label">Guia de Java · edição Java 25</p>

        <div className="overflow-hidden rounded-[22px] bg-fg p-5 text-bg">
          <div className="mb-4 flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-bg/25" />
            <span className="size-2.5 rounded-full bg-bg/25" />
            <span className="size-2.5 rounded-full bg-bg/25" />
          </div>
          <div className="no-scrollbar overflow-x-auto font-mono text-[12.5px] leading-[1.8]">
            {lines.map((l, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.09, duration: 0.25 }}
                className={l.dim ? 'whitespace-pre text-bg/60' : 'whitespace-pre'}
              >
                {l.t}
              </motion.p>
            ))}
            <motion.span
              aria-hidden
              className="mt-1 inline-block h-4 w-2 translate-y-0.5 bg-bg"
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em]">
            Do primeiro println às threads virtuais.
          </h1>
          <p className="max-w-[34ch] text-[16px] text-muted">
            22 módulos, quizzes, projetos guiados e um painel que mostra onde você precisa melhorar.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <PrimaryButton onClick={() => navigate({ name: 'nivelamento' })} className="w-full">
          Descobrir meu nível
          <ArrowRight size={18} />
        </PrimaryButton>
        <GhostButton
          onClick={() => {
            setWelcomed()
            navigate({ name: 'hoje' }, { replace: true })
          }}
          className="w-full"
        >
          Começar do zero
        </GhostButton>
        <p className="text-center text-[13px] text-muted">O nivelamento tem 16 questões e leva uns 4 minutos.</p>
      </div>
    </div>
  )
}
