"use node";

import { VapiClient, Vapi } from "@vapi-ai/server-sdk";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { decrypt } from "../lib/secrets";
import { ConvexError } from "convex/values";

function getVapiCredentials(ctx: any) {
  return async () => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.org_id as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      },
    );

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }

    const secret = await ctx.runQuery(internal.system.secrets.getByName, {
      name: plugin.secretName,
    });

    if (!secret) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials not found",
      });
    }

    const secretData = decrypt<{
      privateApiKey: string;
      publicApiKey: string;
    }>({
      encryptedValue: secret.encryptedValue,
      iv: secret.iv,
      tag: secret.tag,
    });

    if (!secretData || !secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials incomplete. Please reconnect your Vapi account.",
      });
    }

    return secretData;
  };
}

export const getAssistants = action({
  args: {},
  handler: async (ctx): Promise<Vapi.Assistant[]> => {
    const credentials = await getVapiCredentials(ctx)();

    const vapiClient = new VapiClient({
      token: credentials.privateApiKey,
    });

    const assistants = await vapiClient.assistants.list();

    return assistants;
  },
});

export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx): Promise<Vapi.PhoneNumbersListResponseItem[]> => {
    const credentials = await getVapiCredentials(ctx)();

    const vapiClient = new VapiClient({
      token: credentials.privateApiKey,
    });

    const phoneNumbers = await vapiClient.phoneNumbers.list();

    return phoneNumbers;
  },
});
