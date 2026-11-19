import { AnimatePresence, motion, useDragControls } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { softSpring } from './ui'

/** Folha inferior: arraste para baixo, toque fora ou Esc para fechar. */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  const controls = useDragControls()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prevFocus = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        )
        if (items.length === 0) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      const target = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current
      target?.focus({ preventScroll: true })
    }, 60)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      prevFocus?.focus?.({ preventScroll: true })
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex max-w-[30rem] justify-center">
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              tabIndex={-1}
              className="gutter pointer-events-auto max-h-[88dvh] w-full overflow-y-auto rounded-t-[28px] border border-b-0 border-line bg-bg pt-2 shadow-[0_-12px_48px_-12px_rgb(0_0_0/0.25)] outline-none"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={softSpring}
              drag="y"
              dragListener={false}
              dragControls={controls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 110 || info.velocity.y > 600) onClose()
              }}
            >
              <div
                className="flex cursor-grab touch-none justify-center pb-3 pt-1 active:cursor-grabbing"
                onPointerDown={(e) => controls.start(e)}
              >
                <span className="h-1 w-10 rounded-full bg-surface-2" />
              </div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="font-display text-[22px] font-bold tracking-tight">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar"
                  className="grid size-9 place-items-center rounded-full bg-surface text-muted hover:text-fg"
                >
                  <X size={18} />
                </button>
              </div>
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
