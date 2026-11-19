import { ArrowRight, RotateCcw } from 'lucide-react'
import { AREAS } from '../data/stages'
import { shortDate, streak } from '../lib/dates'
import { areaStats, overallProgress, performanceIndex, quizTotals, type AreaStat } from '../lib/insights'
import { navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { AreaBars } from '../components/AreaBars'
import { Heatmap } from '../components/Heatmap'
import { CountUp, Pressable, ProgressBar } from '../components/ui'

function pct(v: number) {
  return `${Math.round(v * 100)}%`
}

function verdict(index: number) {
  if (index >= 80) return 'Excelente. Continue no ritmo e parta para os projetos avançados.'
  if (index >= 60) return 'Bom ritmo. Revise as áreas marcadas como foco para subir mais.'
  if (index >= 35) return 'Em construção. Constância pesa: estude um pouco todo dia.'
  return 'Começo de jornada. Conclua módulos e responda os quizzes para o índice subir.'
}

export function Performance() {
  const state = useStore()
  const perf = performanceIndex(state)
  const stats = areaStats(state)
  const quiz = quizTotals(state)
  const prog = overallProgress(state)
  const days = streak(state.activity)
  const lowest = Math.min(...stats.map((s) => s.mastery))
  const weakest = lowest < 100 ? stats.filter((s) => s.mastery === lowest).map((s) => s.id) : []
  const byId = Object.fromEntries(stats.map((s) => [s.id, s])) as Record<string, AreaStat>

  return (
    <div className="flex flex-col gap-10 pb-36" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}>
      <header className="gutter pt-2">
        <h1 className="font-display text-[34px] font-extrabold leading-tight tracking-[-0.03em]">Desempenho</h1>
      </header>

      {/* Número principal */}
      <section className="gutter flex flex-col gap-5" aria-labelledby="indice">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p id="indice" className="label">
              Índice de desempenho
            </p>
            <p className="mt-2 text-[64px] font-semibold leading-[0.9] tracking-[-0.04em]">
              <CountUp value={perf.index} />
              <span className="text-[22px] font-medium tracking-normal text-muted"> /100</span>
            </p>
          </div>
          {state.assessment && (
            <Pressable
              onClick={() => navigate({ name: 'resultado' })}
              className="mb-1 rounded-full border border-line px-3 py-1.5 text-[12px] font-semibold"
            >
              Nível {state.assessment.level}
            </Pressable>
          )}
        </div>
        <p className="text-[15px] text-muted">{verdict(perf.index)}</p>

        <div className="flex flex-col gap-3.5 rounded-[22px] bg-surface p-4">
          {[
            { label: 'Progresso na trilha', weight: '40%', value: perf.progress },
            { label: 'Acerto nos quizzes', weight: '40%', value: perf.accuracy },
            { label: 'Constância nos últimos 14 dias', weight: '20%', value: perf.consistency },
          ].map((row) => (
            <div key={row.label} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-[13.5px]">
                <span>
                  {row.label} <span className="text-faint">· peso {row.weight}</span>
                </span>
                <span className="tnum font-semibold">{pct(row.value)}</span>
              </div>
              <ProgressBar value={row.value} label={row.label} />
            </div>
          ))}
        </div>
      </section>

      {/* Números de apoio */}
      <section className="gutter grid grid-cols-3 gap-2" aria-label="Resumo">
        {[
          { label: 'Módulos', value: `${prog.done}`, sub: `de ${prog.total}` },
          { label: 'Acerto', value: quiz.accuracy === null ? '—' : pct(quiz.accuracy), sub: `${quiz.answered} respostas` },
          { label: 'Sequência', value: `${days}`, sub: days === 1 ? 'dia' : 'dias' },
        ].map((s) => (
          <div key={s.label} className="flex flex-col gap-1 rounded-[18px] border border-line p-3">
            <span className="text-[12px] text-muted">{s.label}</span>
            <span className="text-[24px] font-semibold leading-none tracking-tight">{s.value}</span>
            <span className="text-[12px] text-muted">{s.sub}</span>
          </div>
        ))}
      </section>

      {/* Domínio por área */}
      <section className="gutter flex flex-col gap-3" aria-labelledby="dominio">
        <div>
          <h2 id="dominio" className="font-display text-[22px] font-bold tracking-[-0.02em]">
            Domínio por área
          </h2>
          <p className="text-[13.5px] text-muted">
            60% módulos concluídos + 40% acerto nos quizzes da área (ou a nota do nivelamento, se ainda não houver
            quizzes). Toque em uma área para ver o detalhe.
          </p>
        </div>
        <AreaBars
          rows={stats.map((s) => ({ id: s.id, label: s.label, value: s.mastery }))}
          detail={(row) => {
            const s = byId[row.id]
            const done = s.modules.filter((m) => state.completed[m.id]).length
            const next = s.modules.find((m) => !state.completed[m.id])
            return (
              <div className="flex flex-col gap-3 rounded-2xl bg-surface p-3.5">
                <dl className="grid grid-cols-2 gap-3 text-[13px]">
                  <div>
                    <dt className="text-muted">Módulos</dt>
                    <dd className="tnum font-semibold">
                      {done} de {s.modules.length}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted">
                      {s.knowledgeSource === 'nivelamento' ? 'Nivelamento' : 'Acerto nos quizzes'}
                    </dt>
                    <dd className="tnum font-semibold">{s.knowledgeSource === 'nenhum' ? 'sem dados' : pct(s.knowledge)}</dd>
                  </div>
                </dl>
                {next ? (
                  <button
                    type="button"
                    onClick={() => navigate({ name: 'modulo', id: next.id })}
                    className="inline-flex items-center gap-1.5 self-start text-[13.5px] font-semibold underline-offset-4 hover:underline"
                  >
                    Estudar: {next.title} <ArrowRight size={14} />
                  </button>
                ) : (
                  <p className="text-[13px] text-muted">Todos os módulos desta área foram concluídos.</p>
                )}
              </div>
            )
          }}
        />
        {weakest.length > 0 && (
          <p className="text-[13.5px]">
            <span className="text-muted">{weakest.length === 1 ? 'Mais fraca agora: ' : 'Mais fracas agora: '}</span>
            <span className="font-semibold">{weakest.length > 3 ? `${weakest.length} áreas empatadas em ${lowest}%` : weakest.map((w) => byId[w].label).join(', ')}</span>
          </p>
        )}
      </section>

      {/* Atividade */}
      <section className="gutter flex flex-col gap-3" aria-labelledby="atividade">
        <div>
          <h2 id="atividade" className="font-display text-[22px] font-bold tracking-[-0.02em]">
            Atividade
          </h2>
          <p className="text-[13.5px] text-muted">
            Cada módulo, quiz, item marcado e tarefa concluída conta como uma ação.
          </p>
        </div>
        <Heatmap activity={state.activity} />
      </section>

      {/* Ações */}
      <section className="gutter flex flex-col gap-2">
        {state.review.length > 0 && (
          <Pressable
            onClick={() => navigate({ name: 'revisao' })}
            className="flex items-center justify-between gap-3 rounded-[18px] bg-fg px-4 py-3.5 text-left text-bg"
          >
            <span className="font-semibold">Revisar {state.review.length} {state.review.length === 1 ? 'questão errada' : 'questões erradas'}</span>
            <ArrowRight size={18} />
          </Pressable>
        )}
        <Pressable
          onClick={() => navigate({ name: 'nivelamento' })}
          className="flex items-center justify-between gap-3 rounded-[18px] border border-line px-4 py-3.5 text-left"
        >
          <span>
            <span className="block font-semibold">{state.assessment ? 'Refazer nivelamento' : 'Fazer nivelamento'}</span>
            <span className="block text-[13px] text-muted">
              {state.assessment
                ? `Último em ${shortDate(new Date(state.assessment.at))}: ${state.assessment.overall}%`
                : `16 questões sobre as ${AREAS.length} áreas da trilha`}
            </span>
          </span>
          <RotateCcw size={17} className="shrink-0 text-muted" />
        </Pressable>
      </section>
    </div>
  )
}
