import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/convex-lucia-auth";
import { v } from "convex/values";

export default defineSchema(
  {
    ...authTables({
      user: {
        email: v.string(),
      },
      session: {},
    }),
    // This definition matches the example query and mutation code:
    user: defineTable({
      email: v.string(),
      minedCount: v.optional(v.float64()),
      miningRate: v.float64(),
      nickname: v.optional(v.string()),
      otpSecret: v.optional(v.string()),
      password: v.optional(v.string()),
      mineActive: v.boolean(),
      mineHours: v.number(),
      redeemableCount: v.float64(),
      mineStartTime: v.optional(v.number()),
      referreeCode: v.optional(v.string()),
      referralCode: v.optional(v.string()),
      referralCount: v.number(),
      xpCount: v.number(),
      speedBoost: v.object({
        isActive: v.boolean(),
        rate: v.number(),
        level: v.union(v.literal(1), v.literal(2), v.literal(3)),
      }),
      botBoost: v.object({
        isActive: v.boolean(),
        hours: v.number(),
        level: v.union(v.literal(1), v.literal(2), v.literal(3)),
      }),
      tasks: v.optional(v.array(v.id("tasks"))),
    })
      .index("by_xpCount", ["xpCount"])
      .index("by_mineActive", ["mineActive"]),
    activity: defineTable({
      userId: v.id("user"),
      message: v.string(),
      extra: v.optional(v.string()),
      type: v.union(v.literal("xp"), v.literal("rank")),
    }),
    ads: defineTable({
      link: v.string(),
      storageId: v.id("_storage"),
      expiresAt: v.optional(v.number()),
    }),
    tasks: defineTable({
      name: v.string(),
      reward: v.number(),
      action: v.object({
        link: v.string(),
        type: v.union(
          v.literal("visit"),
          v.literal("follow"),
          v.literal("post"),
          v.literal("join"),
        ),
        channel: v.union(
          v.literal("twitter"),
          v.literal("telegram"),
          v.literal("discord"),
          v.literal("website"),
        ),
      }),
    }),
    events: defineTable({
      title: v.string(),
      reward: v.number(),
      companyId: v.id("company"),
      actions: v.array(
        v.object({
          name: v.string(),
          link: v.string(),
          type: v.union(
            v.literal("visit"),
            v.literal("follow"),
            v.literal("post"),
            v.literal("join"),
          ),
          channel: v.union(
            v.literal("twitter"),
            v.literal("telegram"),
            v.literal("discord"),
            v.literal("website"),
          ),
        }),
      ),
    }),
    company: defineTable({
      name: v.string(),
      logoStorageId: v.id("_storage"),
      isApproved: v.boolean(),
    }),
  },
  // If you ever get an error about schema mismatch
  // between your data and your schema, and you cannot
  // change the schema to match the current data in your database,
  // you can:
  //  1. Use the dashboard to delete tables or individual documents
  //     that are causing the error.
  //  2. Change this option to `false` and make changes to the data
  //     freely, ignoring the schema. Don't forget to change back to `true`!
  { schemaValidation: true },
);
