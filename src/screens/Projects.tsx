import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import { PROJECTS } from '../data/projects'
import type { Project, ProjectLevel } from '../data/types'
import { allProjects, projectProgress } from '../lib/projects'
import { navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { Sheet } from '../components/Sheet'
import { Chip, Pressable, PrimaryButton, ProgressBar, Segmented } from '../components/ui'

type View = 'ativos' | 'explorar'
const LEVEL_ORDER: ProjectLevel[] = ['Iniciante', 'Básico', 'Intermediário', 'Avançado']

let rememberedView: View | null = null

export function Projects() {
  const state = useStore()
  const createProject = useStore((s) => s.createProject)
  const active = allProjects(state).filter((p) => state.startedProjects.includes(p.id))
  const [view, setView] = useState<View>(rememberedView ?? (active.length ? 'ativos' : 'explorar'))
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [pitch, setPitch] = useState('')

  const myLevel = state.assessment?.level
  const explore = PROJECTS.filter((p) => !state.startedProjects.includes(p.id))

  const change = (v: View) => {
    rememberedView = v
    setView(v)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    const id = createProject(t, pitch.trim())
    setCreating(false)
    setTitle('')
    setPitch('')
    rememberedView = 'ativos'
    navigate({ name: 'projeto', id })
  }

  return (
    <div className="flex flex-col gap-6 pb-36" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}>
      <header className="gutter flex items-end justify-between gap-4 pt-2">
        <div>
          <h1 className="font-display text-[34px] font-extrabold leading-tight tracking-[-0.03em]">Projetos</h1>
          <p className="text-[14px] text-muted">Aprenda construindo. Cada projeto vira uma lista de tarefas.</p>
        </div>
        <Pressable
          onClick={() => setCreating(true)}
          aria-label="Novo projeto"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-fg text-bg"
        >
          <Plus size={20} />
        </Pressable>
      </header>

      <div className="gutter">
        <Segmented<View>
          label="Lista de projetos"
          value={view}
          onChange={change}
          options={[
            { id: 'ativos', label: `Em andamento · ${active.length}` },
            { id: 'explorar', label: 'Explorar' },
          ]}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0, x: view === 'ativos' ? -12 : 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: view === 'ativos' ? 12 : -12 }}
          transition={{ duration: 0.18 }}
          className="gutter flex flex-col gap-3"
        >
          {view === 'ativos' ? (
            active.length === 0 ? (
              <div className="flex flex-col items-start gap-3 rounded-[22px] border border-dashed border-line p-5">
                <p className="font-semibold">Nenhum projeto em andamento.</p>
                <p className="text-[14px] text-muted">Escolha um em Explorar ou crie o seu com o botão +.</p>
                <button
                  type="button"
                  onClick={() => change('explorar')}
                  className="text-[14px] font-semibold underline underline-offset-4"
                >
                  Explorar projetos
                </button>
              </div>
            ) : (
              active.map((p, i) => <ActiveCard key={p.id} p={p} i={i} />)
            )
          ) : (
            <>
              {LEVEL_ORDER.map((level) => {
                const items = explore.filter((p) => p.level === level)
                if (items.length === 0) return null
                return (
                  <div key={level} className="flex flex-col gap-3 pt-2 first:pt-0">
                    <p className="label">
                      {level}
                      {myLevel === level && ' · o seu nível'}
                    </p>
                    {items.map((p) => (
                      <ExploreCard key={p.id} p={p} />
                    ))}
                  </div>
                )
              })}
              {explore.length === 0 && (
                <p className="py-8 text-center text-[14px] text-muted">Você já começou todos os projetos sugeridos.</p>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <Sheet open={creating} onClose={() => setCreating(false)} title="Novo projeto">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="proj-titulo" className="text-[13px] font-medium">
              Nome
            </label>
            <input
              id="proj-titulo"
              data-autofocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              placeholder="Ex.: Controle de gastos com Spring"
              className="h-12 rounded-2xl border border-line bg-transparent px-4 text-[15px] outline-none placeholder:text-faint focus:border-fg"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="proj-desc" className="text-[13px] font-medium">
              Objetivo <span className="font-normal text-muted">(opcional)</span>
            </label>
            <textarea
              id="proj-desc"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              maxLength={160}
              rows={3}
              placeholder="O que o projeto deve fazer?"
              className="resize-none rounded-2xl border border-line bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-faint focus:border-fg"
            />
          </div>
          <PrimaryButton type="submit" disabled={!title.trim()} className="mt-1 w-full">
            Criar e adicionar tarefas
          </PrimaryButton>
        </form>
      </Sheet>
    </div>
  )
}

function ActiveCard({ p, i }: { p: Project; i: number }) {
  const state = useStore()
  const pr = projectProgress(state, p)
  const finished = pr.total > 0 && pr.done === pr.total
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
      <Pressable
        onClick={() => navigate({ name: 'projeto', id: p.id })}
        className="flex w-full flex-col gap-4 rounded-[22px] border border-line p-4 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[17px] font-semibold leading-snug">{p.title}</p>
            <p className="mt-0.5 text-[13px] text-muted">{p.level}</p>
          </div>
          <span className="tnum shrink-0 text-[22px] font-semibold leading-none">{Math.round(pr.ratio * 100)}%</span>
        </div>
        <ProgressBar value={pr.ratio} label={`Progresso em ${p.title}`} />
        <p className="truncate text-[13px] text-muted">
          {finished ? 'Todas as tarefas concluídas' : pr.next ? `Próxima: ${pr.next.text}` : 'Adicione a primeira tarefa'}
        </p>
      </Pressable>
    </motion.div>
  )
}

function ExploreCard({ p }: { p: Project }) {
  return (
    <Pressable
      onClick={() => navigate({ name: 'projeto', id: p.id })}
      className="flex w-full flex-col gap-3 rounded-[22px] bg-surface p-4 text-left"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[17px] font-semibold leading-snug">{p.title}</p>
        <ArrowRight size={18} className="mt-0.5 shrink-0 text-muted" />
      </div>
      <p className="text-[14px] leading-snug text-muted">{p.pitch}</p>
      <div className="flex flex-wrap gap-1.5">
        {p.skills.map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
        <Chip>{p.tasks.length} tarefas</Chip>
      </div>
    </Pressable>
  )
}
