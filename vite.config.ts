import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `SINGLE=1 npm run build` gera um único HTML (usado para o preview publicado).
export default defineConfig({
  // Caminhos relativos: funciona em usuario.github.io/qualquer-nome-de-repo/ sem configurar nada.
  base: './',
  plugins: [react(), tailwindcss(), ...(process.env.SINGLE ? [viteSingleFile()] : [])],
})
