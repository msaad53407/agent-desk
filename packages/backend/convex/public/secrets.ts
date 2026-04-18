"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { decrypt } from "../lib/secrets";

export const getVapiSecrets = action({
  args: {
    organizationId: v.string()
  },
  handler: async (ctx, args): Promise<{ publicApiKey: string } | null> => {
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: args.organizationId,
        service: "vapi",
      },
    );

    if (!plugin) {
      return null;
    }

    const secret = await ctx.runQuery(internal.system.secrets.getByName, {
      name: plugin.secretName,
    });

    if (!secret) {
      return null;
    }

    const secretData = decrypt<{
      privateApiKey: string;
      publicApiKey: string;
    }>({
      encryptedValue: secret.encryptedValue,
      iv: secret.iv,
      tag: secret.tag,
    });

    if (!secretData) {
      return null;
    }

    if (!secretData.publicApiKey) {
      return null;
    }

    if (!secretData.privateApiKey) {
      return null;
    }

    return {
      publicApiKey: secretData.publicApiKey,
    };
  },
});
