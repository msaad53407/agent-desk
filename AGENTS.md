# Repository Guidelines

## Project Structure & Module Organization
This is a `pnpm` + Turborepo monorepo.
- `apps/web`: Next.js dashboard app (port `3000`).
- `apps/widget`: Next.js embeddable widget app (port `3001`).
- `apps/embed`: Vite-based embed script/demo (port `3002`).
- `packages/ui`: Shared UI components, hooks, and styles (`src/components`, `src/hooks`, `src/styles`).
- `packages/backend`: Convex backend (`convex/` public, private, and system functions).
- `packages/eslint-config` and `packages/typescript-config`: shared tooling presets.

Prefer colocating feature code under `modules/<feature>/ui|hooks|types` in apps.

## Build, Test, and Development Commands
Run from repository root unless noted.
- `pnpm install`: install workspace dependencies.
- `pnpm dev`: run all dev tasks via Turbo.
- `pnpm build`: build all packages/apps.
- `pnpm lint`: run lint tasks across the workspace.
- `pnpm format`: format `*.ts`, `*.tsx`, and `*.md` with Prettier.

Target specific workspaces when needed:
- `pnpm --filter web dev`
- `pnpm --filter widget typecheck`
- `pnpm --filter @workspace/backend dev`

## Coding Style & Naming Conventions
- Language: TypeScript + ESM modules.
- Formatting: Prettier (`pnpm format`).
- Linting: shared config from `@workspace/eslint-config` (Next.js apps use Next + React Hooks rules).
- Components/files: use `kebab-case` filenames (for example `conversation-status-button.tsx`).
- React exports/types: use `PascalCase`; hooks use `useX` naming.

## Testing Guidelines
There is currently no unified automated test runner configured at the root (no `test` script in main workspaces). For now:
- Treat `pnpm lint` and workspace `typecheck` as required validation.
- For UI changes, include manual verification notes (affected app, route, and expected behavior).
- Add tests with any new test framework you introduce and document the command in the workspace `package.json`.

## Commit & Pull Request Guidelines
Recent history follows short, task-oriented commits like `34: embed script`.
- Use pattern: `<issue-or-task-number>: <imperative summary>`.
- Keep commits focused and scoped to one logical change.
- PRs should include: purpose, key changes, verification steps, linked issue/task, and screenshots/video for UI updates.
- Call out config/env changes explicitly (especially Convex, Clerk, Sentry, Vapi).

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
