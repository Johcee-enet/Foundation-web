import { addHours, differenceInSeconds, formatDuration } from "date-fns";

// Function to check if the countdown has ended
export function checkCountdown({
  startTime,
  countdownDuration = 6,
}: {
  startTime: number;
  countdownDuration: number;
}) {
  // Set the start time of the countdown
  // const startTime = new Date();

  // Define the duration for the countdown (6 hours)
  // const countdownDuration = 6;

  // Calculate the end time for the countdown
  const endTime = addHours(startTime, countdownDuration);

  const currentTime = Date.now();
  const remainingTime = differenceInSeconds(
    endTime.getMilliseconds(),
    currentTime,
  );

  if (remainingTime <= 0) {
    console.log("Countdown ended. Performing action...");
    // Perform the action here
  } else {
    const formattedRemainingTime = formatDuration(
      { seconds: remainingTime },
      { format: ["hours", "minutes", "seconds"] },
    );
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;
    console.log(`${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    console.log(`Time remaining: ${formattedRemainingTime}`);
    // Check again after 1 second
    setTimeout(() => checkCountdown({ startTime, countdownDuration }), 1000);

    return formattedRemainingTime;
  }
}

// @flow
// Inspired by: https://github.com/davidchambers/Base64.js/blob/master/base64.js

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
export const Base64 = {
  btoa: (input = "") => {
    let str = input;
    let output = "";

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input = "") => {
    let str = input.replace(/=+$/, "");
    let output = "";

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded.",
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  },
};

export function delay(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
