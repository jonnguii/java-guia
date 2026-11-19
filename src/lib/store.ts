import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AreaId, Project, ProjectTask } from '../data/types'
import { safeStorage } from './storage'
import { dayKey } from './dates'
import { uid } from './id'

export type Theme = 'system' | 'light' | 'dark'
export type Level = 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado'

export type Todo = { id: string; text: string; done: boolean; createdAt: number; doneAt?: number }

export type QuizRecord = {
  /** Acertou na primeira tentativa? É o que conta para a taxa de acerto. */
  firstCorrect: boolean
  correct: boolean
  attempts: number
  at: number
}

export type AssessmentResult = {
  at: number
  answers: Record<string, number | null>
  scores: Record<AreaId, number>
  overall: number
  level: Level
}

type Data = {
  theme: Theme
  weeklyGoal: number
  welcomed: boolean
  assessment: AssessmentResult | null
  completed: Record<string, number>
  checks: Record<string, boolean>
  quiz: Record<string, QuizRecord>
  review: string[]
  todos: Todo[]
  startedProjects: string[]
  projectDone: Record<string, boolean>
  customTasks: Record<string, ProjectTask[]>
  customProjects: Project[]
  activity: Record<string, number>
  lastModule: string | null
}

type Actions = {
  setTheme: (t: Theme) => void
  setWeeklyGoal: (n: number) => void
  setWelcomed: () => void
  saveAssessment: (r: AssessmentResult) => void
  toggleComplete: (moduleId: string) => void
  toggleCheck: (key: string) => void
  answerQuiz: (key: string, correct: boolean) => void
  answerReview: (key: string, correct: boolean) => void
  visitModule: (moduleId: string) => void
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  removeTodo: (id: string) => Todo | undefined
  restoreTodo: (todo: Todo) => void
  clearDoneTodos: () => void
  startProject: (id: string) => void
  stopProject: (id: string) => void
  toggleProjectTask: (projectId: string, taskId: string) => void
  addProjectTask: (projectId: string, text: string) => void
  removeProjectTask: (projectId: string, taskId: string) => void
  createProject: (title: string, pitch: string) => string
  deleteProject: (id: string) => void
  resetAll: () => void
}

const today = () => dayKey()

const initial: Data = {
  theme: 'system',
  weeklyGoal: 3,
  welcomed: false,
  assessment: null,
  completed: {},
  checks: {},
  quiz: {},
  review: [],
  todos: [
    { id: 'exemplo-1', text: 'Instalar o JDK 25 e rodar java -version', done: false, createdAt: 0 },
    { id: 'exemplo-2', text: 'Testar três expressões no jshell', done: false, createdAt: 0 },
  ],
  startedProjects: [],
  projectDone: {},
  customTasks: {},
  customProjects: [],
  activity: {},
  lastModule: null,
}

function bump(activity: Record<string, number>, by = 1) {
  const k = today()
  return { ...activity, [k]: Math.max(0, (activity[k] ?? 0) + by) }
}

