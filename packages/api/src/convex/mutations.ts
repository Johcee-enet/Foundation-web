import {
  action,
  internalAction,
  internalMutation,
  mutation,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { differenceInHours } from "date-fns";

export const storeEmail = internalMutation({
  args: { email: v.string(), referreeCode: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingUsers = await ctx.db.query("user").collect();

    if (existingUsers?.some((user) => user.email === args.email)) {
      throw new Error("Email already exist");
    }

    // Store email and referral
    const userId = await ctx.db.insert("user", {
      email: args.email,
      referreeCode: args.referreeCode,
      minedCount: 0,
      miningRate: 2.0,
      mineActive: false,
      referralCount: 0,
      mineHours: 6,
      redeemableCount: 0,
      xpCount: 1000,
      speedBoost: {
        isActive: false,
        rate: 2,
        level: 1,
      },
      botBoost: {
        isActive: false,
        hours: 3,
        level: 1,
      },
    });

    console.log(userId, ":::User id");
    return userId;
  },
});

export const storeOTPSecret = internalMutation({
  args: { secret: v.string(), userId: v.id("user") },
  handler: async (ctx, { secret, userId }) => {
    try {
      await ctx.db.patch(userId, { otpSecret: secret });
    } catch (e: any) {
      console.log(e, ":::Path errorr");
      throw e;
    }
  },
});

export const saveUserPassword = internalMutation({
  args: { hashedPassword: v.string(), userId: v.id("user") },
  handler: async (ctx, args) => {
    try {
      await ctx.db.patch(args.userId, { password: args.hashedPassword });
    } catch (e: any) {
      console.log(e.message ?? e.toString());

      throw e;
    }
  },
});

export const startMinig = internalMutation({
  handler: async (ctx, args) => {
    // Update minedCount based on active boosts and bot level
  },
});

export const addWeeklyTopRankedActivity = internalMutation({
  args: { userIds: v.array(v.id("user")) },
  handler: async ({ db }, { userIds }) => {
    for (const userId of userIds) {
      await db.insert("activity", {
        type: "rank",
        message: `You ranked in the top 3 globally for this week`,
        userId,
      });
    }
  },
});

export const weeklyLeaderBoarCheck = internalAction({
  handler: async ({ runQuery, runMutation, runAction }) => {
    // Check leaderboard and update activites for users who are top 3
    const weeksTopRankUsers = await runQuery(
      internal.queries.getWeeklyTopRanked,
    );

    // Add activities
    await runMutation(internal.mutations.addWeeklyTopRankedActivity, {
      userIds: weeksTopRankUsers.map((user) => user?._id),
    });

    // Send out a mail to top
    for (const user of weeksTopRankUsers) {
      await runAction(internal.novu.triggerLeaderboardWorkflow, {
        userId: user._id,
        email: user.email,
      });
    }
  },
});

// Deleting user accounts
export const deleteAccount = mutation({
  args: { userId: v.id("user") },
  handler: async (ctx, args) => {
    try {
      await ctx.db.delete(args.userId);
    } catch (e: any) {
      throw new Error("Error trying to delete account");
    }
  },
});

// Mining trigger
export const triggerMining = action({
  args: { userId: v.id("user") },
  handler: async ({ runMutation }, { userId }) => {
    await runMutation(internal.mutations.mine, { userId });
  },
});

export const mine = internalMutation({
  args: { userId: v.id("user") },
  handler: async ({ db, scheduler }, { userId }) => {
    const user = await db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.mineActive) {
      // Check if time is still within min rage
      if (
        differenceInHours(Date.now(), new Date(user?.mineStartTime as number), {
          roundingMethod: "floor",
        }) < user.mineHours
      ) {
        await db.patch(userId, {
          redeemableCount:
            user.miningRate *
            differenceInHours(
              Date.now(),
              new Date(user?.mineStartTime as number),
            ),
        });

        await scheduler.runAfter(1000 * 60 * 60, internal.mutations.mine, {
          userId,
        });
        return;
      } else {
        // Cancel mine and reset also check for active boosts

        await db.patch(userId, {
          mineActive: false,
          ...(user?.botBoost.isActive && {
            botBoost: { ...user.botBoost, isActive: false },
            mineHours: 6,
          }),
          ...(user?.speedBoost.isActive && {
            speedBoost: { ...user.speedBoost, isActive: false },
            miningRate: 2.0,
          }),
          redeemableCount:
            user.miningRate *
            differenceInHours(
              Date.now(),
              new Date(user?.mineStartTime as number),
              { roundingMethod: "floor" },
            ),
        });

        return;
      }
    }

    // Start
    await db.patch(userId, { mineActive: true, mineStartTime: Date.now() });
    await scheduler.runAfter(1000 * 60 * 60, internal.mutations.mine, {
      userId,
    });
  },
});

// claim redeemable amount: reset and increment minedCount

export const claimRewards = mutation({
  args: { userId: v.id("user") },
  handler: async ({ db }, { userId }) => {
    const user = await db.get(userId);
    if (!user) {
      throw new Error("No user with that Id");
    }

    // Check if mine is inActive and if redeemableCount is greater than 0
    if (!user?.mineActive && user?.redeemableCount > 0) {
      await db.patch(userId, {
        minedCount: (user?.minedCount ?? 0) + user?.redeemableCount,
        redeemableCount: 0,
      });
    }
  },
});

// Boost

export const speedBoost = mutation({
  args: { userId: v.id("user") },
  handler: async ({ db }, { userId }) => {
    const user = await db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    await db.patch(userId, {
      speedBoost: { ...user.speedBoost, isActive: true },
      miningRate: user.miningRate + user.speedBoost.rate,
    });
  },
});

export const botBoost = mutation({
  args: { userId: v.id("user") },
  handler: async ({ db }, { userId }) => {
    const user = await db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    await db.patch(userId, {
      botBoost: { ...user.botBoost, isActive: true },
      mineHours: user.mineHours + user.botBoost.hours,
    });
  },
});
