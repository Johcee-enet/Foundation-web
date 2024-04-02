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

// Start the countdown
// checkCountdown();
