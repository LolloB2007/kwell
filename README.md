# KWELL — Marketing Site

Italian professional fitness equipment e-commerce. Marketing site that integrates with PrestaShop.

## Stack

- **web/** — Next.js 15 (App Router) + Tailwind + GSAP ScrollTrigger + Lenis smooth scroll
- **api/** — Node.js + Fastify, PrestaShop Webservice client, lead capture endpoints
- **PrestaShop** — existing back-office (catalog source of truth)

## Brand

- Type: Urwdin (display), Roboto (body)
- Anthracite `#26252A`, Black `#000000`, Red accent `#F02D32`
- Neutrals: `#474646`, `#ADA8A9`, light bg `#F4F2F2`

## Develop

```bash
npm install
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:4000

## Env

`api/.env`:
```
PORT=4000
PS_URL=https://kwell.it
PS_WS_KEY=your-prestashop-webservice-key
CACHE_TTL_SECONDS=300
```

`web/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```
