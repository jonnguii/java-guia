import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { Trash2 } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { tap } from '../lib/haptics'

const THRESHOLD = -96

/** Linha que apaga ao deslizar para a esquerda. O botão de lixeira faz o mesmo para teclado e mouse. */
export function SwipeRow({ children, onDelete, label }: { children: ReactNode; onDelete: () => void; label: string }) {
  const x = useMotionValue(0)
  const reveal = useTransform(x, [0, THRESHOLD], [0, 1])
  const iconScale = useTransform(x, [-24, THRESHOLD], [0.6, 1])
  const dragged = useRef(false)

  return (
    <motion.li
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden"
    >
      <motion.div
        aria-hidden
        style={{ opacity: reveal }}
        className="absolute inset-y-1 right-0 flex w-full items-center justify-end rounded-2xl bg-fg pr-5 text-bg"
      >
        <motion.span style={{ scale: iconScale }}>
          <Trash2 size={18} />
        </motion.span>
      </motion.div>
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.5, right: 0 }}
        style={{ x }}
        onDragStart={() => {
          dragged.current = true
        }}
        onClickCapture={(e) => {
          // Um arrasto não deve marcar a tarefa como concluída ao soltar o dedo.
          if (dragged.current) {
            e.stopPropagation()
            e.preventDefault()
          }
        }}
        onDragEnd={(_, info) => {
          setTimeout(() => {
            dragged.current = false
          }, 0)
          if (info.offset.x < THRESHOLD || info.velocity.x < -700) {
            tap(14)
            animate(x, -480, { duration: 0.18 }).then(onDelete)
          }
        }}
        className="relative flex items-center bg-bg"
      >
        <div className="min-w-0 flex-1">{children}</div>
        <button
          type="button"
          onClick={() => {
            tap()
            onDelete()
          }}
          aria-label={`Apagar: ${label}`}
          className="grid size-9 shrink-0 place-items-center rounded-full text-faint hover:bg-surface hover:text-fg [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </motion.div>
    </motion.li>
  )
}
