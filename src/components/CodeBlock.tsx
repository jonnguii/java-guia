import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { CodeLang } from '../data/types'
import { highlight } from '../lib/highlight'
import { tap } from '../lib/haptics'

const LANG_LABEL: Record<CodeLang, string> = { java: 'Java', xml: 'XML', shell: 'Terminal' }

export function CodeBlock({
  code,
  lang = 'java',
  caption,
  compact = false,
}: {
  code: string
  lang?: CodeLang
  caption?: string
  compact?: boolean
}) {
  const tokens = useMemo(() => highlight(code, lang), [code, lang])
  const [copied, setCopied] = useState(false)
  const pre = useRef<HTMLPreElement>(null)

  const copy = async () => {
    tap()
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Sem acesso à área de transferência: seleciona o código para o usuário copiar.
      const el = pre.current
      if (!el) return
      const range = document.createRange()
      range.selectNodeContents(el)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }

  return (
    <figure className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface">
      {!compact && (
        <figcaption className="flex items-center justify-between gap-3 border-b border-line py-1.5 pl-4 pr-1.5">
          <span className="label truncate">{caption ?? LANG_LABEL[lang]}</span>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? 'Código copiado' : 'Copiar código'}
            className="relative grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={copied ? 'ok' : 'copy'}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.16 }}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </figcaption>
      )}
      <pre
        ref={pre}
        className="no-scrollbar overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.7]"
        tabIndex={0}
        aria-label={`Código ${LANG_LABEL[lang]}`}
      >
        <code>
          {tokens.map((t, i) => (
            <span key={i} className={`tok-${t.t}`}>
              {t.v}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  )
}
