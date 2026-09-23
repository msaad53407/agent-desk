<!-- prettier-ignore -->
<div align="center">

# AgentDesk

_Autonomous multi-app AI customer support and real-time voice platform with embeddable widgets and Convex RAG pipelines._

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Convex](https://img.shields.io/badge/Convex-Backend-FF7854?style=flat-square)](https://convex.dev)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?style=flat-square&logo=turborepo&logoColor=white)](https://turbo.build)
[![Vapi](https://img.shields.io/badge/Vapi-Voice_AI-7C3AED?style=flat-square)](https://vapi.ai)
[![Clerk](https://img.shields.io/badge/Clerk-Auth_%26_Billing-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com)

⭐ If you find this project helpful, please star it on GitHub!

[Overview](#overview) • [Architecture](#architecture) • [Features](#features) • [Monorepo Structure](#monorepo-structure) • [Prerequisites](#prerequisites) • [Quick Start](#quick-start) • [Embedding Guide](#embedding-guide) • [Deployment](#deployment)

</div>

---

> [!NOTE]
> AgentDesk provides an end-to-end customer support solution powered by Generative AI: real-time multi-agent reasoning, semantic document retrieval (RAG), live voice interaction via Vapi Web SDK, and multi-tenant operator dashboards with Clerk organization billing.

---

## Overview

Modern businesses require support systems that combine automated AI resolution with seamless human operator handoff. **AgentDesk** is a production-oriented monorepo that unifies customer-facing communication channels with back-office operations:

1. **Embeddable Chat & Voice Widget**: A lightweight, standalone script that loads on any website, providing customers with instant AI responses and live voice streaming.
2. **Autonomous Agent Backend**: Serverless Convex backend leveraging `@convex-dev/agent` and Google Gemini models (`gemini-3.5-flash` and `gemini-embedding-2-preview`) to search organization knowledge bases, answer queries, execute tools, and escalate conversations.
3. **Operator Command Center**: Modern Next.js 15 dashboard for managing conversations, viewing audit logs, uploading knowledge base documents, configuring widget branding, and provisioning third-party integrations.

---

## Architecture

```
                                    ┌──────────────────────────────────────────────────┐
                                    │               External Website                   │
                                    │    Loads <script src=".../widget.js" ... />      │
                                    └────────────────────────┬─────────────────────────┘
                                                             │ opens iframe / floating widget
                                                             ▼
┌──────────────────────────────────────┐            ┌──────────────────────────────────┐
│      apps/web (Admin Dashboard)      │            │       apps/widget (Hosted App)   │
│  - Operator inbox & live chat        │            │  - Interactive AI text chat      │
│  - Document upload & RAG management  │            │  - Real-time Voice AI (Vapi Web) │
│  - Widget branding & integrations    │            │  - Org-scoped session management │
└──────────────────┬───────────────────┘            └─────────────────┬────────────────┘
                   │                                                  │
                   │               Convex WebSocket / HTTP            │
                   └─────────────────────────┬────────────────────────┘
                                             ▼
                        ┌──────────────────────────────────────────────┐
                        │          packages/backend (Convex)           │
                        │  - Schema, Auth & Clerk Webhook routing      │
                        │  - @convex-dev/agent & tool execution        │
                        │  - @convex-dev/rag document vector search    │
                        │  - Secure AWS Secrets Manager integration    │
                        └──────────────────────┬───────────────────────┘
                                               │
               ┌───────────────────────────────┴───────────────────────────────┐
               ▼                               ▼                               ▼
      Google Gemini 2.5             Vapi Voice Platform               Clerk Organizations
    (Chat & Embeddings)             (Voice Session Relay)             (Multi-Tenant Billing)
```

---

## Features

- 🤖 **Autonomous AI Support Agent**: Uses `@convex-dev/agent` and `@ai-sdk/google` (`gemini-2.5-flash`) to orchestrate multi-step problem solving, tool calls, and automated resolutions.
- 🎙️ **Real-Time Voice Support**: Direct integration with the Vapi Web SDK allows users to switch between typing and talking seamlessly with minimal latency.
- 📚 **Dynamic RAG Knowledge Base**: Upload PDFs, plain text, or images; documents are automatically chunked, embedded via `gemini-embedding-2-preview`, and queried using `@convex-dev/rag`.
- 🏢 **Multi-Tenant Organizations**: Powered by Clerk Organizations with role-based access control, plan protection, and subscription-gated AI features.
- 🔒 **Zero-Exposure Credential Management**: Operator-configured API keys (e.g. Vapi secret keys) are written directly into **AWS Secrets Manager**, exposing only scoped public identifiers to customer-facing widgets.
- 📦 **Monorepo Architecture**: Managed via **Turborepo** and **pnpm**, providing shared UI components (`@workspace/ui`), unified TypeScript configurations, and fast parallel builds.
- 🌐 **Drop-in Embed Script**: Standalone Vite-built script (`apps/embed`) that injects a responsive, customizable iframe widget into any third-party website with a single `<script>` tag.

---

## Monorepo Structure

```text
.
├── apps/
│   ├── web/               # Next.js 15 operator dashboard (:3000)
│   ├── widget/            # Next.js 15 hosted customer chat & voice widget (:3001)
│   └── embed/             # Vite-powered standalone widget.js script builder (:3002)
├── packages/
│   ├── backend/           # Convex functions, schema, AI agent workflows & RAG
│   ├── ui/                # Shared Tailwind/React component library
│   ├── eslint-config/     # Shared ESLint rules
│   └── typescript-config/ # Shared TypeScript tsconfig bases
├── pnpm-workspace.yaml    # Monorepo workspace configuration
└── turbo.json             # Turborepo pipeline definition
```

---

## Prerequisites

- **Node.js**: `>=20`
- **Package Manager**: `pnpm` (recommended `10.4.1`)
- **Accounts & API Keys**:
  - [Convex](https://convex.dev) account and initialized project
  - [Clerk](https://clerk.com) application configured for Authentication, Organizations, and Billing
  - [Google AI Studio](https://aistudio.google.com/) Gemini API key
  - [Vapi](https://vapi.ai) account (for voice streaming)
  - [AWS Account](https://aws.amazon.com) with Secrets Manager permissions

---

## Environment Variables

Copy the example environment files across workspaces before starting development:

```bash
# Web Dashboard
cp apps/web/.env.example apps/web/.env.local

# Widget Application
cp apps/widget/.env.example apps/widget/.env.local

# Embed Script Builder
cp apps/embed/.env.example apps/embed/.env.local

# Convex Backend
cp packages/backend/.env.example packages/backend/.env.local
```

### Essential Configuration Keys

| Workspace          | Variable                                      | Purpose                                                                        |
| :----------------- | :-------------------------------------------- | :----------------------------------------------------------------------------- |
| `apps/web`         | `NEXT_PUBLIC_CONVEX_URL`                      | Convex deployment URL                                                          |
| `apps/web`         | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`           | Clerk public key for auth and organization switching                           |
| `apps/web`         | `CLERK_SECRET_KEY`                            | Clerk secret key for server-side verification                                  |
| `apps/widget`      | `NEXT_PUBLIC_CONVEX_URL`                      | Convex deployment URL                                                          |
| `apps/embed`       | `VITE_WIDGET_URL`                             | URL where the hosted widget app is deployed (default: `http://localhost:3001`) |
| `packages/backend` | `CLERK_SECRET_KEY`                            | Clerk server key                                                               |
| `packages/backend` | `CLERK_WEBHOOK_SECRET`                        | Webhook verification secret for user/org sync                                  |
| `packages/backend` | `CLERK_JWT_ISSUER_DOMAIN`                     | Clerk JWT Issuer for Convex auth token verification                            |
| `packages/backend` | `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | AWS IAM credentials for Secrets Manager                                        |
| `packages/backend` | `GOOGLE_GENERATIVE_AI_API_KEY`                | Set in Convex dashboard for Gemini model calls                                 |

---

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Convex Backend

In a dedicated terminal, launch the Convex development server from the backend package:

```bash
pnpm --filter @workspace/backend dev
```

This registers functions, initializes your dev database schema, and generates TypeScript codegen.

### 3. Start Frontend Applications

In another terminal, start all applications in parallel using Turborepo:

```bash
pnpm dev
```

#### Local Endpoints

- **Operator Dashboard**: `http://localhost:3000`
- **Customer Chat & Voice Widget**: `http://localhost:3001`
- **Embed Script Sandbox**: `http://localhost:3002/demo.html`

### 4. Code Quality & Verification

```bash
pnpm lint
pnpm --filter web typecheck
pnpm --filter widget typecheck
```

---

## Embedding Guide

Integrate the AgentDesk widget into any web application by adding this snippet before the closing `</body>` tag:

```html
<script
  src="https://<your-widget-domain>/widget.js"
  data-organization-id="org_your_clerk_org_id"
  async
></script>
```

### How It Works

1. `widget.js` injects a floating launcher button and a secure iframe container.
2. The iframe loads the hosted widget application (`apps/widget`) passing the `organizationId`.
3. The widget validates the organization status against Convex, applies custom theme colors, and connects the user to the AI agent or operator.

> [!TIP]
> To update the embed script bundle, run `pnpm --filter embed build` and copy the generated bundle from `apps/embed/dist/widget.js` into `apps/widget/public/widget.js`.

---

## Deployment

### 1. Convex Backend

Deploy your functions and schema to the production Convex environment:

```bash
cd packages/backend
npx convex deploy
```

Set `GOOGLE_GENERATIVE_AI_API_KEY`, `CLERK_WEBHOOK_SECRET`, and AWS credentials in your Convex Dashboard.

### 2. Operator Dashboard (`apps/web`) & Widget (`apps/widget`)

Both applications can be deployed directly to [Vercel](https://vercel.com):

- Root directory: `apps/web` (and `apps/widget` for the widget project).
- Add `NEXT_PUBLIC_CONVEX_URL` pointing to your production Convex instance.
- Add required Clerk keys and configure allowed origins / redirect URIs in the Clerk dashboard.

### 3. Post-Deployment Checklist

- Configure Clerk's webhook endpoint to route to `POST https://<your-convex-deployment>.convex.site/clerk-webhook`.
- Verify AWS Secrets Manager IAM policies allow `GetSecretValue` and `PutSecretValue` for Vapi plugin tokens.
