import { CONFIG } from "./config.js";
import { getWeightedYards, getRandomMessage } from "./utils.js";
import { renderGameBoard } from "./ui.js";
import { showTouchdownMessage,Fireworks } from "./animations.js";

// Initialize fireworks instance
export const fireworks = new Fireworks("fireworks-canvas");

// Global game state
export const gameState = {
  score: 0,
  cpuScore: 0,
  yardLine: 20,
  yardsToFirstDown: 10,
  down: 1,
  quarter: 1,
  timeRemaining: CONFIG.QUARTER_LENGTH,
  consecutivePlays: { type: null, count: 0 }, // Tracks repeated plays
  disabledPlays: [], // Tracks disabled play types
};
/**
 * Generates a starting drive position (0-40) with likelihood decreasing toward the extremes.
 * @param {number} min - Minimum yard line (e.g., 0).
 * @param {number} max - Maximum yard line (e.g., 40).
 * @param {number} mean - Mean yard line (e.g., 20, the center of the distribution).
 * @param {number} stdDev - Standard deviation for the bell curve (e.g., 10).
 * @returns {number} - Random starting yard line.
 */
function generateStartingDrive(min = 0, max = 40, mean = 20, stdDev = 10) {
  // Gaussian function to simulate bell curve
  function gaussianRandom(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Ensure non-zero
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v); // Box-Muller transform
    return z * stdDev + mean; // Scale and shift to fit the distribution
  }

  // Generate a value within the range and clamp it
  let value;
  do {
    value = gaussianRandom(mean, stdDev);
  } while (value < min || value > max); // Ensure it's within bounds

  return Math.round(value);
}

/**
 * Resets the drive after a turnover or a score.
 */
function resetDrive() {
  Object.assign(gameState, {
    yardLine: generateStartingDrive(),
    yardsToFirstDown: 10,
    down: 1,
    consecutivePlays: { type: null, count: 0 }, // Reset consecutive plays
    disabledPlays: [], // Re-enable all plays
  });
  console.log(`reset Drive ${Object.values(gameState)}`)
}

/**
 * Updates the remaining time in the quarter.
 * Returns a message if a quarter ends or the game ends.
 */
export function updateGameTime() {
  const timeUsed = Math.floor(Math.random() * 26) + 15; // Random time between 15-40 seconds
  gameState.timeRemaining -= timeUsed;

  if (gameState.timeRemaining <= 0) {
    gameState.timeRemaining = 0;

    if (gameState.quarter >= 4) {
      renderGameBoard(`The game is over!\nFinal Score: Player ${gameState.score} - ${CONFIG.OPPONENT} ${gameState.cpuScore}`);
        if (gameState.score > gameState.cpuScore) {
          fireworks.start(7000); // Show fireworks for 7 seconds
        }

      return false; // Game over
    } else {
      gameState.quarter++;
      gameState.timeRemaining = CONFIG.QUARTER_LENGTH;
      renderGameBoard(`End of Quarter ${gameState.quarter - 1}.\nStarting Quarter ${gameState.quarter}!`);
    }
  }
  return true; // Game continues
}

/**
 * Randomly generates and applies a penalty.
 * @param {string} currentSide - The side committing the penalty ("offense" or "defense").
 * @param {string} playType - The current play type ("run", "pass", or "all").
 * @returns {string} - The penalty message.
 */
/*
export function applyPenalty(currentSide, playType) {
  // Filter penalties based on the current side and play type
  const validPenalties = CONFIG.PENALTIES.filter(
    (penalty) =>
      penalty.affects.includes(currentSide) &&
      (penalty.playtype === "all" || penalty.playtype === playType)
  );

  // If no valid penalties are available, return null
  if (validPenalties.length === 0) {
    return null;
  }

  // Randomly select a penalty
  const penalty = validPenalties[Math.floor(Math.random() * validPenalties.length)];

  // Pick a random message for the penalty
  const penaltyMessage = penalty.messages[Math.floor(Math.random() * penalty.messages.length)];

  // Apply penalty effects
  if (currentSide === "offense") {
    gameState.yardLine = Math.max(0, gameState.yardLine - penalty.yards); // Move back, can't go below 0
    if (penalty.lossofdown) {
      gameState.down++;
    }
  } else if (currentSide === "defense") {
    gameState.yardLine = Math.min(CONFIG.TOUCHDOWN_LINE, gameState.yardLine + penalty.yards); // Move forward, can't exceed touchdown

    // Handle automatic first down
    if (penalty.automaticFirstDown) {
      gameState.down = 1; // Reset to first down
      gameState.yardsToFirstDown = 10; // Reset yards to first down
    }
  }

  // Handle down logic for non-automatic first down penalties
  if (!penalty.lossofdown && currentSide === "offense") {
    // Repeat the down without exceeding MAX_DOWNS
    gameState.down = Math.min(gameState.down, CONFIG.MAX_DOWNS);
  }

  // Return the penalty message
  return `${penalty.name} on the ${currentSide}. ${penalty.yards}-yard penalty.\n${penaltyMessage}`;
}*/
 /**
 * Checks for injuries when a play is run too many times consecutively.
 * @param {string} playType - The type of play being executed.
 * @returns {string|null} - Injury message if an injury occurs, or null.
 */

