# Deployment — Experiment Decision Log

## Production demo

**URL:** https://experiment-decision-log.vercel.app  
**Repo homepage:** https://github.com/BarujaFe1/experiment-decision-log

## Vercel

1. Import the GitHub repo (or `vercel link` + `vercel --prod`).
2. Framework preset: Next.js.
3. No required environment variables for the MVP.
4. Root directory: repository root.

Local CLI:

```bash
npm install
npm run build
vercel --prod
```

## Local demo

```bash
npm install
npm run dev
```

Open http://localhost:3000 — first visit seeds 4 demo experiments into localStorage.

## Notes

- Persistence is browser-local; clearing site data removes experiments.
- “Limpar localStorage” sets a flag so demos do not auto-reseed until “Carregar dados demo”.
- Export Markdown before clearing if you need a durable artifact.
