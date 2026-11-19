import { animate, motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { tap } from '../lib/haptics'

export const spring = { type: 'spring', stiffness: 520, damping: 38, mass: 0.8 } as const
export const softSpring = { type: 'spring', stiffness: 260, damping: 30 } as const

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ')
}

/** Botão com resposta tátil: encolhe ao toque e vibra de leve onde houver suporte. */
export function Pressable({
  haptic = true,
  className,
  onClick,
  ...rest
}: HTMLMotionProps<'button'> & { haptic?: boolean }) {
  return (
    <motion.button
      type="button"
      whileTap={rest.disabled ? undefined : { scale: 0.97 }}
      transition={spring}
      className={cx('select-none', className)}
      onClick={(e) => {
        if (haptic) tap()
        onClick?.(e)
      }}
      {...rest}
    />
  )
}

export function PrimaryButton({ className, ...rest }: HTMLMotionProps<'button'>) {
  return (
    <Pressable
      className={cx(
        'inline-flex h-13 items-center justify-center gap-2 rounded-full bg-fg px-6 text-[15px] font-semibold text-bg disabled:opacity-35',
        className,
      )}
      {...rest}
    />
  )
}

export function GhostButton({ className, ...rest }: HTMLMotionProps<'button'>) {
  return (
    <Pressable
      className={cx(
        'inline-flex h-13 items-center justify-center gap-2 rounded-full border border-line px-6 text-[15px] font-medium text-fg',
        className,
      )}
      {...rest}
    />
  )
}

// ─── Checkbox ───────────────────────────────────────────

export function CheckMark({ checked, size = 22 }: { checked: boolean; size?: number }) {
  return (
    <motion.span
      aria-hidden
      animate={{ scale: checked ? [1, 0.82, 1.06, 1] : 1 }}
      transition={{ duration: 0.32 }}
      className={cx(
        'relative inline-grid shrink-0 place-items-center rounded-[7px] border-[1.5px] transition-colors duration-150',
        checked ? 'border-fg bg-fg' : 'border-faint bg-transparent',
      )}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size - 6} height={size - 6} fill="none">
        <motion.path
          d="M5 12.5l4.2 4.2L19 7"
          stroke="var(--bg)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: checked ? 0.28 : 0.12, ease: 'easeOut' }}
        />
      </svg>
    </motion.span>
  )
}

export function CheckRow({
  checked,
  onToggle,
  children,
  hint,
}: {
  checked: boolean
  onToggle: () => void
  children: ReactNode
  hint?: ReactNode
}) {
  return (
    <Pressable
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className="flex w-full items-start gap-3.5 py-3 text-left"
    >
      <span className="pt-px">
        <CheckMark checked={checked} />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cx(
            'block text-[15px] leading-snug transition-colors',
            checked ? 'text-muted line-through decoration-faint' : 'text-fg',
          )}
        >
          {children}
        </span>
        {hint && <span className="mt-0.5 block text-[13px] text-muted">{hint}</span>}
      </span>
    </Pressable>
  )
}

// ─── Progresso ───────────────────────────────────────────

export function ProgressBar({
  value,
  className,
  thick = false,
  inverted = false,
  label,
}: {
  value: number
  className?: string
  thick?: boolean
  inverted?: boolean
  label?: string
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
      className={cx(
        'relative w-full overflow-hidden rounded-full',
        thick ? 'h-2' : 'h-1',
        inverted ? 'bg-bg/20' : 'bg-surface-2',
        className,
      )}
    >
      <motion.div
        className={cx('absolute inset-y-0 left-0 rounded-full', inverted ? 'bg-bg' : 'bg-fg')}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={softSpring}
      />
    </div>
  )
}

export function Ring({
  value,
  size = 44,
  stroke = 3,
  children,
  label,
}: {
  value: number
  size?: number
  stroke?: number
  children?: ReactNode
  label?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(1, value))
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--fg)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - v), opacity: v === 0 ? 0 : 1 }}
          transition={softSpring}
        />
      </svg>
      {children && <span className="absolute inset-0 grid place-items-center">{children}</span>}
    </span>
  )
}

/** Número que conta até o valor. Sem animação para quem pediu menos movimento. */
export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(value)
  const from = useRef(0)
  useEffect(() => {
    if (reduce) {
      setShown(value)
      from.current = value
      return
    }
    const controls = animate(from.current, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    })
    from.current = value
    return () => controls.stop()
  }, [value, reduce])
  return (
    <span>
      {shown}
      {suffix}
    </span>
  )
}

// ─── Controle segmentado ───────────────────────────────────────────

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
  label: string
}) {
  const id = useId()
  return (
    <div role="tablist" aria-label={label} className="flex rounded-full bg-surface p-1">
      {options.map((o) => {
        const active = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => {
              if (!active) tap(6)
              onChange(o.id)
            }}
            className={cx(
              'relative flex h-9 min-w-0 flex-1 items-center justify-center rounded-full px-2 text-[13px] font-medium transition-colors',
              active ? 'text-bg' : 'text-muted hover:text-fg',
            )}
          >
            {active && (
              <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-full bg-fg" transition={spring} />
            )}
            <span className="relative truncate">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Texto rico ───────────────────────────────────────────

/** Converte `código` e **negrito** em elementos. Nada além disso. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('`') && p.endsWith('`') && p.length > 1)
          return (
            <code key={i} className="rounded-[5px] bg-surface-2 px-1.5 py-px font-mono text-[0.86em] text-fg">
              {p.slice(1, -1)}
            </code>
          )
        if (p.startsWith('**') && p.endsWith('**') && p.length > 3)
          return (
            <strong key={i} className="font-semibold text-fg">
              {p.slice(2, -2)}
            </strong>
          )
        return <span key={i}>{p}</span>
      })}
    </>
  )
}

export function Chip({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={cx(
        'inline-flex h-6 items-center rounded-full px-2.5 font-mono text-[11px] tracking-wide',
        active ? 'bg-fg text-bg' : 'border border-line text-muted',
      )}
    >
      {children}
    </span>
  )
}