function injuryCheck(playType) {
  if (gameState.consecutivePlays.type === playType) {
    gameState.consecutivePlays.count++;
  } else {
    gameState.consecutivePlays.type = playType;
    gameState.consecutivePlays.count = 1;
  }

  // Trigger injury if the play is run more than 3 times consecutively
  if (gameState.consecutivePlays.count > 6) {
    const injury = CONFIG.INJURIES[Math.floor(Math.random() * CONFIG.INJURIES.length)];
    const position = CONFIG.POSITIONS[playType];
    gameState.disabledPlays.push(playType); // Disable the play for the rest of the drive
    return `Injury Alert: Your ${position} has suffered a ${injury}! "${playType}" is disabled for the rest of the drive.`;
  }

  return null;
}

/**
 * Simulates a CPU drive.
 * Returns a message describing the result of the drive.
 */
export function cpuDrive() {
  const cpuPlay = Math.floor(Math.random() * 100);

  if (cpuPlay < 25) {
    gameState.cpuScore += 7;
    updateGameTime();
    return getRandomMessage(CONFIG.CPU_TOUCHDOWN_MESSAGES);
  } else if (cpuPlay < 50) {
    gameState.cpuScore += 3;
    updateGameTime();
    return `The CPU kicked a field goal.`;
  } else {
    updateGameTime();
    return `The CPU failed to score on their drive.`;
  }
}

/**
 * Checks for turnovers based on play type.
 * Returns a message if a turnover occurs, otherwise null.
 */
function turnoverCheck(playType) {
  const turnoverChance = Math.random() * 100;

  if (playType === "run" && turnoverChance < 2.5) {
    return getRandomMessage(CONFIG.FUMBLE_MESSAGES);
  } else if (playType === "pass" && turnoverChance < 4) {
    return getRandomMessage(CONFIG.INTERCEPTION_MESSAGES);
  } else if (playType === "razzle_dazzle" && turnoverChance < 55) {
    return getRandomMessage(CONFIG.FAILED_RAZZLEDAZLE_MESSAGES);
  }

  // No turnover
  return null;
}
/**
 * Caps the yards gained to the maximum distance to the goal.
 * @param {number} yardsGained - The yards gained from a play.
 * @returns {number} - Adjusted yards gained (capped to the distance to the goal).
 */
function capYardsToGoal(yardsGained) {
  const distanceToGoal = CONFIG.TOUCHDOWN_LINE - gameState.yardLine;
  return Math.min(yardsGained, distanceToGoal);
}
/**
 * Simulates a run play and returns the yards gained.
 * @param {number} remainingYards - The yards remaining to the goal line.
 * @returns {number} - The yards gained on the run.
 */
