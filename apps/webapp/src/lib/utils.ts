import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { ConvexError } from "convex/values";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function getErrorMsg(err: any): string {
  const errorMsg =
    err instanceof ConvexError
      ? (err?.data as { message: string }).message
      : "Unexpected error occurred!";
  return errorMsg;
}
