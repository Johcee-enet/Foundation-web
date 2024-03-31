"use node";

// novu
import { Novu } from "@novu/node";
import { v } from "convex/values";

import { internalAction } from "./_generated/server";

// init novu
const novu = new Novu(process.env.NOVU_API_KEY!);

export const triggerOTPWorkflow = internalAction({
  args: { userId: v.string(), email: v.string(), otp: v.string() },
  handler: async (_, args) => {
    // trigger novu otp-activation workflow
    await novu.trigger("otp-activation", {
      to: {
        subscriberId: args.userId,
        email: args.email,
      },
      payload: {
        otpCode: args.otp,
        securityEmail: "support@enetminer.com",
      },
    });
  },
});

export const triggerLeaderboardWorkflow = internalAction({
  args: { userId: v.string(), email: v.string() },
  handler: async (_, args) => {
    // trigger novu otp-activation workflow
    await novu.trigger("weekly-rank", {
      to: {
        subscriberId: args.userId,
        email: args.email,
      },
      payload: {
        securityEmail: "support@enetminer.com",
      },
    });
  },
});
