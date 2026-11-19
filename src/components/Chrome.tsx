import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { ArrowLeft, ChartNoAxesColumn, FolderKanban, Route as RouteIcon, Sun } from 'lucide-react'
import { goBack, switchTab, type Route, type Tab } from '../lib/router'
import { useUI } from '../lib/store'
import { cx, spring } from './ui'

const TAB_ITEMS: { id: Tab; label: string; icon: typeof Sun }[] = [
  { id: 'hoje', label: 'Hoje', icon: Sun },
  { id: 'trilha', label: 'Trilha', icon: RouteIcon },
  { id: 'projetos', label: 'Projetos', icon: FolderKanban },
  { id: 'desempenho', label: 'Desempenho', icon: ChartNoAxesColumn },
]

/** Quatro abas e nada mais: menos opções, decisão mais rápida. */
export function TabBar({ active }: { active: Tab }) {
  return (
    <nav
      aria-label="Principal"
      className="gutter pointer-events-none fixed inset-x-0 bottom-0 z-30"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      <div className="pointer-events-auto mx-auto flex max-w-[26rem] items-center gap-1 rounded-full border border-line bg-bg/85 p-1.5 shadow-[0_8px_32px_-8px_rgb(0_0_0/0.18)] backdrop-blur-xl">
        {TAB_ITEMS.map(({ id, label, icon: Icon }) => {
          const on = id === active
          return (
            <motion.button
              key={id}
              type="button"
              whileTap={{ scale: 0.94 }}
              transition={spring}
              onClick={() => switchTab(id)}
              aria-current={on ? 'page' : undefined}
              className={cx(
                'relative flex h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10.5px] font-medium',
                on ? 'text-bg' : 'text-muted hover:text-fg',
              )}
            >
              {on && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-fg" transition={spring} />}
              <Icon size={19} strokeWidth={on ? 2.25 : 1.75} className="relative" aria-hidden />
              <span className="relative truncate">{label}</span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}

/**
 * Cabeçalho de tela empilhada. O título grande fica no conteúdo; quando ele sai da vista,
 * uma versão compacta aparece na barra, como nos apps nativos.
 */
export function StackHeader({
  route,
  title,
  right,
  progress,
}: {
  route: Route
  title: string
  right?: ReactNode
  progress?: ReactNode
}) {
  const { scrollY } = useScroll()
  const [compact, setCompact] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setCompact(y > 96))

  return (
    <header
      className={cx(
        'sticky z-20 transition-[background-color,border-color] duration-200',
        compact ? 'border-b border-line bg-bg/90 backdrop-blur-xl' : 'border-b border-transparent bg-bg',
      )}
      style={{ top: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="gutter flex h-14 items-center gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => goBack(route)}
          aria-label="Voltar"
          className="-ml-2 grid size-10 shrink-0 place-items-center rounded-full hover:bg-surface"
        >
          <ArrowLeft size={21} />
        </motion.button>
        <div className="min-w-0 flex-1">
          <AnimatePresence>
            {compact && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="truncate text-[15px] font-semibold"
              >
                {title}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {right}
      </div>
      {progress}
    </header>
  )
}

export function Toaster({ raised }: { raised: boolean }) {
  const toast = useUI((s) => s.toast)
  const hide = useUI((s) => s.hideToast)
  return (
    <div
      className="gutter pointer-events-none fixed inset-x-0 z-[60] flex justify-center"
      style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + ${raised ? 92 : 24}px)` }}
      aria-live="polite"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={spring}
            className="pointer-events-auto flex max-w-[26rem] items-center gap-4 rounded-full bg-fg py-2.5 pl-5 pr-2.5 text-[14px] text-bg shadow-lg"
          >
            <span className="min-w-0">{toast.text}</span>
            {toast.action ? (
              <button
                type="button"
                onClick={() => {
                  toast.action?.run()
                  hide()
                }}
                className="shrink-0 rounded-full bg-bg/15 px-3.5 py-1.5 text-[13px] font-semibold hover:bg-bg/25"
              >
                {toast.action.label}
              </button>
            ) : (
              <span className="w-2" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
