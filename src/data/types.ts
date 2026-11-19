export type AreaId =
  | 'fundamentos'
  | 'poo'
  | 'excecoes'
  | 'colecoes'
  | 'funcional'
  | 'concorrencia'
  | 'jvm'
  | 'ecossistema'

export type StageId = 'base' | 'objetos' | 'intermediario' | 'avancado' | 'ecossistema'

export type CodeLang = 'java' | 'xml' | 'shell'

/** Texto aceita `código inline` e **negrito**. */
export type Block =
  | { kind: 'text'; body: string }
  | { kind: 'code'; code: string; lang?: CodeLang; caption?: string }
  | { kind: 'tip'; body: string }
  | { kind: 'pitfall'; body: string }
  | { kind: 'list'; items: string[] }

export type Section = { title: string; blocks: Block[] }

export type Question = {
  q: string
  code?: string
  options: string[]
  answer: number
  why: string
}

export type Module = {
  id: string
  stage: StageId
  area: AreaId
  title: string
  summary: string
  minutes: number
  /** Uma linha de Java que resume o módulo, mostrada no card. */
  signature: string
  sections: Section[]
  checklist: string[]
  quiz: Question[]
}

export type Stage = { id: StageId; title: string; short: string; description: string }

export type Area = { id: AreaId; label: string }

export type ProjectLevel = 'Iniciante' | 'Básico' | 'Intermediário' | 'Avançado' | 'Pessoal'

export type ProjectTask = { id: string; text: string }

export type Project = {
  id: string
  title: string
  level: ProjectLevel
  pitch: string
  skills: string[]
  tasks: ProjectTask[]
  custom?: boolean
}
