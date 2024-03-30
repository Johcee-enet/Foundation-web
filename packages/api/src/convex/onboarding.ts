// TODO: Create convex action to store user data, create OTP and send email with novu
import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { customAlphabet } from "nanoid";
import { Id } from "./_generated/dataModel";
import bcrypt from "bcryptjs";

// Random OTP code
const generateOTPCode = customAlphabet("0123456789", 6);

export const initializeNewUser = action({
  args: { email: v.string(), referreeCode: v.optional(v.string()) },
  handler: async (ctx, args): Promise<string> => {
    // TODO: handle oslo OTP creation and novu email workflow trigger
    const userId: Id<"user"> = await ctx.runMutation(
      internal.mutations.storeEmail,
      {
        email: args.email,
        referreeCode: args.referreeCode,
      },
    );

    // TODO: Create OTP
    const otp = generateOTPCode();
    console.log(otp, ":::User OTP");

    await ctx.runMutation(internal.mutations.storeOTPSecret, {
      userId,
      secret: otp,
    });

    // TODO: call novu action
    const novuResult = await ctx.runAction(internal.novu.triggerOTPWorkflow, {
      otp,
      userId: userId,
      email: args.email,
    });

    console.log(novuResult, ":::Novu result");

    return userId;
  },
});

export const resendOTPCode = action({
  args: { email: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    // TODO: Create OTP
    const otp = generateOTPCode();
    console.log(otp, ":::User OTP");

    await ctx.runMutation(internal.mutations.storeOTPSecret, {
      userId: args.userId as Id<"user">,
      secret: otp,
    });

    // TODO: call novu action
    await ctx.runAction(internal.novu.triggerOTPWorkflow, {
      otp,
      userId: args.userId,
      email: args.email,
    });
  },
});

export const verifyUserOTP = action({
  args: { otp: v.string(), userId: v.id("user") },
  handler: async (ctx, args) => {
    // Call query to get secretstring
    const secretString: string = await ctx.runQuery(
      internal.queries.getOTPSecret,
      { userId: args.userId },
    );

    console.log(secretString, args.otp, args.userId, ":::OPT values");

    const isValid = args.otp === secretString;
    return isValid;
  },
});

export const storePassword = action({
  args: { userId: v.id("user"), password: v.string() },
  handler: async (ctx, args) => {
    const hashedPassword = await bcrypt.hash(args.password, 10);

    await ctx.runMutation(internal.mutations.saveUserPassword, {
      userId: args.userId,
      hashedPassword: hashedPassword,
    });
  },
});

export const loginUser = action({
  args: { email: v.string(), password: v.string() },
  handler: async ({ runQuery }, { email, password }) => {
    // console.log(email, "::::Loging email");
    try {
      const user: any = await runQuery(internal.queries.getUserWithEmail, {
        email,
      });
      if (!user) {
        throw new Error("User not found");
      }

      // Compare password
      if (await bcrypt.compare(password, user?.password)) {
        return user;
      } else {
        throw new Error("Invalid email pr password");
      }
    } catch (e: any) {
      throw new Error("Issue with getting user");
    }
  },
});

export const storeNickname = mutation({
  args: { nickname: v.string(), userId: v.id("user") },
  handler: async (ctx, { nickname, userId }) => {
    try {
      const referralCode = generateReferralCode();

      await ctx.db.patch(userId, { nickname: nickname, referralCode });

      // Increment users referree count
      // Get new user data
      const user = await ctx.db.get(userId);
      const referree = await ctx.db
        .query("user")
        .filter((q) => q.eq(q.field("referralCode"), user?.referreeCode))
        .first();

      if (referree) {
        // Patch referree count
        await ctx.db.patch(referree?._id as Id<"user">, {
          referralCount: Number(referree?.referralCount) + 1,
          xpCount: 23 + referree.xpCount,
        });
        await ctx.db.insert("activity", {
          userId: referree?._id,
          message: `${user?.nickname} Joined using your referral code`,
          extra: "23",
          type: "xp", // Can be xp and rank
        });
      }
    } catch (e: any) {
      console.log(e.message ?? e.toString());
      throw new Error(e.message ?? e.toString());
    }
  },
});

export const isNicknameValid = mutation({
  args: { nickname: v.string() },
  handler: async (ctx, { nickname }) => {
    // Check if the email already exists in the user table

    const users = await ctx.db.query("user").collect();

    if (!users || !users.length) return true;

    const isNotValid: boolean = users.some(
      (user) => user?.nickname === nickname,
    );

    return !isNotValid;
  },
});

const generateReferralCode = (): string => {
  const nanoid = customAlphabet("1234567890abcdef", 6);
  const referralCode = nanoid().toUpperCase();
  return referralCode;
};
