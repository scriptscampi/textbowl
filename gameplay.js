
    // ----- GAME VARIABLES -----
    let title = "Text Bowl Football"
    let opponent = "CPU's"
    let score = 0;
    let cpuScore = 0;
    let yardLine = 20;
    let yardsToFirstDown = 10;
    let down = 1;
    let maxDowns = 4;
    let quarter = 1;
    let QUARTER_LENGTH = 600
    let timeRemaining =  QUARTER_LENGTH; // 15 minutes per quarter in seconds
    const touchdownLine = 100;

    const gameBoard = document.getElementById("game-board");
    //---------Message Lists ------------
    const fieldGoalMessages = [
    "You attempted a field goal... and it’s GOOD!",
    "Nice kick! Three points on the board!",
    "Field goal success! The kicker saves the day.",
    "Straight through the uprights! That’s 3 points!",
    "Good kick! You’re inching closer to victory.",
    ];


    // ----- HELPER FUNCTIONS -----
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    function formatYardLine(yardLine) {
        if (yardLine === 50) {
            return "Midfield (50-yard line)";
        } else if (yardLine < 50) {
            return `Your ${yardLine}-yard line`;
        } else {
            return `CPU's ${100 - yardLine}-yard line`;
        }
    }
    function disableButtonsExceptReset() {
        const buttons = document.querySelectorAll("#game-controls button");
        buttons.forEach((button) => {
            if (button.textContent !== "Reset") {
            button.disabled = true; // Disable all buttons except Reset
            }
        });
    
    }

    function enableButtonsExceptReset() {
        const buttons = document.querySelectorAll("#game-controls button");
        buttons.forEach((button) => {
            if (button.textContent !== "Reset") {
            button.disabled = false; // Disable all buttons except Reset
            }
        });
    }
    function resetGame() {
        score = 0;
        cpuScore = 0;
        yardLine = 20;
        yardsToFirstDown = 10;
        down = 1;
        quarter = 1;
        timeRemaining = QUARTER_LENGTH;
        enableButtonsExceptReset();
        renderGameBoard("Welcome to RETRO FOOTBALL GAME!\nMake your plays to outscore the CPU!");
    }
    function getRandomMessage(messages) {
        const index = Math.floor(Math.random() * messages.length);
        return messages[index];
    }

    function handleMissedFieldGoal() {
        const message = getRandomMessage(missedFieldGoalMessages);
        const cpuMessage = cpuDrive();
        renderGameBoard(`${message}\n${cpuMessage}`);
        resetDrive();
    }
    function updateGameTime() {
      const timeUsed = Math.floor(Math.random() * 26) + 15; // 15-40 seconds
      timeRemaining -= timeUsed;
      
      if (timeRemaining <= 0) {
        if (quarter >= 4) {
          timeRemaining = 0;
          renderGameBoard("The game is over!\n" + `Final Score: Player ${score} - ${opponent} ${cpuScore}`);
          disableButtonsExceptReset();
          return false; // Game over
        } else {
          quarter++;
          timeRemaining = QUARTER_LENGTH;
          renderGameBoard(`End of Quarter ${quarter - 1}.\nStarting Quarter ${quarter}!`);
        }
      }
      return true; // Game continues
    }

    function resetDrive() {
      yardLine = 20;
      yardsToFirstDown = 10;
      down = 1;
    }

    function cpuDrive() {
      const cpuPlay = Math.floor(Math.random() * 100);

      if (cpuPlay < 25) {
        cpuScore += 7;
        updateGameTime();
        return `The ${opponent} scored a touchdown!`;
      } else if (cpuPlay < 50) {
        cpuScore += 3;
        updateGameTime();
        return `The ${opponent} kicked a field goal.`;
      } else {
        updateGameTime();
        return `The ${opponent} failed to score on their drive.`;
      }
    }

    function attemptFieldGoal() {
      const distance = 100 - yardLine + 17;
      const successChance = Math.max(2, 90- distance + Math.floor(Math.random() * 10));
      if (Math.random() * 100 < successChance) {
        score += 3;
        return `You attempted a ${distance} yard field goal with success chance ${successChance} ...\n${getRandomMessage(fieldGoalMessages)}`;
      } else {
        return `You attempted a ${distance} yard field with success chance ${successChance}...\nThe kick is NO GOOD!`;
        //handleMissedFieldGoal();
      }
    }

    function renderGameBoard(message) {
      const boardContent = `
====================================
          ${title}         
====================================
Score: Player ${score} - ${opponent} ${cpuScore}
Field Position: ${formatYardLine(yardLine)}-yard line
Down: ${down} | Yards to First Down: ${yardsToFirstDown} 
Quarter: ${quarter} | Time Remaining: ${formatTime(timeRemaining)}
====================================
${message || "Choose your next play below."}
`;
      gameBoard.textContent = boardContent;
    }

    function turnoverCheck(playType) {
        const turnoverChance = Math.random() * 100; // Random chance from 0 to 100

        if (playType === "run") {
            if (turnoverChance < 3) {
             return `Fumble! The ${opponent} recovers the ball.`;
           
            }
        } else if (playType === "pass") {
            if (turnoverChance < 5) {
             return `Intercepted! The ${opponent} picked off the pass.`;
             
            }
        } else if (playType === "razzle_dazzle") {
            if (turnoverChance < 55) { // 70% chance of turnover
            return `More Razzle than Dazzle! The ${opponent} recover the ball.`;
            
            }
        }

  // No turnover
  return null;
}
function getWeightedYards(yardOptions, weights) {
  const cumulativeWeights = [];
  let totalWeight = 0;

  // Calculate cumulative weights
  for (let weight of weights) {
    totalWeight += weight;
    cumulativeWeights.push(totalWeight);
  }

  // Generate a random number between 0 and the total weight
  const random = Math.random() * totalWeight;

  // Find the corresponding yardage
  for (let i = 0; i < cumulativeWeights.length; i++) {
    if (random < cumulativeWeights[i]) {
      return yardOptions[i];
    }
  }
}

