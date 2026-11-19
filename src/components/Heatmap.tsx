import { useMemo, useState } from 'react'
import { addDays, dayKey, shortDate, startOfWeek } from '../lib/dates'

const WEEKS = 15
const ROW_LABELS = ['seg', '', 'qua', '', 'sex', '', '']

/** Intensidade em um único tom (preto → cinza), do vazio ao mais ativo. */
function level(n: number): number {
  if (n <= 0) return 0
  if (n <= 2) return 1
  if (n <= 5) return 2
  if (n <= 9) return 3
  return 4
}

const FILL = ['var(--surface-2)', 'color-mix(in oklab, var(--fg) 28%, var(--bg))', 'color-mix(in oklab, var(--fg) 52%, var(--bg))', 'color-mix(in oklab, var(--fg) 76%, var(--bg))', 'var(--fg)']

export function Heatmap({ activity }: { activity: Record<string, number> }) {
  const today = new Date()
  const todayKey = dayKey(today)
  const start = addDays(startOfWeek(today), -(WEEKS - 1) * 7)
  const [hover, setHover] = useState<string | null>(null)

  const cols = useMemo(() => {
    const out: { key: string; date: Date; n: number; future: boolean }[][] = []
    for (let w = 0; w < WEEKS; w++) {
      const col = []
      for (let d = 0; d < 7; d++) {
        const date = addDays(start, w * 7 + d)
        const key = dayKey(date)
        col.push({ key, date, n: activity[key] ?? 0, future: date > today && key !== todayKey })
      }
      out.push(col)
    }
    return out
  }, [activity, todayKey])

  const total = cols.flat().reduce((s, c) => s + c.n, 0)
  const activeDays = cols.flat().filter((c) => c.n > 0).length
  const focused = hover ? cols.flat().find((c) => c.key === hover) : null

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="grid shrink-0 grid-rows-7 gap-[3px] pt-px text-[9px] leading-none text-muted" aria-hidden>
          {ROW_LABELS.map((l, i) => (
            <span key={i} className="flex h-full items-center">
              {l}
            </span>
          ))}
        </div>
        <div
          className="grid min-w-0 flex-1 gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
          role="grid"
          aria-label={`Atividade nas últimas ${WEEKS} semanas: ${total} ações em ${activeDays} dias`}
          onMouseLeave={() => setHover(null)}
        >
          {cols.map((col, w) => (
            <div key={w} className="grid grid-rows-7 gap-[3px]" role="row">
              {col.map((c) =>
                c.future ? (
                  <span key={c.key} className="aspect-square" aria-hidden />
                ) : (
                  <button
                    key={c.key}
                    type="button"
                    role="gridcell"
                    aria-label={`${shortDate(c.date)}: ${c.n} ${c.n === 1 ? 'ação' : 'ações'}`}
                    onMouseEnter={() => setHover(c.key)}
                    onFocus={() => setHover(c.key)}
                    onClick={() => setHover(c.key)}
                    className="aspect-square w-full rounded-[3px] outline-offset-1"
                    style={{
                      background: FILL[level(c.n)],
                      boxShadow: c.key === todayKey ? 'inset 0 0 0 1.5px var(--fg)' : undefined,
                    }}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 text-[12px] text-muted">
        <span className="tnum min-h-4" aria-live="polite">
          {focused
            ? `${shortDate(focused.date)} · ${focused.n} ${focused.n === 1 ? 'ação' : 'ações'}`
            : `${activeDays} ${activeDays === 1 ? 'dia ativo' : 'dias ativos'} · ${total} ${total === 1 ? 'ação' : 'ações'}`}
        </span>
        <span className="flex items-center gap-1" aria-hidden>
          menos
          {FILL.map((f, i) => (
            <span key={i} className="size-2.5 rounded-[2px]" style={{ background: f }} />
          ))}
          mais
        </span>
      </div>
    </div>
  )
}
