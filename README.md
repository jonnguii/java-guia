# Java do Zero ao Avançado

Guia interativo de Java 25 em React 19 + Tailwind CSS 4, pensado como app móvel.

## Rodar

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # gera dist/
npm run build:single # gera dist-single/index.html (um arquivo só)
```

## Estrutura

- `src/data/` — conteúdo: módulos, nivelamento e projetos. Para editar o guia, mexa só aqui.
- `src/lib/store.ts` — estado salvo no navegador (zustand + localStorage).
- `src/lib/insights.ts` — nível, domínio por área, índice de desempenho e recomendação.
- `src/lib/router.ts` — rotas por hash (`#trilha`, `#modulo-generics`...).
- `src/components/` — peças de interface (checkbox animado, bottom sheet, swipe, gráficos).
- `src/screens/` — uma tela por arquivo.

## Como os números são calculados

- **Nível**: 16 questões, duas por área (peso 1 e peso 2). Abaixo de 25% Iniciante, até 50% Básico, até 75% Intermediário, acima disso Avançado.
- **Domínio por área**: 60% módulos concluídos + 40% acerto na primeira tentativa dos quizzes da área (ou a nota do nivelamento enquanto não houver quizzes).
- **Índice de desempenho**: 40% progresso na trilha + 40% acerto nos quizzes + 20% dias ativos nos últimos 14.

## Publicar no GitHub Pages

O workflow `.github/workflows/deploy.yml` gera o build e publica a cada push na branch `main`.
Na primeira vez, ative em **Settings → Pages → Build and deployment → Source: GitHub Actions**.
