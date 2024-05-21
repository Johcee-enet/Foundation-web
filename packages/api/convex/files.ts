import { mutationWithAuth } from "@convex-dev/convex-lucia-auth";
import { ConvexError, v } from "convex/values";

import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutationWithAuth({
  args: {
    // ...
  },
  handler: async (ctx) => {
    // use `args` and/or `ctx.auth` to authorize the user
    if (!ctx.session || !ctx.session.user) {
      throw new ConvexError({
        message: "Must be logged in to upload",
      });
    }

    // Return an upload URL
    return await ctx.storage.generateUploadUrl();
  },
});

export const generateUploadUrlForCompanyLogo = mutationWithAuth({
  args: {},
  handler: async (ctx) => {
    if (!ctx.session || !ctx.session.user) {
      throw new ConvexError({
        message: "Must be logged in to upload",
      });
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const generateUploadUrlForEventCover = mutationWithAuth({
  args: {},
  handler: async (ctx) => {
    if (!ctx.session || !ctx.session.user) {
      throw new ConvexError({
        message: "Must be logged in to upload",
      });
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const saveStorageId = mutationWithAuth({
  // You can customize these as you like
  args: {
    storageId: v.id("_storage"),
    expiresAt: v.optional(v.number()),
    link: v.string(),
    // other args...
  },
  handler: async (ctx, args) => {
    // use `args` and/or `ctx.auth` to authorize the user
    if (!ctx.session || !ctx.session.user) {
      throw new ConvexError({
        message: "Must be logged in to upload",
      });
    }

    // Check if any record exists and replace
    const existingAd = await ctx.db.query("ads").first();

    if (existingAd) {
      await ctx.db.replace(existingAd._id, {
        expiresAt: args.expiresAt,
        link: args.link,
        storageId: args.storageId,
      });
      return;
    }

    // Save the storageId to the database using `insert`
    await ctx.db.insert("ads", {
      storageId: args.storageId,
      expiresAt: args.expiresAt,
      link: args.link,
    });
  },
});

export const getBannerData = query({
  handler: async (ctx) => {
    const ad = await ctx.db.query("ads").first();

    if (!ad) {
      return ad;
    }

    return {
      ...ad,
      url: ad ? await ctx.storage.getUrl(ad?.storageId as Id<"_storage">) : "",
    };
  },
});
