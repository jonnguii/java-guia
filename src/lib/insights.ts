import { ASSESSMENT } from '../data/assessment'
import { MODULES } from '../data/modules'
import { AREAS, STAGES } from '../data/stages'
import type { AreaId, Module, StageId } from '../data/types'
import { addDays, dayKey, startOfWeek } from './dates'
import type { AssessmentResult, Level, useStore } from './store'

type State = ReturnType<typeof useStore.getState>

// ─── Nivelamento ───────────────────────────────────────────

export function levelFor(overall: number): Level {
  if (overall < 25) return 'Iniciante'
  if (overall < 50) return 'Básico'
  if (overall < 75) return 'Intermediário'
  return 'Avançado'
}

export const LEVEL_INFO: Record<Level, { headline: string; advice: string; startStage: StageId }> = {
  Iniciante: {
    headline: 'Você está começando.',
    advice: 'Siga a trilha na ordem. Os Fundamentos são a base de tudo o que vem depois.',
    startStage: 'base',
  },
  Básico: {
    headline: 'Você já entende a sintaxe.',
    advice: 'Revise os pontos fracos dos Fundamentos e avance para Orientação a Objetos.',
    startStage: 'objetos',
  },
  Intermediário: {
    headline: 'Você escreve Java com segurança.',
    advice: 'Aprofunde coleções, streams e exceções, e comece um projeto com Spring Boot.',
    startStage: 'intermediario',
  },
  Avançado: {
    headline: 'Você domina a linguagem.',
    advice: 'Foque em concorrência, JVM e no ecossistema. Os projetos avançados são o seu próximo passo.',
    startStage: 'avancado',
  },
}

export function scoreAssessment(answers: Record<string, number | null>): AssessmentResult {
  const earned: Partial<Record<AreaId, number>> = {}
  const possible: Partial<Record<AreaId, number>> = {}
  for (const q of ASSESSMENT) {
    possible[q.area] = (possible[q.area] ?? 0) + q.weight
    if (answers[q.id] === q.answer) earned[q.area] = (earned[q.area] ?? 0) + q.weight
  }
  const scores = Object.fromEntries(
    AREAS.map((a) => [a.id, Math.round(((earned[a.id] ?? 0) / (possible[a.id] || 1)) * 100)]),
  ) as Record<AreaId, number>
  const overall = Math.round(AREAS.reduce((sum, a) => sum + scores[a.id], 0) / AREAS.length)
  return { at: Date.now(), answers, scores, overall, level: levelFor(overall) }
}

// ─── Progresso ───────────────────────────────────────────

export type ModuleProgress = {
  done: boolean
  checks: number
  answered: number
  /** 0 a 1. Concluir o módulo é o que leva a 1. */
  ratio: number
}

export function moduleProgress(s: State, m: Module): ModuleProgress {
  const checks = m.checklist.filter((_, i) => s.checks[`${m.id}:${i}`]).length
  const answered = m.quiz.filter((_, i) => s.quiz[`${m.id}:${i}`]).length
  const done = Boolean(s.completed[m.id])
  const parts = m.checklist.length + m.quiz.length
  const ratio = done ? 1 : ((checks + answered) / parts) * 0.9
  return { done, checks, answered, ratio }
}

export function stageProgress(s: State, stage: StageId) {
  const mods = MODULES.filter((m) => m.stage === stage)
  const done = mods.filter((m) => s.completed[m.id]).length
  return { done, total: mods.length, ratio: done / mods.length }
}

export function overallProgress(s: State) {
  const done = MODULES.filter((m) => s.completed[m.id]).length
  return { done, total: MODULES.length, ratio: done / MODULES.length }
}

// ─── Desempenho ───────────────────────────────────────────

export type AreaStat = {
  id: AreaId
  label: string
  modules: Module[]
  completion: number
  /** Acerto na primeira tentativa dos quizzes da área; null se nada foi respondido. */
  accuracy: number | null
  /** Acerto ou, sem quizzes respondidos, a nota do nivelamento. */
  knowledge: number
  knowledgeSource: 'quiz' | 'nivelamento' | 'nenhum'
  mastery: number
}

