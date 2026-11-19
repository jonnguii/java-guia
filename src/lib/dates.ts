/** Chave de dia no fuso local: AAAA-MM-DD. */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

/** Segunda-feira 00:00 da semana de `d`. */
export function startOfWeek(d: Date = new Date()): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff = (r.getDay() + 6) % 7
  r.setDate(r.getDate() - diff)
  return r
}

/** Dias seguidos com atividade, terminando hoje ou ontem. */
export function streak(activity: Record<string, number>, today: Date = new Date()): number {
  let cursor = new Date(today)
  if (!activity[dayKey(cursor)]) cursor = addDays(cursor, -1)
  let n = 0
  while (activity[dayKey(cursor)]) {
    n++
    cursor = addDays(cursor, -1)
  }
  return n
}

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

export function shortDate(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function longToday(d: Date = new Date()): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`
}

export function greeting(d: Date = new Date()): string {
  const h = d.getHours()
  if (h < 5) return 'Boa madrugada'
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}
