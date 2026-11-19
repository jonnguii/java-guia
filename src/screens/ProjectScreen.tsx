import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { findProject, projectProgress, projectTasks } from '../lib/projects'
import { navigate, type Route } from '../lib/router'
import { useStore, useUI } from '../lib/store'
import { tap } from '../lib/haptics'
import { StackHeader } from '../components/Chrome'
import { SwipeRow } from '../components/SwipeRow'
import { CheckMark, CheckRow, Chip, CountUp, PrimaryButton, ProgressBar, cx } from '../components/ui'

export function ProjectScreen({ route, id }: { route: Route; id: string }) {
  const state = useStore()
  const p = findProject(state, id)
  const startProject = useStore((s) => s.startProject)
  const stopProject = useStore((s) => s.stopProject)
  const deleteProject = useStore((s) => s.deleteProject)
  const toggleTask = useStore((s) => s.toggleProjectTask)
  const addTask = useStore((s) => s.addProjectTask)
  const removeTask = useStore((s) => s.removeProjectTask)
  const showToast = useUI((s) => s.showToast)
  const [text, setText] = useState('')
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!confirming) return
    const t = setTimeout(() => setConfirming(false), 3500)
    return () => clearTimeout(t)
  }, [confirming])

  if (!p) {
    return (
      <>
        <StackHeader route={route} title="Projeto" />
        <div className="gutter flex flex-col gap-4 pt-6">
          <h1 className="font-display text-[28px] font-bold">Projeto não encontrado.</h1>
          <p className="text-muted">Ele pode ter sido apagado.</p>
          <PrimaryButton onClick={() => navigate({ name: 'projetos' }, { replace: true })}>Ver projetos</PrimaryButton>
        </div>
      </>
    )
  }

  const started = state.startedProjects.includes(p.id)
  const tasks = projectTasks(state, p)
  const pr = projectProgress(state, p)
  const finished = pr.total > 0 && pr.done === pr.total

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const v = text.trim()
    if (!v) return
    tap()
    addTask(p.id, v)
    if (!started) startProject(p.id)
    setText('')
  }

  const toggle = (taskId: string) => {
    const wasDone = Boolean(state.projectDone[`${p.id}:${taskId}`])
    toggleTask(p.id, taskId)
    if (!wasDone && pr.done + 1 === pr.total) {
      tap([10, 60, 10, 60, 20])
      showToast('Projeto concluído')
    }
  }

  const leave = () => {
    if (!confirming) {
      tap()
      setConfirming(true)
      return
    }
    if (p.custom) deleteProject(p.id)
    else stopProject(p.id)
    showToast(p.custom ? 'Projeto apagado' : 'Projeto removido da sua lista')
    navigate({ name: 'projetos' }, { replace: true })
  }

  return (
    <>
      <StackHeader route={route} title={p.title} />
      <div className="gutter flex flex-col gap-8 pb-20 pt-2">
        <header className="flex flex-col gap-4">
          <p className="label">{p.level === 'Pessoal' ? 'Projeto pessoal' : `Projeto · ${p.level}`}</p>
          <h1 className="font-display text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em]">{p.title}</h1>
          {p.pitch && <p className="text-[16px] text-muted">{p.pitch}</p>}
          {p.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {p.skills.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          )}
        </header>

        <section className="relative flex flex-col gap-3 rounded-[22px] bg-surface p-4">
          <div className="flex items-end justify-between gap-3">
            <span className="text-[48px] font-semibold leading-none tracking-tight">
              <CountUp value={Math.round(pr.ratio * 100)} suffix="%" />
            </span>
            <span className="tnum pb-1 text-[14px] text-muted">
              {pr.done} de {pr.total} tarefas
            </span>
          </div>
          <ProgressBar value={pr.ratio} thick label={`Progresso em ${p.title}`} />
          <AnimatePresence>
            {finished && (
              <motion.span
                initial={{ scale: 1.6, rotate: -14, opacity: 0 }}
                animate={{ scale: 1, rotate: -8, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                className="absolute -top-3 right-4 rounded-md border-2 border-fg bg-bg px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.12em]"
              >
                Concluído
              </motion.span>
            )}
          </AnimatePresence>
        </section>

        {!started && (
          <PrimaryButton
            onClick={() => {
              startProject(p.id)
              showToast('Projeto adicionado aos seus projetos')
            }}
            className="w-full"
          >
            Começar este projeto
          </PrimaryButton>
        )}

        <section className="flex flex-col gap-2" aria-labelledby="tarefas">
          <h2 id="tarefas" className="font-display text-[22px] font-bold tracking-[-0.02em]">
            Tarefas
          </h2>
          <ul className="divide-y divide-line border-y border-line">
            <AnimatePresence initial={false}>
              {tasks.map((t) => {
                const done = Boolean(state.projectDone[`${p.id}:${t.id}`])
                return t.custom ? (
                  <SwipeRow key={t.id} label={t.text} onDelete={() => removeTask(p.id, t.id)}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={done}
                      onClick={() => {
                        tap()
                        toggle(t.id)
                      }}
                      className="flex w-full items-start gap-3.5 py-3 text-left"
                    >
                      <span className="pt-px">
                        <CheckMark checked={done} />
                      </span>
                      <span
                        className={cx(
                          'min-w-0 flex-1 break-words text-[15px] leading-snug',
                          done && 'text-muted line-through decoration-faint',
                        )}
                      >
                        {t.text}
                      </span>
                    </button>
                  </SwipeRow>
                ) : (
                  <li key={t.id}>
                    <CheckRow checked={done} onToggle={() => toggle(t.id)}>
                      {t.text}
                    </CheckRow>
                  </li>
                )
              })}
            </AnimatePresence>
          </ul>

          <form
            onSubmit={submit}
            className="mt-3 flex items-center gap-2 rounded-full border border-line py-1 pl-4 pr-1 focus-within:border-fg"
          >
            <label htmlFor="nova-tarefa" className="sr-only">
              Nova tarefa do projeto
            </label>
            <input
              id="nova-tarefa"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Adicionar tarefa"
              maxLength={120}
              autoComplete="off"
              enterKeyHint="done"
              className="h-10 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              disabled={!text.trim()}
              aria-label="Adicionar tarefa ao projeto"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-fg text-bg transition-opacity disabled:opacity-25"
            >
              <Plus size={19} />
            </motion.button>
          </form>
        </section>

        {(started || p.custom) && (
          <button
            type="button"
            onClick={leave}
            className={cx(
              'h-12 rounded-full text-[14px] font-medium transition-colors',
              confirming ? 'bg-fg text-bg' : 'text-muted hover:bg-surface hover:text-fg',
            )}
          >
            {confirming
              ? 'Toque de novo para confirmar'
              : p.custom
                ? 'Apagar projeto'
                : 'Remover dos meus projetos'}
          </button>
        )}
      </div>
    </>
  )
}