function simulateRun(remainingYards) {
    if (remainingYards <= 0) return 0;
  
    const probabilities = [
      { range: [-3, 0], weight: 15 }, // Negative or zero-yard runs
      { range: [1, 4], weight: 55 },  // Short gains
      { range: [5, 10], weight: 25 }, // Moderate gains
      { range: [11, 20], weight: 5 }, // Long gains
    ];
  
    function weightedRandom() {
      const totalWeight = probabilities.reduce((sum, p) => sum + p.weight, 0);
      const random = Math.random() * totalWeight;
      let cumulativeWeight = 0;
  
      for (const p of probabilities) {
        cumulativeWeight += p.weight;
        if (random < cumulativeWeight) {
          const [min, max] = p.range;
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
      }
      return 0; // Fallback
    }
  
    let runLength = weightedRandom();
    runLength = Math.min(runLength, remainingYards);
    return Math.max(runLength, 0);
  }

/**
 * Handles a run play.
 * Returns a message describing the play result.
 */
export function handleRunPlay() {
 // const yardOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  //const weights = [1, 9, 90, 90, 15, 3, 3, 3, 3, 2, 1];
  let remainingYards = CONFIG.TOUCHDOWN_LINE - gameState.yardLine;
  let yardsGained = simulateRun(remainingYards)
  //yardsGained = capYardsToGoal(yardsGained);
  gameState.yardLine += yardsGained;
  gameState.yardsToFirstDown -= yardsGained;

  return `You chose to run and ${yardsGained >= 0 ? "gained" : "lost"} ${Math.abs(yardsGained)} yards.`;
}
/**
 * Simulates passing yards gained on a play, including sacks, incompletions, and completed passes.
 * @param {number} mean - Average yards gained for completed passes (default 10).
 * @param {number} stdDev - Standard deviation for yardage (default 5).
 * @param {number} max - Maximum allowed yards on a play (default 60).
 * @param {number} sackProbability - Probability of a sack occurring (default 0.06 or 6%).
 * @param {number} sackRange - Range of yards lost on a sack (default [-15, -1]).
 * @param {number} incompletionProbability - Probability of an incomplete pass (default 0.35 or 35%).
 * @returns {number} - Simulated passing yards gained (or lost).
 */
function simulatePassingPlay(
  mean = 10,
  stdDev = 5,
  max = 60,
  sackProbability = 0.06,
  sackRange = [-15, -1],
  incompletionProbability = 0.20
) {
  // Generate a random value using the Box-Muller transform for normal distribution
  function gaussianRandom() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Avoid 0 for log
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z;
  }

  // Determine if a sack occurs
  if (Math.random() < sackProbability) {
    // Sack occurred, generate yards lost within the sack range
    const [min, max] = sackRange;
    return Math.floor(Math.random() * (max - min + 1)) + min; // Random sack loss
  }

  // Determine if an incomplete pass occurs
  if (Math.random() < incompletionProbability) {
    // Incompletion occurred, return 0 yards
    return 0;
  }

  // No sack or incompletion, calculate passing yards
  const randomYards = gaussianRandom() * stdDev + mean;

  // Clamp the value between 0 and the maximum allowed yards
  return Math.max(0, Math.min(Math.round(randomYards), max));
}

// Example usage
const passingYards = simulatePassingPlay();
console.log(`Passing yards gained: ${passingYards}`);

export function handlePassPlay() {
  //const yardOptions = [-5, 0, 5, 10, 15, 20, 25];
  //const weights = [3, 12, 20, 25, 25, 15, 5];
  //let remainingYards = CONFIG.TOUCHDOWN_LINE - gameState.yardLine;
  //let yardsGained = getWeightedYards(yardOptions, weights);
  let yardsGained = simulatePassingPlay();
  yardsGained = capYardsToGoal(yardsGained);
  gameState.yardLine += yardsGained;
  gameState.yardsToFirstDown -= yardsGained;

  return yardsGained >= 0
    ? `You attempted a pass and gained ${yardsGained} yards.`
    : `You attempted a pass but lost ${Math.abs(yardsGained)} yards.`;
}

/**
 * Handles a field goal attempt.
 * Returns a message describing the result of the field goal.
 */
export function attemptFieldGoal() {
  const distance = 100 - gameState.yardLine + 17;
  let successChance;

  if (distance <= 50) {
    // Linear decrease from 95% at 20 yards to 85% at 50 yards
    successChance = Math.max(85, 95 - ((distance - 20) * (10 / 30))); // Decrease by ~0.33% per yard
  } else if (distance <= 60) {
    // Logarithmic decrease for 51-60 yards
    successChance = Math.max(1, 50 / Math.log2(distance - 49 + 1)); // Decreases as distance increases
  } else {
    // Distances over 60 yards
    successChance = Math.random() < 0.5 ? 2 : 1; // Randomly 1% or 2%
  }

  const attemptMessage = `${distance}-yard attempt. `;
  
  if (Math.random() * 100 < successChance) {
    gameState.score += 3;
    const successMessage = getRandomMessage(CONFIG.FIELD_GOAL_MESSAGES);
    return `${attemptMessage}${successMessage}`;
  } else {
    const failMessage = getRandomMessage(CONFIG.MISSED_FIELD_GOAL_MESSAGES);
    return `${attemptMessage}${failMessage}`;
  }
}

/**
 * Handles a razzle dazzle play.
 * Returns a message describing the play result.
 */
