import { useSyncExternalStore } from 'react'

export type Tab = 'hoje' | 'trilha' | 'projetos' | 'desempenho'
export const TABS: Tab[] = ['hoje', 'trilha', 'projetos', 'desempenho']

export type Route =
  | { name: Tab }
  | { name: 'modulo'; id: string }
  | { name: 'projeto'; id: string }
  | { name: 'nivelamento' }
  | { name: 'resultado' }
  | { name: 'revisao' }
  | { name: 'boas-vindas' }

/** Só `#nome` simples, em ASCII com hífens: é o que sobrevive em links compartilhados. */
export function parse(hash: string): Route {
  const h = hash.replace(/^#/, '')
  if ((TABS as string[]).includes(h)) return { name: h as Tab }
  if (h.startsWith('modulo-')) return { name: 'modulo', id: h.slice(7) }
  if (h.startsWith('projeto-')) return { name: 'projeto', id: h.slice(8) }
  if (h === 'nivelamento' || h === 'resultado' || h === 'revisao' || h === 'boas-vindas') return { name: h }
  return { name: 'hoje' }
}

export function toHash(r: Route): string {
  if (r.name === 'modulo') return `#modulo-${r.id}`
  if (r.name === 'projeto') return `#projeto-${r.id}`
  return `#${r.name}`
}

export function routeKey(r: Route): string {
  return toHash(r)
}

/** Profundidade visual: abas = 0, telas empilhadas = 1. Define a direção da transição. */
export function depth(r: Route): number {
  return (TABS as string[]).includes(r.name) ? 0 : 1
}

export function parentOf(r: Route): Route {
  switch (r.name) {
    case 'modulo':
    case 'revisao':
      return { name: 'trilha' }
    case 'projeto':
      return { name: 'projetos' }
    case 'resultado':
      return { name: 'desempenho' }
    default:
      return { name: 'hoje' }
  }
}

const getHash = () => (typeof window === 'undefined' ? '' : window.location.hash)

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export function useHash(): string {
  return useSyncExternalStore(subscribe, getHash, () => '')
}

/** Posição desta entrada na pilha do próprio app, guardada no history.state. */
function stackIndex(): number {
  const st = window.history.state as { jgIdx?: unknown } | null
  return st && typeof st.jgIdx === 'number' ? st.jgIdx : 0
}

export function navigate(r: Route, opts: { replace?: boolean } = {}) {
  const hash = toHash(r)
  if (hash === window.location.hash) return
  const url = window.location.pathname + window.location.search + hash
  try {
    if (opts.replace) window.history.replaceState({ jgIdx: stackIndex() }, '', url)
    else window.history.pushState({ jgIdx: stackIndex() + 1 }, '', url)
  } catch {
    window.location.hash = hash // o navegador dispara hashchange sozinho
    return
  }
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

/** Volta uma tela. Se a tela foi aberta por link direto, sobe para a tela-mãe sem sair do app. */
export function goBack(current: Route) {
  if (stackIndex() > 0) window.history.back()
  else navigate(parentOf(current), { replace: true })
}

/** Troca de aba substitui a entrada atual, para o histórico não virar uma pilha de abas. */
export function switchTab(tab: Tab) {
  navigate({ name: tab }, { replace: true })
}
