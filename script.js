// Global variables to store timers and their intervals
let focusInterval;
let restInterval;
let isPomodoroRunning = false; // Flag to track if Pomodoro is running or paused
let isRestRunning = false; // Flag to track if Rest timer is running or paused
let focusSecondsRemaining; // Variable to store remaining focus time when paused
let restSecondsRemaining; // Variable to store remaining rest time when paused
const alarmSound = new Audio('./sound_files/alarm_clock.wav');
let isAlarmPlaying = false; // Flag to track if the alarm is currently playing

// Function to toggle the Pomodoro timer
function togglePomodoro() {
    if (!isPomodoroRunning) {
        startPomodoro();
        isPomodoroRunning = true; // Toggle isPomodoroRunning to true when the Pomodoro timer starts
    } else {
        pausePomodoro();
        isPomodoroRunning = false; // Toggle isPomodoroRunning to false when the Pomodoro timer pauses
    }
    updatePomodoroButton(); // Update the Pomodoro button icon
}

// Function to toggle the Pomodoro button icon
function updatePomodoroButton() {
    const pomodoroIcon = document.getElementById("pomodoro-start-pause-icon");
    if (isPomodoroRunning) {
        pomodoroIcon.classList.remove("fa-play");
        pomodoroIcon.classList.add("fa-pause");
    } else {
        pomodoroIcon.classList.remove("fa-pause");
        pomodoroIcon.classList.add("fa-play");
    }
}

// Function to start or pause the Rest timer
function toggleRest() {
    if (!isRestRunning) {
        startRestTimer();
        isRestRunning = true; // Toggle isRestRunning to true when the Rest timer starts
    } else {
        pauseRestTimer();
        isRestRunning = false; // Toggle isRestRunning to false when the Rest timer pauses
    }
    updateRestButton(); // Update the Rest timer button icon
}

// Function to toggle the Rest timer button icon
function updateRestButton() {
    const restIcon = document.getElementById("rest-start-pause-icon");
    if (isRestRunning) {
        restIcon.classList.remove("fa-play");
        restIcon.classList.add("fa-pause");
    } else {
        restIcon.classList.remove("fa-pause");
        restIcon.classList.add("fa-play");
    }
}

// Function to start the Pomodoro timer
function startPomodoro() {
  if (focusSecondsRemaining === undefined) {
    // If focusSecondsRemaining is undefined, start the timer from the input values
    const focusMinutes = document.getElementById("focus-minutes").value;
    const focusSeconds = document.getElementById("focus-seconds").value;
    focusSecondsRemaining = parseInt(focusMinutes) * 60 + parseInt(focusSeconds);
  }

  // Start countdown for Pomodoro timer and store the interval ID
  focusInterval = startCountdown("focus-timer", focusSecondsRemaining, function() {
      // startRestTimer(); // Don't start the rest timer automatically here
  });
}

// Function to pause the Pomodoro timer
function pausePomodoro() {
  clearInterval(focusInterval); // Clear the interval when pausing
  focusInterval = undefined; // Update the focusInterval variable
  // Update the remaining focus time when pausing
  focusSecondsRemaining = remainingTime("focus-timer");
  isPomodoroRunning = false; // Update the flag to indicate that Pomodoro is paused
  updatePomodoroButton(); // Update the Pomodoro button icon
}

// Function to start the Rest timer
function startRestTimer() {
  if (restSecondsRemaining === undefined) {
    // If restSecondsRemaining is undefined, start the timer from the input values
    const restMinutes = document.getElementById("rest-minutes").value;
    const restSeconds = document.getElementById("rest-seconds").value;
    restSecondsRemaining = parseInt(restMinutes) * 60 + parseInt(restSeconds);
  }

  // Start countdown for Rest timer and store the interval ID
  restInterval = startCountdown("rest-timer", restSecondsRemaining, function() {
      // Callback function when the Rest timer completes can be added here if needed
  });
}

// Function to pause the Rest timer
function pauseRestTimer() {
  clearInterval(restInterval); // Clear the interval when pausing
  // Update the remaining rest time when pausing
  restSecondsRemaining = remainingTime("rest-timer");
  isRestRunning = false; // Update the flag to indicate that Rest timer is paused
  updateRestButton(); // Update the Rest timer button icon
}

// Function to start the countdown for a given timer
function startCountdown(timerId, remainingSeconds, onComplete) {
  updateTimerDisplay(timerId, remainingSeconds);

  // Countdown the timer
  const interval = setInterval(function() {
      remainingSeconds--;
      if (remainingSeconds >= 0) {
          updateTimerDisplay(timerId, remainingSeconds);
      } else {
          clearInterval(interval);
          onComplete();
          playAlarm(); // Play the alarm sound
      }
  }, 1000);

  return interval; // Return the interval ID
}

// Function to update the timer display
function updateTimerDisplay(timerId, seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  document.getElementById(timerId).textContent = formatTime(minutes) + ":" + formatTime(remainingSeconds);
}

// Function to format time with leading zero if less than 10
function formatTime(time) {
  return time < 10 ? "0" + time : time;
}

// Function to get the remaining time in seconds for a given timer
function remainingTime(timerId) {
  const timerText = document.getElementById(timerId).textContent;
  const [minutes, seconds] = timerText.split(":").map(Number);
  return minutes * 60 + seconds;
}

// Function to toggle the theme
function toggleTheme() {
  // Toggle the "dark-theme" class on the body element
  document.body.classList.toggle("dark-theme");
}

// Event listener for the light theme button
document.getElementById("light-theme-btn").addEventListener("click", function() {
  toggleTheme();
});

// Event listener for the "Start/Pause" button for Pomodoro timer
document.getElementById("pomodoro-start-pause-btn").addEventListener("click", function() {
  togglePomodoro();
});

// Event listener for the "Start/Pause" button for Rest timer
document.getElementById("rest-start-pause-btn").addEventListener("click", function() {
  toggleRest();
});

// Event listener for the "Stop" button for Pomodoro timer
document.getElementById("pomodoro-stop-btn").addEventListener("click", function() {
  stopPomodoro();
  stopAlarm(); // Stop the alarm
  updatePomodoroButton(); // Update the Pomodoro button icon
});

// Event listener for the "Stop" button for Rest timer
document.getElementById("rest-stop-btn").addEventListener("click", function() {
  stopRestTimer();
  stopAlarm(); // Stop the alarm
  updateRestButton(); // Update the Rest timer button icon
});


// Function to stop the Pomodoro timer
function stopPomodoro() {
  clearInterval(focusInterval); // Clear the interval for the Pomodoro timer
  document.getElementById("focus-timer").textContent = "25:00"; // Reset the Pomodoro timer display
  isPomodoroRunning = false; // Reset the Pomodoro running flag
  focusSecondsRemaining = undefined; // Reset the remaining Pomodoro seconds
  stopAlarm(); // Stop the alarm if it's playing
}

// Function to stop the Rest timer
function stopRestTimer() {
  clearInterval(restInterval); // Clear the interval for the Rest timer
  document.getElementById("rest-timer").textContent = "05:00"; // Reset the Rest timer display
  isRestRunning = false; // Reset the Rest timer running flag
  restSecondsRemaining = undefined; // Reset the remaining Rest timer seconds
  stopAlarm(); // Stop the alarm if it's playing
}


// Function to play the alarm sound
function playAlarm() {
  if (!isAlarmPlaying) {
    alarmSound.play();
    isAlarmPlaying = true;
  }
}

// Function to stop the alarm sound
function stopAlarm() {
  if (isAlarmPlaying) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    isAlarmPlaying = false;
  }
}
