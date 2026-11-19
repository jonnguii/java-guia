import type { CodeLang } from '../data/types'

export type TokenType = 'kw' | 'type' | 'str' | 'com' | 'num' | 'ann' | 'tag' | 'plain'
export type Token = { t: TokenType; v: string }

const KEYWORDS = new Set(
  (
    'abstract assert boolean break byte case catch char class const continue default do double else enum ' +
    'extends final finally float for goto if implements import instanceof int interface long native new ' +
    'package private protected public return short static strictfp super switch synchronized this throw ' +
    'throws transient try void volatile while var record sealed permits non-sealed yield when true false null'
  ).split(' '),
)

const JAVA =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("""[\s\S]*?"""|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])')|(@[A-Za-z_]\w*)|(\b\d[\d_]*(?:\.\d+)?[LlFfDd]?\b)|([A-Za-z_$][\w$-]*)/g

function java(code: string): Token[] {
  const out: Token[] = []
  let last = 0
  for (const m of code.matchAll(JAVA)) {
    const i = m.index ?? 0
    if (i > last) out.push({ t: 'plain', v: code.slice(last, i) })
    const [full, com, str, ann, num, word] = m
    if (com) out.push({ t: 'com', v: full })
    else if (str) out.push({ t: 'str', v: full })
    else if (ann) out.push({ t: 'ann', v: full })
    else if (num) out.push({ t: 'num', v: full })
    else if (word) {
      // "non-sealed" é a única palavra-chave com hífen; outras palavras com hífen voltam a ser texto.
      if (word.includes('-') && word !== 'non-sealed') {
        const [head, ...rest] = word.split('-')
        out.push({ t: KEYWORDS.has(head) ? 'kw' : /^[A-Z]/.test(head) ? 'type' : 'plain', v: head })
        out.push({ t: 'plain', v: '-' + rest.join('-') })
      } else if (KEYWORDS.has(word)) out.push({ t: 'kw', v: word })
      else if (/^[A-Z]/.test(word)) out.push({ t: 'type', v: word })
      else out.push({ t: 'plain', v: word })
    }
    last = i + full.length
  }
  if (last < code.length) out.push({ t: 'plain', v: code.slice(last) })
  return out
}

function shell(code: string): Token[] {
  const out: Token[] = []
  for (const line of code.split(/(\n)/)) {
    const hash = line.search(/(^|\s)#/)
    if (hash >= 0) {
      const at = line.indexOf('#', hash)
      if (at > 0) out.push({ t: 'plain', v: line.slice(0, at) })
      out.push({ t: 'com', v: line.slice(at) })
    } else out.push({ t: 'plain', v: line })
  }
  return out
}

function xml(code: string): Token[] {
  const out: Token[] = []
  let last = 0
  for (const m of code.matchAll(/<\/?[\w.-]+>?|\/?>/g)) {
    const i = m.index ?? 0
    if (i > last) out.push({ t: 'plain', v: code.slice(last, i) })
    out.push({ t: 'tag', v: m[0] })
    last = i + m[0].length
  }
  if (last < code.length) out.push({ t: 'plain', v: code.slice(last) })
  return out
}

export function highlight(code: string, lang: CodeLang = 'java'): Token[] {
  if (lang === 'shell') return shell(code)
  if (lang === 'xml') return xml(code)
  return java(code)
}