export const useStore = create<Data & Actions>()(
  persist(
    (set, get) => ({
      ...initial,

      setTheme: (theme) => set({ theme }),
      setWeeklyGoal: (weeklyGoal) => set({ weeklyGoal }),
      setWelcomed: () => set({ welcomed: true }),
      saveAssessment: (assessment) =>
        set((s) => ({ assessment, welcomed: true, activity: bump(s.activity) })),

      toggleComplete: (id) =>
        set((s) => {
          const completed = { ...s.completed }
          if (completed[id]) {
            delete completed[id]
            return { completed, activity: bump(s.activity, -1) }
          }
          completed[id] = Date.now()
          return { completed, activity: bump(s.activity) }
        }),

      toggleCheck: (key) =>
        set((s) => {
          const next = !s.checks[key]
          return { checks: { ...s.checks, [key]: next }, activity: next ? bump(s.activity) : s.activity }
        }),

      answerQuiz: (key, correct) =>
        set((s) => {
          const prev = s.quiz[key]
          const record: QuizRecord = prev
            ? { ...prev, correct, attempts: prev.attempts + 1, at: Date.now() }
            : { firstCorrect: correct, correct, attempts: 1, at: Date.now() }
          const inReview = s.review.includes(key)
          const review = !correct && !inReview ? [...s.review, key] : s.review
          return { quiz: { ...s.quiz, [key]: record }, review, activity: bump(s.activity) }
        }),

      answerReview: (key, correct) =>
        set((s) => {
          const rest = s.review.filter((k) => k !== key)
          const prev = s.quiz[key]
          return {
            review: correct ? rest : [...rest, key],
            quiz: prev ? { ...s.quiz, [key]: { ...prev, correct, attempts: prev.attempts + 1, at: Date.now() } } : s.quiz,
            activity: bump(s.activity),
          }
        }),

      visitModule: (id) => {
        if (get().lastModule !== id) set({ lastModule: id })
      },

      addTodo: (text) =>
        set((s) => ({ todos: [{ id: uid(), text, done: false, createdAt: Date.now() }, ...s.todos] })),
      toggleTodo: (id) =>
        set((s) => {
          let nowDone = false
          const todos = s.todos.map((t) => {
            if (t.id !== id) return t
            nowDone = !t.done
            return { ...t, done: nowDone, doneAt: nowDone ? Date.now() : undefined }
          })
          return { todos, activity: nowDone ? bump(s.activity) : s.activity }
        }),
      removeTodo: (id) => {
        const todo = get().todos.find((t) => t.id === id)
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }))
        return todo
      },
      restoreTodo: (todo) =>
        set((s) => (s.todos.some((t) => t.id === todo.id) ? s : { todos: [todo, ...s.todos] })),
      clearDoneTodos: () => set((s) => ({ todos: s.todos.filter((t) => !t.done) })),

      startProject: (id) =>
        set((s) => (s.startedProjects.includes(id) ? s : { startedProjects: [id, ...s.startedProjects] })),
      stopProject: (id) => set((s) => ({ startedProjects: s.startedProjects.filter((p) => p !== id) })),
      toggleProjectTask: (projectId, taskId) =>
        set((s) => {
          const key = `${projectId}:${taskId}`
          const next = !s.projectDone[key]
          return {
            projectDone: { ...s.projectDone, [key]: next },
            startedProjects: s.startedProjects.includes(projectId) ? s.startedProjects : [projectId, ...s.startedProjects],
            activity: next ? bump(s.activity) : s.activity,
          }
        }),
      addProjectTask: (projectId, text) =>
        set((s) => ({
          customTasks: {
            ...s.customTasks,
            [projectId]: [...(s.customTasks[projectId] ?? []), { id: `c-${uid()}`, text }],
          },
        })),
      removeProjectTask: (projectId, taskId) =>
        set((s) => {
          const projectDone = { ...s.projectDone }
          delete projectDone[`${projectId}:${taskId}`]
          return {
            projectDone,
            customTasks: {
              ...s.customTasks,
              [projectId]: (s.customTasks[projectId] ?? []).filter((t) => t.id !== taskId),
            },
          }
        }),
      createProject: (title, pitch) => {
        const id = `meu-${uid()}`
        set((s) => ({
          customProjects: [
            { id, title, pitch, level: 'Pessoal', skills: [], tasks: [], custom: true },
            ...s.customProjects,
          ],
          startedProjects: [id, ...s.startedProjects],
        }))
        return id
      },
      deleteProject: (id) =>
        set((s) => {
          const customTasks = { ...s.customTasks }
          delete customTasks[id]
          const projectDone = Object.fromEntries(
            Object.entries(s.projectDone).filter(([k]) => !k.startsWith(`${id}:`)),
          )
          return {
            customProjects: s.customProjects.filter((p) => p.id !== id),
            startedProjects: s.startedProjects.filter((p) => p !== id),
            customTasks,
            projectDone,
          }
        }),

      resetAll: () => set({ ...initial, theme: get().theme, welcomed: true }),
    }),
    {
      name: 'java-guia-v1',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
    },
  ),
)

/** Estado efêmero da interface: avisos e folhas abertas. Não é salvo. */
type Toast = { id: number; text: string; action?: { label: string; run: () => void } }

type UI = {
  toast: Toast | null
  showToast: (text: string, action?: Toast['action']) => void
  hideToast: () => void
  settingsOpen: boolean
  setSettingsOpen: (open: boolean) => void
}

let toastTimer: ReturnType<typeof setTimeout> | undefined

export const useUI = create<UI>()((set) => ({
  toast: null,
  showToast: (text, action) => {
    clearTimeout(toastTimer)
    const id = Date.now()
    set({ toast: { id, text, action } })
    toastTimer = setTimeout(() => set((s) => (s.toast?.id === id ? { toast: null } : s)), action ? 5000 : 2600)
  },
  hideToast: () => set({ toast: null }),
  settingsOpen: false,
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
}))
