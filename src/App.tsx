import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { TabBar, Toaster } from './components/Chrome'
import { SettingsSheet } from './screens/Settings'
import { Welcome } from './screens/Welcome'
import { Assessment } from './screens/Assessment'
import { AssessmentResult } from './screens/AssessmentResult'
import { Home } from './screens/Home'
import { Track } from './screens/Track'
import { ModuleScreen } from './screens/ModuleScreen'
import { Projects } from './screens/Projects'
import { ProjectScreen } from './screens/ProjectScreen'
import { Performance } from './screens/Performance'
import { Review } from './screens/Review'
import { depth, parse, routeKey, TABS, useHash, type Route, type Tab } from './lib/router'
import { useStore } from './lib/store'

type Dir = { kind: 'push' | 'pop' | 'tab' | 'none'; sign: number }

function direction(from: Route | null, to: Route): Dir {
  if (!from) return { kind: 'none', sign: 0 }
  const a = depth(from)
  const b = depth(to)
  if (b > a) return { kind: 'push', sign: 1 }
  if (b < a) return { kind: 'pop', sign: -1 }
  if (a === 0) {
    const i = TABS.indexOf(from.name as Tab)
    const j = TABS.indexOf(to.name as Tab)
    return { kind: 'tab', sign: Math.sign(j - i) }
  }
  return { kind: 'push', sign: 1 }
}

const variants = {
  enter: (d: Dir) => ({
    opacity: 0,
    x: d.kind === 'push' ? 48 : d.kind === 'pop' ? -24 : d.kind === 'tab' ? 14 * d.sign : 0,
  }),
  center: { opacity: 1, x: 0 },
  exit: (d: Dir) => ({
    opacity: 0,
    x: d.kind === 'push' ? -24 : d.kind === 'pop' ? 48 : d.kind === 'tab' ? -14 * d.sign : 0,
  }),
}

function useThemeAttribute() {
  const theme = useStore((s) => s.theme)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
  }, [theme])
}

function Screen({ route }: { route: Route }) {
  switch (route.name) {
    case 'boas-vindas':
      return <Welcome />
    case 'nivelamento':
      return <Assessment route={route} />
    case 'resultado':
      return <AssessmentResult route={route} />
    case 'hoje':
      return <Home />
    case 'trilha':
      return <Track />
    case 'projetos':
      return <Projects />
    case 'desempenho':
      return <Performance />
    case 'modulo':
      return <ModuleScreen route={route} id={route.id} />
    case 'projeto':
      return <ProjectScreen route={route} id={route.id} />
    case 'revisao':
      return <Review route={route} />
  }
}

export default function App() {
  useThemeAttribute()
  const hash = useHash()
  const welcomed = useStore((s) => s.welcomed)
  const route: Route = !welcomed && (hash === '' || hash === '#') ? { name: 'boas-vindas' } : parse(hash)
  const key = routeKey(route)

  const prev = useRef<Route | null>(null)
  const dirRef = useRef<Dir>({ kind: 'none', sign: 0 })
  const lastKey = useRef<string | null>(null)
  if (lastKey.current !== key) {
    dirRef.current = direction(prev.current, route)
    prev.current = route
    lastKey.current = key
  }

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  const isTab = depth(route) === 0

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <AnimatePresence mode="wait" initial={false} custom={dirRef.current} onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          key={key}
          custom={dirRef.current}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: [0.25, 0.8, 0.25, 1] }}
          className="mx-auto w-full max-w-[30rem]"
        >
          <Screen route={route} />
        </motion.main>
      </AnimatePresence>
      {isTab && <TabBar active={route.name as Tab} />}
      <SettingsSheet />
      <Toaster raised={isTab} />
    </div>
  )
}