export function handleRazzleDazzlePlay() {
  const yardOptions = [-10, -5, 90, 100];
  const weights = [12, 15, 20, 25];
  let yardsGained = getWeightedYards(yardOptions, weights);
  yardsGained = capYardsToGoal(yardsGained);
  gameState.yardLine += yardsGained;
  gameState.yardsToFirstDown -= yardsGained;

  return yardsGained >= 0
    ? `You attempted the Razzle Dazzle and gained ${yardsGained} yards!`
    : `You put the Dazzle before the Razzle and lost ${Math.abs(yardsGained)} yards!`;
}

/**
 * Handles the selected play type.
 * @param {number} play - The selected play (1: Run, 2: Pass, 3: Field Goal, 4: Razzle Dazzle)
 */
export function handlePlay(play) {
  let message = "";

  const playType = play === 1 ? "run"
                : play === 2 ? "pass"
                : play === 3 ? "field goal"
                : "razzle_dazzle";
   
   // Check if the play is disabled
   if (gameState.disabledPlays.includes(playType)) {
    renderGameBoard(`The "${playType}" play is disabled due to an injury. Choose another play.`);
    return;
  }
  const turnoverMessage = turnoverCheck(playType);

  if (turnoverMessage) {
    const cpuMessage = cpuDrive();
    resetDrive();
    renderGameBoard(`${turnoverMessage}\n${cpuMessage}`);
    console.log("made it to turnover check")
    return;
  }
  

   // Randomly decide if a penalty occurs (e.g., 5% chance)
  /* if (Math.random() < 0.8) {
    const penaltySide = Math.random() < 0.5 ? "offense" : "defense";
    const penaltyMessage = applyPenalty(penaltySide);
    renderGameBoard(penaltyMessage);
    return;
  }*/

  // Check for injuries
  const injuryMessage = injuryCheck(playType);

  switch (play) {
    case 1: // Run
      message = handleRunPlay();
      break;

    case 2: // Pass
      message = handlePassPlay();
      break;

    case 3: // Field Goal
       console.log("kicked field goal")
      const fieldGoalMessage = attemptFieldGoal();
      const cpuMessageAfterFieldGoal = cpuDrive();
      resetDrive();
      renderGameBoard(`${fieldGoalMessage}\n${cpuMessageAfterFieldGoal}`);
      //message += `${fieldGoalMessage}\n${cpuMessageAfterFieldGoal}`;
     
      return;

    case 4: // Razzle Dazzle
      message = handleRazzleDazzlePlay();
      break;

    default:
      renderGameBoard("Invalid play. Please select a valid option.");
      return;
  }

  // Determine the current play status
let status = null;

if (gameState.yardLine >= CONFIG.TOUCHDOWN_LINE) {
  status = "touchdown";
} else if (gameState.yardsToFirstDown <= 0) {
  status = "first_down";
} else if (gameState.down >= CONFIG.MAX_DOWNS) {
  status = "turnover_on_downs";
} else {
  status = "continue";
}

// Generate the formatted yard line description
let yardLineDescription = "";

switch (true) {
  case gameState.yardLine < 50:
    yardLineDescription = `Player ${gameState.yardLine}-yard line`;
    break;

  case gameState.yardLine === 50:
    yardLineDescription = "Midfield (50-yard line)";
    break;

  case gameState.yardLine > 50:
    yardLineDescription = `CPU's ${CONFIG.TOUCHDOWN_LINE - gameState.yardLine}-yard line`;
    break;

  default:
    yardLineDescription = "Unknown position";
    break;
}

// Handle the status using a switch statement
switch (status) {
  case "touchdown":
    gameState.score += 7;
    showTouchdownMessage(); 
    const cpuTouchdownMessage = cpuDrive();
    message += `\n${getRandomMessage(CONFIG.PLAYER_TOUCHDOWN_MESSAGES)}\n${cpuTouchdownMessage}`;
    resetDrive();
    break;

  case "first_down":
    gameState.down = 1;
    gameState.yardsToFirstDown = 10;
    message += `\n${getRandomMessage(CONFIG.FIRST_DOWN_MESSAGES)}`;
    break;

  case "turnover_on_downs":
    const cpuTurnoverMessage = cpuDrive();
    message += `\n${getRandomMessage(CONFIG.TURNOVER_ON_DOWNS_MESSAGES)}\n${cpuTurnoverMessage}`;
    resetDrive();
    break;

  case "continue":
    gameState.down++;
    break;

  default:
    console.error("Unknown game status:", status);
    break;
}

// Include the yard line description in the message
//message += `\nCurrent Field Position: ${yardLineDescription}`;
if (injuryMessage) {
  message = `${message}\n${injuryMessage}`;
}
renderGameBoard(message);
updateGameTime();}
