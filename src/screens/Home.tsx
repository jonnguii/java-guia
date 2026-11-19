import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { ArrowRight, ArrowUpRight, Flame, Layers, Plus, SlidersHorizontal, Trophy } from 'lucide-react'
import { MODULES } from '../data/modules'
import { STAGES } from '../data/stages'
import { addDays, dayKey, greeting, longToday, startOfWeek, streak } from '../lib/dates'
import { focusAreas, moduleProgress, recommendedModule, weekCompleted } from '../lib/insights'
import { navigate } from '../lib/router'
import { useStore, useUI } from '../lib/store'
import { tap } from '../lib/haptics'
import { SwipeRow } from '../components/SwipeRow'
import { CheckMark, Pressable, ProgressBar, Ring, cx } from '../components/ui'

const WEEK_LETTERS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

export function Home() {
  const state = useStore()
  const setSettingsOpen = useUI((s) => s.setSettingsOpen)
  const rec = recommendedModule(state)
  const focus = focusAreas(state).slice(0, 3)
  const days = streak(state.activity)
  const weekDone = weekCompleted(state)
  const goal = state.weeklyGoal
  const now = new Date()
  const monday = startOfWeek(now)

  return (
    <div className="flex flex-col gap-8 pb-36" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}>
      {/* Cabeçalho */}
      <header className="gutter flex items-start justify-between gap-4 pt-2">
        <div className="min-w-0">
          <p className="label">{longToday(now)}</p>
          <h1 className="mt-1 font-display text-[34px] font-extrabold leading-tight tracking-[-0.03em]">{greeting(now)}.</h1>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-1">
          <span
            className={cx(
              'inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold',
              days > 0 ? 'bg-fg text-bg' : 'bg-surface text-muted',
            )}
            aria-label={`Sequência de ${days} ${days === 1 ? 'dia' : 'dias'}`}
          >
            <Flame size={15} strokeWidth={2.25} aria-hidden />
            <span className="tnum">{days}</span>
          </span>
          <Pressable
            onClick={() => setSettingsOpen(true)}
            aria-label="Ajustes"
            className="grid size-9 place-items-center rounded-full bg-surface text-fg"
          >
            <SlidersHorizontal size={17} />
          </Pressable>
        </div>
      </header>

      {/* A única ação principal da tela */}
      <section className="gutter">
        {rec ? <ContinueCard rec={rec} /> : <FinishedCard />}
      </section>

      {/* Nivelamento ou foco */}
      <section className="gutter">
        {!state.assessment ? (
          <Pressable
            onClick={() => navigate({ name: 'nivelamento' })}
            className="flex w-full items-center gap-4 rounded-[22px] border border-line p-4 text-left"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface">
              <Layers size={19} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">Descubra seu nível</span>
              <span className="block text-[13px] text-muted">16 questões. O app passa a recomendar o que estudar.</span>
            </span>
            <ArrowRight size={18} className="shrink-0 text-muted" />
          </Pressable>
        ) : focus.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[15px] font-semibold">Seu foco</h2>
              <button
                type="button"
                onClick={() => navigate({ name: 'resultado' })}
                className="text-[13px] text-muted underline-offset-4 hover:text-fg hover:underline"
              >
                Nível {state.assessment.level.toLowerCase()}
              </button>
            </div>
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
              {focus.map((f) => {
                const target = MODULES.find((m) => m.area === f.id && !state.completed[m.id]) ?? MODULES.find((m) => m.area === f.id)
                return (
                  <Pressable
                    key={f.id}
                    onClick={() => target && navigate({ name: 'modulo', id: target.id })}
                    className="flex shrink-0 items-center gap-3 rounded-full border border-line py-1.5 pl-1.5 pr-4 text-left"
                  >
                    <Ring value={f.score / 100} size={34} stroke={3}>
                      <span className="tnum text-[10px] font-semibold">{f.score}</span>
                    </Ring>
                    <span className="text-[14px] font-medium">{f.label}</span>
                  </Pressable>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="rounded-[22px] bg-surface p-4 text-[14px] text-muted">
            Nenhuma área abaixo de 67% no nivelamento. Os projetos avançados são um bom próximo passo.
          </p>
        )}
      </section>

      {/* Revisão */}
      <AnimatePresence initial={false}>
        {state.review.length > 0 && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="gutter overflow-hidden"
          >
            <Pressable
              onClick={() => navigate({ name: 'revisao' })}
              className="flex w-full items-center justify-between gap-4 rounded-[22px] border border-dashed border-fg p-4 text-left"
            >
              <span>
                <span className="block font-semibold">
                  {state.review.length} {state.review.length === 1 ? 'questão para revisar' : 'questões para revisar'}
                </span>
                <span className="block text-[13px] text-muted">As que você errou voltam até você acertar.</span>
              </span>
              <ArrowUpRight size={20} className="shrink-0" />
            </Pressable>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Meta da semana */}
      <section className="gutter">
        <div className="flex items-center gap-5 rounded-[22px] bg-surface p-4">
          <Ring value={weekDone / goal} size={64} stroke={5} label={`${weekDone} de ${goal} módulos nesta semana`}>
            <span className="tnum text-[15px] font-semibold">
              {weekDone}
              <span className="text-muted">/{goal}</span>
            </span>
          </Ring>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {weekDone >= goal ? 'Meta da semana batida' : `Meta: ${goal} módulos por semana`}
            </p>
            <div className="mt-2.5 grid grid-cols-7 gap-1.5" aria-label="Atividade nesta semana">
              {WEEK_LETTERS.map((l, i) => {
                const d = addDays(monday, i)
                const active = Boolean(state.activity[dayKey(d)])
                const isToday = dayKey(d) === dayKey(now)
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <motion.span
                      initial={false}
                      animate={{ scale: active ? 1 : 0.7 }}
                      className={cx(
                        'size-2.5 rounded-full',
                        active ? 'bg-fg' : 'bg-surface-2',
                        isToday && !active && 'ring-1 ring-fg ring-offset-1 ring-offset-surface',
                      )}
                      aria-label={`${l}: ${active ? 'com atividade' : 'sem atividade'}`}
                    />
                    <span className={cx('text-[10px]', isToday ? 'font-bold text-fg' : 'text-muted')}>{l}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <TodoList />
    </div>
  )
}

function ContinueCard({ rec }: { rec: NonNullable<ReturnType<typeof recommendedModule>> }) {
  const state = useStore()
  const m = rec.module
  const p = moduleProgress(state, m)
  const stageIdx = STAGES.findIndex((s) => s.id === m.stage)
  return (
    <Pressable
      haptic
      onClick={() => navigate({ name: 'modulo', id: m.id })}
      className="relative flex w-full flex-col gap-5 overflow-hidden rounded-[26px] bg-fg p-5 text-left text-bg"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-bg/60">{rec.reason}</span>
        <span className="shrink-0 whitespace-nowrap font-mono text-[11px] text-bg/60">{m.minutes} min</span>
      </div>
      <div>
        <p className="text-[13px] text-bg/60">
          Etapa {stageIdx + 1} · {STAGES[stageIdx].title}
        </p>
        <h2 className="mt-1 font-display text-[28px] font-bold leading-[1.08] tracking-[-0.02em]">{m.title}</h2>
      </div>
      <p className="no-scrollbar overflow-x-auto whitespace-nowrap font-mono text-[12px] text-bg/55">{m.signature}</p>
      <div className="flex items-center gap-4">
        <ProgressBar value={p.ratio} inverted thick label={`Progresso em ${m.title}`} />
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-bg text-fg">
          <ArrowRight size={19} />
        </span>
      </div>
    </Pressable>
  )
}

function FinishedCard() {
  return (
    <div className="flex flex-col gap-3 rounded-[26px] bg-fg p-5 text-bg">
      <Trophy size={26} />
      <h2 className="font-display text-[26px] font-bold leading-tight">Trilha concluída.</h2>
      <p className="text-bg/70">Você passou pelos 22 módulos. Os projetos avançados são o melhor jeito de fixar tudo.</p>
      <button
        type="button"
        onClick={() => navigate({ name: 'projetos' })}
        className="mt-1 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-bg px-5 text-[14px] font-semibold text-fg"
      >
        Ver projetos <ArrowRight size={16} />
      </button>
    </div>
  )
}

function TodoList() {
  const todos = useStore((s) => s.todos)
  const addTodo = useStore((s) => s.addTodo)
  const toggleTodo = useStore((s) => s.toggleTodo)
  const removeTodo = useStore((s) => s.removeTodo)
  const restoreTodo = useStore((s) => s.restoreTodo)
  const clearDone = useStore((s) => s.clearDoneTodos)
  const showToast = useUI((s) => s.showToast)
  const [text, setText] = useState('')

  const open = todos.filter((t) => !t.done)
  const done = todos.filter((t) => t.done)
  const ordered = [...open, ...done]

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const v = text.trim()
    if (!v) return
    tap()
    addTodo(v)
    setText('')
  }

  const remove = (id: string) => {
    const removed = removeTodo(id)
    if (removed) showToast('Tarefa apagada', { label: 'Desfazer', run: () => restoreTodo(removed) })
  }

  return (
    <section className="gutter flex flex-col gap-3" aria-labelledby="todo-title">
      <div className="flex items-baseline justify-between">
        <h2 id="todo-title" className="text-[15px] font-semibold">
          Para estudar <span className="tnum font-normal text-muted">{open.length}</span>
        </h2>
        {done.length > 0 && (
          <button
            type="button"
            onClick={clearDone}
            className="text-[13px] text-muted underline-offset-4 hover:text-fg hover:underline"
          >
            Limpar concluídas
          </button>
        )}
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 rounded-full border border-line py-1 pl-4 pr-1 focus-within:border-fg">
        <label htmlFor="novo-todo" className="sr-only">
          Nova tarefa de estudo
        </label>
        <input
          id="novo-todo"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex.: refazer o quiz de generics"
          maxLength={120}
          autoComplete="off"
          enterKeyHint="done"
          className="h-10 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.9 }}
          disabled={!text.trim()}
          aria-label="Adicionar tarefa"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-fg text-bg transition-opacity disabled:opacity-25"
        >
          <Plus size={19} />
        </motion.button>
      </form>

      {ordered.length === 0 ? (
        <p className="py-6 text-center text-[14px] text-muted">Nada pendente. Adicione o que quer estudar hoje.</p>
      ) : (
        <ul className="flex flex-col">
          <AnimatePresence initial={false}>
            {ordered.map((t) => (
              <SwipeRow key={t.id} onDelete={() => remove(t.id)} label={t.text}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={t.done}
                  onClick={() => {
                    tap()
                    toggleTodo(t.id)
                  }}
                  className="flex w-full items-center gap-3.5 py-3 text-left"
                >
                  <CheckMark checked={t.done} />
                  <span
                    className={cx(
                      'min-w-0 flex-1 break-words text-[15px] leading-snug transition-colors',
                      t.done && 'text-muted line-through decoration-faint',
                    )}
                  >
                    {t.text}
                  </span>
                </button>
              </SwipeRow>
            ))}
          </AnimatePresence>
        </ul>
      )}
      {ordered.length > 0 && (
        <p className="text-center text-[12px] text-faint [@media(hover:hover)]:hidden">Deslize uma tarefa para a esquerda para apagar.</p>
      )}
    </section>
  )
}