function handlePassPlay() {
  // Possible yard outcomes and their weights
  const yardOptions = [-5, 0, 5, 10, 15, 20, 25]; // Possible yard outcomes
  const weights = [3, 12, 20, 25, 25, 15, 5]; // Weights for each outcome

  // Use the weighted selection function to determine yards gained or lost
  const yardsGained = getWeightedYards(yardOptions, weights);

  // Update game state
  yardLine += yardsGained;
  yardsToFirstDown -= yardsGained;

  // Return a message describing the outcome
  return yardsGained >= 0
    ? `You attempted a pass and gained ${yardsGained} yards.`
    : `You attempted a pass but lost ${Math.abs(yardsGained)} yards.`;
}

function handleRazzleDazzlePlay() {
  const yardOptions = [-10, -5, 90,100]; // Possible yard outcomes
  const weights = [12, 15, 20, 25]; // Higher weights for extreme gains

  const yardsGained = getWeightedYards(yardOptions, weights);

  yardLine += yardsGained;
  yardsToFirstDown -= yardsGained;

  return yardsGained >= 0
    ? `You attempted the Razzle Dazzle and gained ${yardsGained} yards!`
    : `You put the Dazzle before the Razzle and lost ${Math.abs(yardsGained)} yards!`;
}

function handleRunPlay() {
  const yardOptions = [0,1,2,3,4,5,6,7,8,9,10]; // Possible yard outcomes
  const weights = [1,9,25,25,15,3,3,3,3,2,1]; // Likelihood of each outcome

  const yardsGained = getWeightedYards(yardOptions, weights);

  yardLine += yardsGained;
  yardsToFirstDown -= yardsGained;

  return `You chose to run and ${yardsGained >= 0 ? "gained" : "lost"} ${Math.abs(yardsGained)} yards.`;
}

function handlePlay(play) {
  const playType = play === 1 ? "run" 
                   : play === 2 ? "pass" 
                   : play === 3 ? "field goal" 
                   : "razzle_dazzle";

  // Check for turnover
  const turnoverMessage = turnoverCheck(playType);

  if (turnoverMessage) {
    // Turnover occurred
    const cpuMessage = cpuDrive();
    renderGameBoard(`${turnoverMessage}\n${cpuMessage}`);
    
    resetDrive(); // Reset the drive and hand possession to the CPU
    return;
  }

  let message = "";

  if (playType === "run") {
    //const yardsGained = Math.floor(Math.random() * 10) ; // 0 to 10 yards
    //yardLine += yardsGained;
    //yardsToFirstDown -= yardsGained;
   // message = `You chose to run and gained ${yardsGained} yards.`;
    message = handleRunPlay()
  } else if (playType === "pass") {
    //const yardsGained = Math.floor(Math.random() * 26) - 5; // -5 to 20 yards
   /// yardLine += yardsGained;
   // yardsToFirstDown -= yardsGained;
   // message = yardsGained < 0 
      //        ? `You attempted a pass but lost ${-yardsGained} yards.` 
      //        : `You chose to pass and gained ${yardsGained} yards.`;
      message = handlePassPlay();
  } else if (playType === "field goal") {
    //const fieldGoalMessage = attemptFieldGoal();
    //const cpuMessage = cpuDrive();
    //renderGameBoard(`${fieldGoalMessage}\n${cpu_message}`);
    //resetDrive();
    //return;
    const fieldGoalMessage = attemptFieldGoal();
    const cpuMessage = cpuDrive();
    renderGameBoard(`${fieldGoalMessage}\n${cpuMessage}`);
    resetDrive(); // Reset the drive regardless of success or failure
    return; // End handling for this play
  } else if (playType === "razzle_dazzle") {
    //const yardsGained = Math.floor(Math.random() * 11) + 90; // 90 to 100 yards
   // yardLine += yardsGained;
    //yardsToFirstDown -= yardsGained;
    //message = `You attempted the Razzle Dazzle and gained ${yardsGained} yards!`;
    message = handleRazzleDazzlePlay();
  }

  // Check if a touchdown or first down occurred
  if (yardLine >= touchdownLine) {
    score += 7;
    const cpuMessage = cpuDrive();
    message += `\nTOUCHDOWN! You scored 7 points!\n ${cpuMessage}`;
    resetDrive();
  } else if (yardsToFirstDown <= 0) {
    down = 1;
    yardsToFirstDown = 10;
    message += "\nFirst down! You get a new set of downs.";
  } else {
    down++;
    if (down > maxDowns) {
      const cpuMessage = cpuDrive();
      message += `\nAnother drive bites the dust!\nThe ${opponent} are already planning their victory dance.\n${cpuMessage}`;
      resetDrive();
    }
  }

  // Update the game board with the result of the play

  renderGameBoard(message);
  updateGameTime();
}
    function choosePlay(play) {
        if (play === 5) {
            // Reset game state for a new game
            resetGame();
            return;
        }
        handlePlay(play);
    }

    // ----- INITIALIZE GAME -----
    renderGameBoard(`Welcome to ${title}!\nMake your plays to outscore the ${opponent}`);
