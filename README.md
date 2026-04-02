# AgentDesk Monorepo

Multi-app customer support platform with:
- `apps/web`: operator dashboard (Next.js, Clerk auth/billing, Convex client)
- `apps/widget`: embeddable customer chat/voice UI (Next.js, Convex client, Vapi web SDK)
- `apps/embed`: standalone script builder for website embedding (`widget.js`, Vite)
- `packages/backend`: Convex backend (auth, conversations, files/RAG, plugin secrets, AI tools)
- `packages/ui`: shared UI components/hooks/styles
- `packages/math`, `packages/eslint-config`, `packages/typescript-config`: shared workspace packages

## Tech Stack

- Monorepo: `pnpm` + Turborepo
- Frontend: Next.js 15 + React 19
- Backend: Convex
- Auth/Organizations/Billing: Clerk
- AI: `@convex-dev/agent`, `@convex-dev/rag`, `@ai-sdk/google`
- Voice: Vapi
- Secret storage for plugin credentials: AWS Secrets Manager
- Error monitoring: Sentry (web app)

## Repository Structure

```text
.
├─ apps/
│  ├─ web/         # Admin dashboard on :3000
│  ├─ widget/      # Hosted widget app on :3001
│  └─ embed/       # Script builder/demo on :3002
├─ packages/
│  ├─ backend/     # Convex functions + schema
│  ├─ ui/          # Shared UI primitives/components
│  ├─ math/        # Example shared package
│  ├─ eslint-config/
│  └─ typescript-config/
└─ turbo.json
```

## Core Product Flows

- Operator (dashboard) flow:
  - Sign in with Clerk
  - Select organization
  - View conversations, update statuses, reply as operator
  - Manage integrations and widget customization
  - Upload knowledge-base files (RAG)
- Customer (widget) flow:
  - Embedded site loads `widget.js`, opens hosted widget app
  - Customer validates `organizationId`, starts/continues session
  - Customer chats with AI assistant and optionally uses voice (Vapi)
- AI routing flow:
  - For active subscriptions, customer prompts go through support agent + tools
  - Tools can search org-scoped RAG content, escalate, or resolve conversation
- Plugin credentials flow:
  - Dashboard stores Vapi keys
  - Backend writes keys into AWS Secrets Manager
  - Widget only receives Vapi public key when available

## Prerequisites

- Node.js `>=20`
- `pnpm` (repo is pinned to `pnpm@10.4.1`)
- Convex account + project
- Clerk app configured for:
  - auth
  - organizations
  - pricing/billing plans (used by `Protect` on premium pages)
- Gemini API key
- AWS account/credentials with Secrets Manager access (required for Vapi plugin flow)
- Optional: Sentry project/token if you want sourcemap upload/monitoring

## Environment Variables

Sample files are included:
- `apps/web/.env.example`
- `apps/widget/.env.example`
- `apps/embed/.env.example`
- `packages/backend/.env.example`

### `apps/web/.env.local`

```bash
NEXT_PUBLIC_CONVEX_URL=...
CI=false
```

### `apps/widget/.env.local`

```bash
NEXT_PUBLIC_CONVEX_URL=...
```

### `apps/embed/.env.local`

```bash
VITE_WIDGET_URL=http://localhost:3001
```

### `packages/backend/.env.local`

```bash
CLERK_SECRET_KEY=...
CLERK_WEBHOOK_SECRET=...
CLERK_JWT_ISSUER_DOMAIN=...
AWS_REGION=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

Also required in your Convex environment (dashboard/CLI), even if not directly read in app code:
- `GOOGLE_GENERATIVE_AI_API_KEY` (used by AI SDK model/embedding calls)
- any Clerk/Secrets values needed by Convex runtime in your target environment

Framework-required (not directly referenced in source here, but required by Clerk Next.js):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (web)
- `CLERK_SECRET_KEY` (web server side)

## Installation

```bash
pnpm install
```

## Local Development

## 1) Start Convex backend

From repo root:

```bash
pnpm --filter @workspace/backend dev
```

Or from `packages/backend`:

```bash
pnpm dev
```

This runs `convex dev` and generates/updates Convex local config and codegen.

## 2) Start apps

Start everything via Turbo:

```bash
pnpm dev
```

Or run selectively:

```bash
pnpm --filter web dev
pnpm --filter widget dev
pnpm --filter embed dev
```

Default local ports:
- web dashboard: `http://localhost:3000`
- widget app: `http://localhost:3001`
- embed demo: `http://localhost:3002/demo.html`

