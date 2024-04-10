import { mutationWithAuth } from "@convex-dev/convex-lucia-auth";
import { v } from "convex/values";
import { differenceInHours } from "date-fns";

import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {
  action,
  internalAction,
  internalMutation,
  mutation,
} from "./_generated/server";

export const storeEmail = internalMutation({
  args: { email: v.string(), referreeCode: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingUsers = await ctx.db.query("user").collect();
    const config = await ctx.db.query("config").first();

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
      xpCount: config?.xpCount ?? 1000,
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

export const redeemReferralCode = mutation({
  args: {
    referreeCode: v.string(),
    nickname: v.string(),
    userId: v.id("user"),
  },
  handler: async ({ db }, { referreeCode, nickname, userId }) => {
    const config = await db.query("config").first();
    // Increment users referree count
    // Get new user data
    const referree = await db
      .query("user")
      .filter((q) => q.eq(q.field("referralCode"), referreeCode?.toUpperCase()))
      .first();

    if (referree) {
      // Patch referree count
      console.log(referree, ":::Update referree xpCount");
      await db.patch(referree?._id as Id<"user">, {
        referralCount: Number(referree?.referralCount) + 1,
        xpCount: (config?.referralXpCount ?? 5000) + referree.xpCount,
      });
      await db.insert("activity", {
        userId: referree?._id,
        message: `${nickname} Joined using your referral code`,
        extra: (config?.referralXpCount ?? 5000).toLocaleString("en-US"),
        type: "xp", // Can be xp and rank
      });

      await db.patch(userId, { referreeCode });
    }
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

export const weeklyLeaderBoardCheck = internalAction({
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
        email: user.email!,
      });
    }
  },
});

// Reward with xp for tasks
export const rewardTaskXp = mutation({
  args: { xpCount: v.number(), userId: v.id("user"), taskId: v.id("tasks") },
  handler: async ({ db }, { xpCount, userId, taskId }) => {
    // Reward user for task or events completed
    const user = await db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    await db.patch(userId, {
      xpCount: user.xpCount + xpCount,
      completedTasks: user.completedTasks
        ? [...user.completedTasks, taskId]
        : [taskId],
    });
  },
});

// Reward after event actions have been completed
export const rewardEventXp = mutation({
  args: { xpCount: v.number(), userId: v.id("user"), eventId: v.id("events") },
  handler: async ({ db }, { xpCount, userId, eventId }) => {
    const user = await db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const udpatedEvents = user.eventsJoined?.map((event) => {
      if (event.eventId === eventId) {
        return {
          eventId,
          completed: true,
          actions: event.actions,
        };
      } else {
        return event;
      }
    });

    // Add xp and and reward user
    await db.patch(userId, {
      xpCount: user.xpCount + xpCount,
      eventsJoined: udpatedEvents,
    });
  },
});

// Update actions in events
export const updateEventsForUser = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.id("user"),
    actionName: v.string(),
  },
  handler: async ({ db }, { eventId, userId, actionName }) => {
    const event = await db.get(eventId);
    const user = await db.get(userId);

    // Check if the event is already in user object then update only specific action
    if (!user) {
      throw new Error("No user found");
    }
    if (!event) {
      throw new Error("No event found");
    }

    // If event already in array
    if (user.eventsJoined?.some((myEvent) => myEvent.eventId === event._id)) {
      // Update the specific action
      const updatedEventJoined = user.eventsJoined.map((joinedEvent) => {
        if (joinedEvent.eventId === event._id) {
          const updatedAction = joinedEvent.actions.map((action) => {
            if (action.name === actionName) {
              return {
                completed: true,
                name: action.name,
                type: action.type,
                channel: action.channel,
                link: action.link,
              };
            } else {
              return action;
            }
          });

          return {
            ...joinedEvent,
            actions: updatedAction,
          };
        } else {
          return joinedEvent;
        }
      });

      // Update
      await db.patch(userId, { eventsJoined: updatedEventJoined });
    } else {
      // If no event already in array
      await db.patch(userId, {
        eventsJoined: user.eventsJoined
          ? [
              ...user.eventsJoined,
              {
                eventId: event._id,
                completed: false,
                actions: event.actions.map((action) => {
                  if (action.name === actionName) {
                    return {
                      completed: true,
                      link: action.link,
                      channel: action.channel,
                      name: action.name,
                      type: action.type,
                    };
                  } else {
                    return { ...action, completed: false };
                  }
                }),
              },
            ]
          : [
              {
                eventId: event._id,
                completed: false,
                actions: event.actions.map((action) => {
                  if (action.name === actionName) {
                    return {
                      completed: true,
                      link: action.link,
                      channel: action.channel,
                      name: action.name,
                      type: action.type,
                    };
                  } else {
                    return { ...action, completed: false };
                  }
                }),
              },
            ],
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
    await runMutation(internal.mutations.beforeMine, { userId });
    await runMutation(internal.mutations.mine, { userId });
  },
});


export const beforeMine = internalMutation({
  args: { userId: v.id("user") },
  handler: async ({db}, {userId}) => {

    // Update users mining configs
    const config = await db.query("config").first();

    await db.patch(userId, {mineHours: config?.miningHours, miningRate: config?.miningCount});
    
  }
})

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
        differenceInHours(Date.now(), new Date(user.mineStartTime!), {
          roundingMethod: "floor",
        }) < user.mineHours
      ) {
        await db.patch(userId, {
          redeemableCount:
            user.miningRate *
            differenceInHours(Date.now(), new Date(user.mineStartTime!)),
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
            differenceInHours(Date.now(), new Date(user.mineStartTime!), {
              roundingMethod: "floor",
            }),
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

// Config

export const updateConfig = mutationWithAuth({
  args: {
    miningCount: v.float64(),
    miningHours: v.number(),
    xpCount: v.float64(),
    referralXpCount: v.float64(),
    configId: v.optional(v.id("config")),
  },
  handler: async ({ db }, { miningCount, miningHours, xpCount, configId, referralXpCount }) => {
    if (configId) {
      await db.patch(configId, { miningCount, miningHours, xpCount, referralXpCount });
    } else {
      await db.insert("config", {
        miningCount,
        miningHours,
        xpCount,
        referralXpCount,
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
