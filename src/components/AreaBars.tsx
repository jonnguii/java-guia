import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { AreaId } from '../data/types'
import { tap } from '../lib/haptics'
import { cx, softSpring } from './ui'

export type AreaRow = { id: AreaId; label: string; value: number }

/**
 * Barras horizontais de uma série só (0–100%). Barra fina, ponta arredondada só no lado do dado,
 * valor na ponta. Áreas abaixo do limite ganham a etiqueta "foco", então nada depende de cor.
 */
export function AreaBars({
  rows,
  threshold,
  detail,
}: {
  rows: AreaRow[]
  threshold?: number
  detail?: (row: AreaRow) => ReactNode
}) {
  const [open, setOpen] = useState<AreaId | null>(null)

  return (
    <ul className="flex flex-col">
      {rows.map((r, i) => {
        const weak = threshold !== undefined && r.value < threshold
        const expanded = open === r.id
        const content = (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 text-[14px]">
                <span className="truncate">{r.label}</span>
                {weak && (
                  <span className="shrink-0 rounded-full border border-fg px-1.5 font-mono text-[10px] leading-4 tracking-wide">
                    foco
                  </span>
                )}
              </span>
              <span className="tnum flex shrink-0 items-center gap-1 text-[14px] font-semibold">
                {r.value}%
                {detail && (
                  <ChevronDown
                    size={15}
                    className={cx('text-faint transition-transform duration-200', expanded && 'rotate-180')}
                    aria-hidden
                  />
                )}
              </span>
            </div>
            <div className="relative mt-2 h-2 w-full overflow-hidden rounded-r-[4px] bg-surface" aria-hidden>
              {threshold !== undefined && (
                <span className="absolute inset-y-0 w-px bg-faint" style={{ left: `${threshold}%` }} />
              )}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-r-[4px] bg-fg"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(r.value, 0.5)}%` }}
                transition={{ ...softSpring, delay: 0.05 * i }}
              />
            </div>
          </>
        )

        return (
          <li key={r.id} className="border-b border-line last:border-b-0">
            {detail ? (
              <button
                type="button"
                className="block w-full py-3 text-left"
                aria-expanded={expanded}
                onClick={() => {
                  tap(6)
                  setOpen(expanded ? null : r.id)
                }}
              >
                {content}
              </button>
            ) : (
              <div className="py-3">{content}</div>
            )}
            <AnimatePresence initial={false}>
              {detail && expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="pb-4">{detail(r)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