export function areaStats(s: State): AreaStat[] {
  return AREAS.map((a) => {
    const modules = MODULES.filter((m) => m.area === a.id)
    const completion = modules.filter((m) => s.completed[m.id]).length / modules.length
    let answered = 0
    let right = 0
    for (const m of modules) {
      m.quiz.forEach((_, i) => {
        const r = s.quiz[`${m.id}:${i}`]
        if (r) {
          answered++
          if (r.firstCorrect) right++
        }
      })
    }
    const accuracy = answered ? right / answered : null
    let knowledge = 0
    let knowledgeSource: AreaStat['knowledgeSource'] = 'nenhum'
    if (accuracy !== null) {
      knowledge = accuracy
      knowledgeSource = 'quiz'
    } else if (s.assessment) {
      knowledge = s.assessment.scores[a.id] / 100
      knowledgeSource = 'nivelamento'
    }
    const mastery = Math.round((0.6 * completion + 0.4 * knowledge) * 100)
    return { id: a.id, label: a.label, modules, completion, accuracy, knowledge, knowledgeSource, mastery }
  })
}

export function quizTotals(s: State) {
  const records = Object.values(s.quiz)
  const right = records.filter((r) => r.firstCorrect).length
  return { answered: records.length, right, accuracy: records.length ? right / records.length : null }
}

/** Dias com atividade nos últimos 14 dias, incluindo hoje. */
export function activeDays(s: State, days = 14, today = new Date()) {
  let n = 0
  for (let i = 0; i < days; i++) if (s.activity[dayKey(addDays(today, -i))]) n++
  return n
}

export function performanceIndex(s: State) {
  const progress = overallProgress(s).ratio
  const accuracy = quizTotals(s).accuracy ?? 0
  const consistency = activeDays(s) / 14
  const index = Math.round((0.4 * progress + 0.4 * accuracy + 0.2 * consistency) * 100)
  return { index, progress, accuracy, consistency }
}

export function weekCompleted(s: State, now = new Date()) {
  const start = startOfWeek(now).getTime()
  return Object.values(s.completed).filter((t) => t >= start).length
}

// ─── Recomendação ───────────────────────────────────────────

const WEAK = 67

/** Áreas com nota abaixo de 67% no nivelamento, da mais fraca para a mais forte. */
export function focusAreas(s: State): { id: AreaId; label: string; score: number }[] {
  if (!s.assessment) return []
  const a = s.assessment
  return AREAS.filter((x) => a.scores[x.id] < WEAK)
    .map((x) => ({ id: x.id, label: x.label, score: a.scores[x.id] }))
    .sort((x, y) => x.score - y.score)
}

export function recommendedModule(s: State): { module: Module; reason: string } | null {
  const open = MODULES.filter((m) => !s.completed[m.id])
  if (open.length === 0) return null

  const last = s.lastModule ? open.find((m) => m.id === s.lastModule) : undefined
  const started = last && moduleProgress(s, last).ratio > 0
  if (last && started) return { module: last, reason: 'Você parou aqui' }

  if (s.assessment) {
    const focus = focusAreas(s)
    // Fundamentos fracos vêm antes de qualquer outra coisa.
    const ordered = focus.some((f) => f.id === 'fundamentos')
      ? [focus.find((f) => f.id === 'fundamentos')!, ...focus.filter((f) => f.id !== 'fundamentos')]
      : focus
    for (const f of ordered) {
      const m = open.find((x) => x.area === f.id)
      if (m) return { module: m, reason: `Ponto fraco: ${f.label.toLowerCase()} (${f.score}%)` }
    }
    const startStage = LEVEL_INFO[s.assessment.level].startStage
    const stageIdx = STAGES.findIndex((x) => x.id === startStage)
    const fromLevel = open.find((m) => STAGES.findIndex((x) => x.id === m.stage) >= stageIdx)
    if (fromLevel) return { module: fromLevel, reason: `Próximo passo para o nível ${s.assessment.level.toLowerCase()}` }
  }

  return { module: open[0], reason: last ? 'Próximo da trilha' : 'Comece por aqui' }
}

export function nextInTrack(id: string): Module | undefined {
  const i = MODULES.findIndex((m) => m.id === id)
  return MODULES[i + 1]
}
