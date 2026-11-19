import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { navigate } from '../lib/router'
import { useStore, useUI, type Theme } from '../lib/store'
import { tap } from '../lib/haptics'
import { Sheet } from '../components/Sheet'
import { Segmented, cx } from '../components/ui'

export function SettingsSheet() {
  const open = useUI((s) => s.settingsOpen)
  const setOpen = useUI((s) => s.setSettingsOpen)
  const showToast = useUI((s) => s.showToast)
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const goal = useStore((s) => s.weeklyGoal)
  const setGoal = useStore((s) => s.setWeeklyGoal)
  const resetAll = useStore((s) => s.resetAll)
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    if (!open) setConfirm(false)
  }, [open])

  useEffect(() => {
    if (!confirm) return
    const t = setTimeout(() => setConfirm(false), 4000)
    return () => clearTimeout(t)
  }, [confirm])

  const close = () => setOpen(false)

  return (
    <Sheet open={open} onClose={close} title="Ajustes">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-medium">Aparência</p>
          <Segmented<Theme>
            label="Aparência"
            value={theme}
            onChange={setTheme}
            options={[
              { id: 'system', label: 'Sistema' },
              { id: 'light', label: 'Claro' },
              { id: 'dark', label: 'Escuro' },
            ]}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-medium">Meta semanal de módulos</p>
          <Segmented<string>
            label="Meta semanal"
            value={String(goal)}
            onChange={(v) => setGoal(Number(v))}
            options={[
              { id: '2', label: '2 · leve' },
              { id: '3', label: '3 · constante' },
              { id: '5', label: '5 · intenso' },
            ]}
          />
        </div>

        <div className="flex flex-col divide-y divide-line border-y border-line">
          <button
            type="button"
            onClick={() => {
              close()
              navigate({ name: 'nivelamento' })
            }}
            className="flex h-13 items-center justify-between text-left text-[15px]"
          >
            Refazer nivelamento
            <ArrowRight size={17} className="text-muted" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (!confirm) {
                tap()
                setConfirm(true)
                return
              }
              resetAll()
              close()
              showToast('Progresso apagado')
            }}
            className={cx(
              'flex h-13 items-center justify-between text-left text-[15px] transition-colors',
              confirm && 'font-semibold',
            )}
          >
            {confirm ? 'Toque de novo para apagar tudo' : 'Apagar todo o progresso'}
            <span className="text-[12px] text-muted">{confirm ? 'não dá para desfazer' : ''}</span>
          </button>
        </div>

        <p className="text-[12.5px] text-muted">
          Conteúdo revisado para o Java 25 LTS. Seu progresso fica salvo só neste navegador.
        </p>
      </div>
    </Sheet>
  )
}
