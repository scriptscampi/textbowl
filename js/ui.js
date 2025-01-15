import { gameState } from "./gameLogic.js";
import { CONFIG } from "./config.js";
import { formatTime } from "./utils.js";

const gameBoard = document.getElementById("game-board");
const messageBox = document.getElementById("message-box");
/**
 * Formats the current field position based on the yard line.
 * @returns {string} - Formatted field position description.
 */
function formatYardLine() {
  if (gameState.yardLine < 50) {
    return `Player ${gameState.yardLine}-yard line`;
  } else if (gameState.yardLine === 50) {
    return "Midfield (50-yard line)";
  } else {
    return `CPU's ${CONFIG.TOUCHDOWN_LINE - gameState.yardLine}-yard line`;
  }
}
/**
 * Formats the down and distance information.
 * Displays "and Goal" if the distance to the goal is less than 10 yards.
 * @returns {string} - Formatted down and distance description.
 */
function formatDownAndDistance() {
  const distanceToGoal = CONFIG.TOUCHDOWN_LINE - gameState.yardLine;

  if (distanceToGoal <= 10) {
    return `Goal`;
  } else {
    return `${gameState.yardsToFirstDown}`;
  }
}
/**
 * Renders the game board with the current game state and message.
 * @param {string} message - Additional message to display.
 */
export function renderGameBoard(message = "") {
  console.log(`${Object.values(gameState)} at time of render`)
  gameBoard.textContent = `
====================================
       ${CONFIG.TITLE}
====================================
Score: Player ${gameState.score} - ${CONFIG.OPPONENT} ${gameState.cpuScore}
Field Position: ${formatYardLine()}
Down: ${gameState.down} | Yards to First Down: ${formatDownAndDistance()}
Quarter: ${gameState.quarter} | Time Remaining: ${formatTime(gameState.timeRemaining)}
====================================

`;
messageBox.textContent = message || "Choose your next play below.";

}
