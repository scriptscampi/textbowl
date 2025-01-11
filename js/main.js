import { handlePlay } from "./gameLogic.js";
import { renderGameBoard } from "./ui.js";
import { gameState } from "./gameLogic.js";

/**
 * Initializes the game by rendering the initial board and setting up button listeners.
 */
function initializeGame() {
  renderGameBoard("Welcome to Retro Football! Make your plays to outscore the CPU!");

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
 * Disables all buttons except the Reset button.
 */
function disableControls() {
  const buttons = document.querySelectorAll("#game-controls button");
  buttons.forEach((button) => {
    if (button.dataset.play !== "5") {
      button.disabled = true;
    }
  });
}

/**
 * Resets the game state and re-enables all controls.
 */
function resetGame() {
  Object.assign(gameState, {
    score: 0,
    cpuScore: 0,
    yardLine: 20,
    yardsToFirstDown: 10,
    down: 1,
    quarter: 1,
    timeRemaining: 600,
  });

  enableControls();
  renderGameBoard("Game reset! Make your plays to win.");
}

/**
 * Re-enables all buttons.
 */
function enableControls() {
  const buttons = document.querySelectorAll("#game-controls button");
  buttons.forEach((button) => {
    button.disabled = false;
  });
}

// Initialize the game once the DOM content is loaded
document.addEventListener("DOMContentLoaded", initializeGame);