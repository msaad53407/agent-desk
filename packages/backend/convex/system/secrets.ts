import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";

export const upsertEncrypted = internalMutation({
  args: {
    name: v.string(),
    encryptedValue: v.string(),
    iv: v.string(),
    tag: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("secrets")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        encryptedValue: args.encryptedValue,
        iv: args.iv,
        tag: args.tag,
      });
    } else {
      await ctx.db.insert("secrets", {
        name: args.name,
        encryptedValue: args.encryptedValue,
        iv: args.iv,
        tag: args.tag,
      });
    }
  },
});

export const getByName = internalQuery({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("secrets")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();
  },
});

export const deleteByName = internalMutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("secrets")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

