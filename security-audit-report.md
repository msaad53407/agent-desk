# Security Audit Report

## Security Findings

### Critical

- **Cross-tenant conversation creation (BOLA / tenant breakout)** in `packages/backend/convex/public/conversations.ts`  
  The public `create` mutation trusts client-supplied `organizationId` and does not bind it to the `contactSession`’s org before inserting the conversation.
  ```ts
  export const create = mutation({
    args: {
      organizationId: v.string(),
      contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
      const session = await ctx.db.get(args.contactSessionId);
      // ...
      const conversationId = await ctx.db.insert("conversations", {
        contactSessionId: session._id,
        status: "unresolved",
        organizationId: args.organizationId,
        threadId,
      });
  ```
  - **Impact:** a valid session from Org A can create conversation records under Org B.

- **Thread/session binding missing in public message APIs** in `packages/backend/convex/public/messages.ts`  
  `messages.create` and `messages.getMany` validate session existence/expiry, but do not verify that `threadId` belongs to that session’s conversation.
  ```ts
  const contactSession = await ctx.runQuery(
    internal.system.contactSessions.getOne,
    {
      contactSessionId: args.contactSessionId,
    },
  );
  // ...
  const conversation = await ctx.runQuery(
    internal.system.conversations.getByThreadId,
    {
      threadId: args.threadId,
    },
  );
  ```
  ```ts
  export const getMany = query({
    args: {
      threadId: v.string(),
      // ...
      contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
      const contactSession = await ctx.db.get(args.contactSessionId);
      // no thread <-> session ownership check
  ```
  - **Impact:** if a thread ID is known/leaked, an attacker can read/send messages for another conversation context.
  - **Compounding risk:** AI `search` namespaces by `conversation.organizationId`, so the above can become cross-tenant knowledge-base access.

### High

- **PII exposure via public session validation** in `packages/backend/convex/public/contactSessions.ts`  
  `validate` returns entire `contactSession` document on success (name/email/metadata/org).
  ```ts
  export const validate = mutation({
    args: {
      contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
      const contactSession = await ctx.db.get(args.contactSessionId);
      // ...
      return { valid: true, contactSession };
    },
  });
  ```
  - **Impact:** session ID leakage becomes direct customer data leakage.

### Medium

- **Organization enumeration endpoint** in `packages/backend/convex/public/organizations.ts`  
  Public action verifies arbitrary org IDs against Clerk and returns validity.
  - **Impact:** attacker can enumerate valid orgs for targeting/recon.

- **Public org-scoped config access by `organizationId` only**  
  - `packages/backend/convex/public/widgetSettings.ts`
  - `packages/backend/convex/public/secrets.ts` (`publicApiKey` retrieval)
  - **Impact:** likely intentional for embed bootstrapping, but exposes tenant config to anyone with org ID.

### Low

- **Wildcard `postMessage` target** in `apps/widget/modules/widget/ui/views/widget-view.tsx`
  ```ts
  window.parent.postMessage({
    type: "theme",
    payload: {
      accentColor,
    },
  }, "*");
  ```
  - Current payload is non-sensitive, but hardening should use explicit origin.

## Authentication & Org Data Flow Review

- **Dashboard app (`apps/web`) auth is strong**: Clerk middleware + `ConvexProviderWithClerk`, server-side org checks in private Convex functions.
- **Widget/embed path is client-asserted**: `organizationId` comes from embed script/query param, widget uses unauthenticated `ConvexProvider`.
- **Key boundary mismatch:** private functions correctly derive org from `ctx.auth.getUserIdentity()`, while public widget functions trust client-provided IDs and don’t consistently enforce object ownership/binding.
- **Result:** exploitable tenant-boundary weaknesses are concentrated in `packages/backend/convex/public/*`.

## Open Questions / Assumptions

- Assumes `organizationId` is not a secret and is intentionally embeddable; if true, some config exposure is “by design” but still recon-relevant.
- No active exploit scripts were run against live deployments; this is code-level exploitability review.
- No obvious SQL injection/SSRF/CORS/CSRF issues were found in reviewed code paths.

## Priority Fix Order

- **1) Fix conversation create binding:** enforce `session.organizationId === args.organizationId` (or better: derive org only from session).
- **2) Fix message ownership checks:** in `public.messages.create/getMany`, resolve conversation by thread and require `conversation.contactSessionId === args.contactSessionId`.
- **3) Minimize `contactSessions.validate` response:** return only `{ valid, reason? }`, never full session record.
- **4) Add anti-enumeration controls:** rate limiting + generic response for org validation.
- **5) Harden postMessage origin handling** and tighten any remaining public-by-org endpoints as needed.