## 3) Validate quality

```bash
pnpm lint
pnpm --filter web typecheck
pnpm --filter widget typecheck
```

There is no root `test` script currently.

## How Embedding Works

1. External website loads:

```html
<script src="https://<your-widget-host>/widget.js" data-organization-id="org_xxx"></script>
```

2. Script injects a floating button + iframe.
3. Iframe points to hosted widget app with `organizationId` query param.
4. Widget app talks to Convex and loads org-specific settings/secrets.

Current integration snippets are hardcoded in:
- `apps/web/modules/integrations/constants.ts`
- `apps/widget/public/widget.js`

If your widget domain changes, update both.

## Knowledge Base and AI Notes

- File upload (`web`) stores files in Convex storage and indexes text via `@convex-dev/rag`.
- Text extraction supports plain text, PDFs, and images, powered by OpenAI models.
- AI support agent uses:
  - chat model: `gemini-3-flash-preview`
  - embeddings: `gemini-embedding-2-preview`
- Customer conversation behavior depends on subscription state:
  - `active` subscription: AI agent tooling enabled
  - otherwise: message is saved without agent tool generation

## Billing and Plans

- Premium routes in web app are guarded with `Protect` + Clerk plan checks:
  - `/files`
  - `/customization`
  - `/plugins/vapi`
- If Clerk billing/plans are not configured, premium features will not unlock.

## Deployment Guide

Recommended production split:
- Convex backend (production deployment)
- Vercel project for `apps/web`
- Vercel project for `apps/widget`
- Optional Vite-built `widget.js` pipeline from `apps/embed`

## A) Deploy Convex (`packages/backend`)

1. Authenticate Convex CLI.
2. Ensure Convex production env vars are set (Clerk, OpenAI, AWS, etc).
3. Deploy:

```bash
cd packages/backend
npx convex deploy
```

4. Get production Convex URL and set it in frontend envs:
- `apps/web`: `NEXT_PUBLIC_CONVEX_URL`
- `apps/widget`: `NEXT_PUBLIC_CONVEX_URL`

## B) Deploy `apps/web` (Vercel)

1. Create a Vercel project rooted at `apps/web`.
2. Add env vars:
  - `NEXT_PUBLIC_CONVEX_URL`
  - Clerk vars required by Next.js (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, etc.)
  - optional Sentry vars/token for sourcemap upload
3. Build command: default Next.js build (`pnpm build` at app level).
4. Set Clerk redirect URLs and allowed origins to this deployed domain.

## C) Deploy `apps/widget` (Vercel)

1. Create a Vercel project rooted at `apps/widget`.
2. Add env vars:
  - `NEXT_PUBLIC_CONVEX_URL`
3. Deploy and note final domain (used by embed script and integration snippets).

## D) Deploy/Update `widget.js`

You have two options:

1. Serve checked-in script from `apps/widget/public/widget.js` (simple path).
2. Build latest from `apps/embed`:

```bash
pnpm --filter embed build
```

Then copy generated bundle into `apps/widget/public/widget.js` and redeploy widget app.

Note: this copy step is not automated in the current repo.

## E) Post-deploy configuration checklist

- Update integration snippet domain in:
  - `apps/web/modules/integrations/constants.ts`
  - `apps/widget/public/widget.js` (`WIDGET_URL`)
- Configure Clerk webhook endpoint to Convex HTTP route:
  - `POST /clerk-webhook` (in `packages/backend/convex/http.ts`)
- Ensure webhook secret matches backend env (`CLERK_WEBHOOK_SECRET`)
- Ensure Clerk JWT issuer domain matches Convex auth config (`CLERK_JWT_ISSUER_DOMAIN`)
- Verify AWS Secrets Manager permissions for runtime credentials

## Known Caveats

- `apps/web/app/(dashboard)/page.tsx` calls `api.users.add`, and backend `users.add` currently throws `"Tracking test"` intentionally.
- Sentry DSN/org/project are currently hardcoded in web app config.
- Integrations snippets are currently hardcoded to `https://agentdesk-widget.vercel.app/...`.

## Useful Commands

From repo root:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm --filter web dev
pnpm --filter widget dev
pnpm --filter embed dev
pnpm --filter @workspace/backend dev
```
# agent-desk
# agent-desk
