// ----- UTILITY FUNCTIONS -----
export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  
  export function getRandomMessage(messages) {
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
  }
  
  export function getWeightedYards(yardOptions, weights) {
    const cumulativeWeights = [];
    let totalWeight = 0;
  
    for (let weight of weights) {
      totalWeight += weight;
      cumulativeWeights.push(totalWeight);
    }
  
    const random = Math.random() * totalWeight;
  
    for (let i = 0; i < cumulativeWeights.length; i++) {
      if (random < cumulativeWeights[i]) {
        return yardOptions[i];
      }
    }
  }

 export function turnoverCheck(playType) {
    const turnoverChance = Math.random() * 100;
  
    if (playType === "run" && turnoverChance < 3) {
      return "Fumble! The CPU recovers the ball.";
    } else if (playType === "pass" && turnoverChance < 5) {
      return "Intercepted! The CPU picked off your pass.";
    } else if (playType === "razzle_dazzle" && turnoverChance < 55) {
      return "More Razzle than Dazzle! The CPU recovers the ball.";
    }
  
    // No turnover
    return null;
  }