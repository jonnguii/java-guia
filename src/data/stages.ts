import type { Area, AreaId, Stage } from './types'

export const STAGES: Stage[] = [
  {
    id: 'base',
    title: 'Fundamentos',
    short: 'Base',
    description: 'Sintaxe, tipos, controle de fluxo e métodos. Tudo que vem antes de pensar em objetos.',
  },
  {
    id: 'objetos',
    title: 'Orientação a Objetos',
    short: 'POO',
    description: 'Classes, herança, interfaces e os contratos que fazem objetos se comportarem bem.',
  },
  {
    id: 'intermediario',
    title: 'Intermediário',
    short: 'Inter.',
    description: 'Exceções, coleções, generics e o estilo funcional com lambdas e streams.',
  },
  {
    id: 'avancado',
    title: 'Avançado',
    short: 'Avanç.',
    description: 'Concorrência, o funcionamento interno da JVM e o Java moderno com pattern matching.',
  },
  {
    id: 'ecossistema',
    title: 'Ecossistema',
    short: 'Ecos.',
    description: 'Ferramentas de build, testes, Spring Boot e as práticas de quem trabalha com Java.',
  },
]

export const AREAS: Area[] = [
  { id: 'fundamentos', label: 'Fundamentos' },
  { id: 'poo', label: 'Orientação a objetos' },
  { id: 'excecoes', label: 'Exceções' },
  { id: 'colecoes', label: 'Coleções e generics' },
  { id: 'funcional', label: 'Lambdas e streams' },
  { id: 'concorrencia', label: 'Concorrência' },
  { id: 'jvm', label: 'JVM por dentro' },
  { id: 'ecossistema', label: 'Ecossistema' },
]

export const AREA_LABEL: Record<AreaId, string> = Object.fromEntries(
  AREAS.map((a) => [a.id, a.label]),
) as Record<AreaId, string>
