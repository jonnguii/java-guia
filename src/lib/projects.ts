import { PROJECTS } from '../data/projects'
import type { Project, ProjectTask } from '../data/types'
import type { useStore } from './store'

type State = ReturnType<typeof useStore.getState>

export function allProjects(s: State): Project[] {
  return [...s.customProjects, ...PROJECTS]
}

export function findProject(s: State, id: string): Project | undefined {
  return allProjects(s).find((p) => p.id === id)
}

export function projectTasks(s: State, p: Project): (ProjectTask & { custom: boolean })[] {
  return [
    ...p.tasks.map((t) => ({ ...t, custom: false })),
    ...(s.customTasks[p.id] ?? []).map((t) => ({ ...t, custom: true })),
  ]
}

export function projectProgress(s: State, p: Project) {
  const tasks = projectTasks(s, p)
  const done = tasks.filter((t) => s.projectDone[`${p.id}:${t.id}`]).length
  const next = tasks.find((t) => !s.projectDone[`${p.id}:${t.id}`])
  return { done, total: tasks.length, ratio: tasks.length ? done / tasks.length : 0, next }
}
