# Reprise — PRD

## Original problem statement
"copie toda estrutura desse site mas deixe mais bonito e com outra identidade visual, veja todo o fluxo cada detalhe e copie só mude a identidade visual: https://foreversongs.com/"
User choices: brand name evoking music + love/rekindling love (chosen: Reprise), prices in EUR, Stripe payments, admin panel to upload the final song + AI writes lyrics instantly.

## Architecture
- React (CRA) + framer-motion + lenis; FastAPI + MongoDB
- Stripe claimable sandbox (Flow A, country PT, tax mode "full" = Stripe-managed), lookup keys reprise_standard (€39) / reprise_express (€59)
- Claude Sonnet 5.5 via Emergent LLM key for lyrics (after payment)
- Emergent object storage for admin-uploaded audio; streamed via /api/songs/{id}/audio
- JWT cookie auth, single admin seeded from env

## Personas
- Gift buyer (PT/EU) wanting a personalised song; Studio owner/admin fulfilling orders

## Core requirements
- Landing with same structure as reference (hero, trust strip→marquee, reactions carousel, 4 steps, reviews, samples player w/ occasion tabs + genre, 12 occasions, FAQ, final CTA, footer) with new identity and original copy
- 8-step creation wizard → Stripe checkout → private song page (lyrics + audio + revisions + share)
- Admin: orders table, filters, details, upload audio, status, regenerate lyrics

## Implemented (2026-11-01)
- All of the above, verified: wizard → Stripe checkout redirect, order API, admin login/list/upload, AI lyrics generation, song page desktop/mobile

## Backlog
- P1: Email notification to customer when song is ready (Resend)
- P1: Replace placeholder sample audio, testimonials, support email, legal pages
- P2: Upsells (instrumental, framed lyrics PDF), discount codes, multi-language
