import { CONFIG } from "./config.js";
import { handlePlay, gameState, fireworks } from "./gameLogic.js";
import { renderGameBoard } from "./ui.js";


/**
 * Initializes the game by rendering the initial board and setting up button listeners.
 */
function initializeGame() {
  CONFIG.OPPONENT = getRandomOpponent(); // Set opponent dynamically
  renderGameBoard("Welcome to Retro Football! Make your plays to outscore the CPU!"); // Render initial state

  const gameControls = document.getElementById("game-controls");
  gameControls.addEventListener("click", (event) => {
    const play = parseInt(event.target.dataset.play, 10);

    if (!isNaN(play)) {
      if (play === 5) {
        resetGame();
      } else {
        handlePlay(play);

        // Disable controls if the game ends
        if (gameState.timeRemaining === 0 && gameState.quarter === 4) {
          disableControls();
        }
      }
    }
  });
}


/**
 * Randomly selects a team name from the TEAMS object.
 * @returns {string} - Random team name.
 */
function getRandomOpponent() {
  const teamNames = Object.keys(CONFIG.TEAMS);
  const randomIndex = Math.floor(Math.random() * teamNames.length);
  return teamNames[randomIndex];
}
document.getElementById("game-controls").addEventListener("click", handleControlEvent);
document.getElementById("game-controls").addEventListener("touchstart", handleControlEvent);

function handleControlEvent(event) {
  const play = parseInt(event.target.dataset.play, 10);

  if (!isNaN(play)) {
    if (play === 5) {
      resetGame();
    } else {
      handlePlay(play);

      // Disable controls if the game ends
      if (gameState.timeRemaining === 0 && gameState.quarter === 4) {
        disableControls();
      }
    }
  }
}
/**
 * Enables all game controls except those explicitly excluded.
 */
function enableControls() {
  const gameControls = document.querySelectorAll("#game-controls button");
  gameControls.forEach((button) => {
    // Enable all buttons
    button.disabled = false;
  });
}

/**
 * Disables all game controls except the reset button.
 */
function disableControls() {
  const gameControls = document.querySelectorAll("#game-controls button");
  gameControls.forEach((button) => {
    if (button.dataset.play === "5") {
      // Keep the reset button enabled
      button.disabled = false;
    } else {
      // Disable other buttons
      button.disabled = true;
    }
  });
}

function resetGame() {
  fireworks.stop();
  CONFIG.OPPONENT = getRandomOpponent(); // Reset opponent
  Object.assign(gameState, {
    score: 0,
    cpuScore: 0,
    yardLine: 20,
    yardsToFirstDown: 10,
    down: 1,
    quarter: 1,
    timeRemaining: 600,
    consecutivePlays: { type: null, count: 0 },
    disabledPlays: [],
  });
  enableControls();
  renderGameBoard("Game reset! Make your plays to win.");
}

// Initialize the game once the DOM content is loaded
document.addEventListener("DOMContentLoaded", initializeGame);