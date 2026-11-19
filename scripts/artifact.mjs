// Converte o build de arquivo único em um fragmento de página para publicação como Artifact
// (o host injeta doctype, <head> e <body>).
import { readFileSync, writeFileSync } from 'node:fs'

const [input, output] = process.argv.slice(2)
const html = readFileSync(input, 'utf8')
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1]

const keep = head
  .replace(/<meta charset[^>]*>/i, '')
  .replace(/<meta name="viewport"[^>]*>/i, '')
  .trim()

writeFileSync(output, `${keep}\n${body.trim()}\n`)
console.log(`wrote ${output} (${(Buffer.byteLength(keep + body) / 1024).toFixed(0)} KB)`)
