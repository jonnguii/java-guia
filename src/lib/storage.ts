import type { StateStorage } from 'zustand/middleware'

/** localStorage que nunca lança: em janelas privadas ou com dados bloqueados, o app segue sem salvar. */
export const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value)
    } catch {
      /* armazenamento indisponível */
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name)
    } catch {
      /* armazenamento indisponível */
    }
  },
}
