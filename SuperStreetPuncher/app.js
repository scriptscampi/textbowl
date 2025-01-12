let gameData = {};
let player = {};
let currentOpponent = null;

// Load the YAML configuration file
async function loadConfig() {
  const response = await fetch('game-config.yaml');
  const yamlText = await response.text();
  const yaml = window.jsyaml; // If using js-yaml via a <script> tag
  gameData = yaml.load(yamlText);

  console.log('Game Data Loaded:', gameData); // Debug log for loaded data
  initGame();
}

// Initialize the game
function initGame() {
  player = { name: gameData.player.name,...gameData.player.attributes };
  showMainMenu();
}

// Update player and opponent stats on the UI
function updateStats(opponent = null) {
  document.getElementById('player-hp').textContent = player.hp;
  document.getElementById('player-fitness').textContent = player.fitness;
  document.getElementById('player-recovery').textContent = player.recovery;
  document.getElementById('player-xp').textContent = player.xp;

  if (opponent) {
    document.getElementById('opponent-stats').innerHTML = `
      <p><strong>${opponent.name}</strong></p>
      <p>HP: <span>${opponent.hp}</span></p>
    `;
  }
}

// Helper function to get messages from YAML and interpolate placeholders
function getMessage(key, params = {}) {
  const template = gameData.messages[key] || ""; // Get message template from YAML
  return template.replace(/\{(\w+)\}/g, (_, k) => params[k] || ""); // Replace placeholders
}

// Render the main menu
function showMainMenu() {
  currentOpponent = null;
  const menuOptions = [
    { name: 'Hit the Streets', action: chooseLocation },
    { name: 'Workout', action: workout },
    { name: 'Veg', action: veg }
  ];
  renderMenu(menuOptions, getMessage('main_menu'));
}

// Render a menu with options
function renderMenu(options, message, showOpponentStats = false) {
  const messageBox = document.getElementById('message-box');
  const menuOptionsDiv = document.getElementById('menu-options');
  const opponentStatsDiv = document.getElementById('opponent-stats');

  messageBox.textContent = message;
  menuOptionsDiv.innerHTML = '';
  opponentStatsDiv.style.display = showOpponentStats ? 'block' : 'none';

  options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option.name;
    button.addEventListener('click', option.action);
    menuOptionsDiv.appendChild(button);
  });

  updateStats(currentOpponent);
}

// Let the player choose a location
function chooseLocation() {
  const locationOptions = gameData.locations.map(location => ({
    name: location.name,
    action: () => exploreLocation(location)
  }));

  renderMenu(locationOptions, 'Choose your destination:');
}

// Handle location exploration
function exploreLocation(location) {
  const encounterType = Math.random() < 0.75 ? 'opponent' : 'nothing';

  if (encounterType === 'opponent') {
    const opponent = gameData.opponents[Math.floor(Math.random() * gameData.opponents.length)];
    startCombat(opponent, location.name);
  } else {
    renderMenu([{ name: 'Back to Menu', action: showMainMenu }],
      getMessage('explore_nothing', { location_description: location.description }));
  }
}

// Start a combat encounter
function startCombat(opponent, locationName) {
  currentOpponent = { ...opponent };
  renderMenu([
    { name: 'Punch', action: () => playerAttack('Punch') },
    { name: 'Kick', action: () => playerAttack('Kick') },
    { name: 'Ultimate Punch', action: () => playerAttack('Ultimate Punch') },
    { name: 'Flee', action: fleeCombat }
  ], getMessage('encounter_opponent', { opponent: opponent.name, location: locationName }), true);
}
// Calculate the outcome of an attack based on player stats, opponent stats, and attack weights
function calculateAttackOutcome(attacker, defender, move) {
    const { base_damage, success_rate, risk_factor } = move;
  
    // Calculate success probability
    const successProbability = success_rate
      + (attacker.fitness * 0.2)
      + (attacker.xp * 0.05)
      - (risk_factor * 5)
      - (attacker.recovery < 20 ? 10 : 0); // Penalize if recovery is low
  
    // Determine if the attack hits
    const isSuccessful = Math.random() * 100 < successProbability;
  
    if (isSuccessful) {
      // Calculate base damage with randomness and fitness scaling
      const randomness = 1 + (Math.random() * 0.2 - 0.1); // ±10%
      const damage = Math.round(base_damage * (1 + attacker.fitness / 100) * randomness);
  
      // Apply damage to the defender
      defender.hp -= damage;
      return { success: true, damage, message: `${attacker.name} used ${move.name} and dealt ${damage} damage!` };
    }
  
    // Attack missed
    return { success: false, damage: 0, message: `${attacker.name} used ${move.name} but it missed!` };
  }
// Handle player attack
function playerAttack(moveName) {
    const move = gameData.actions.combat_moves.find(m => m.name === moveName);
    const result = calculateAttackOutcome(player, currentOpponent, move);
  
    let message = result.message;
  
    if (result.success) {
      if (currentOpponent.hp <= 0) {
        playerWinsCombat(message);
        return;
      }
    }
  
    opponentAttack(message); // Continue combat
  }

// Handle opponent attack
function opponentAttack(previousMessage) {
    const move = gameData.actions.combat_moves[Math.floor(Math.random() * gameData.actions.combat_moves.length)];
    const result = calculateAttackOutcome(currentOpponent, player, move);
  
    let message = `${previousMessage} ${result.message}`;
  
    if (result.success && player.hp <= 0) {
      playerLosesCombat(message);
      return;
    }
  
    // Continue combat
    renderMenu([
      { name: 'Punch', action: () => playerAttack('Punch') },
      { name: 'Kick', action: () => playerAttack('Kick') },
      { name: 'Ultimate Punch', action: () => playerAttack('Ultimate Punch') },
      { name: 'Flee', action: fleeCombat }
    ], message, true);
  }
// Handle flee option
function fleeCombat() {
  const takeDamage = Math.random() < 0.25;
  let message = getMessage('flee_safe');

  if (takeDamage) {
    const damage = Math.floor(Math.random() * 10) + 5;
    player.hp -= damage;
    message = getMessage('flee_damage', { damage });
  }

  if (player.hp <= 0) {
    playerLosesCombat(message);
  } else {
    renderMenu([{ name: 'Back to Menu', action: showMainMenu }], message);
  }
}

// Handle player win
function playerWinsCombat(message) {
  player.xp += currentOpponent.xp;
  renderMenu([{ name: 'Back to Menu', action: showMainMenu }],
    getMessage('combat_win', { message, opponent_name: currentOpponent.name, xp: currentOpponent.xp }));
}

// Handle player loss
function playerLosesCombat(message) {
  renderMenu([{ name: 'Try Again', action: initGame }],
    getMessage('combat_loss', { message, opponent_name: currentOpponent.name }));
}

// Handle workout activities
function workout() {
  if (!gameData.actions || !gameData.actions.workout_options) {
    renderMenu([{ name: 'Back to Menu', action: showMainMenu }], getMessage('no_workout_options'));
    return;
  }

  const options = gameData.actions.workout_options.map(option => ({
    name: option.name,
    action: () => {
      player.fitness += option.fitness_gain;
      player.recovery -= option.recovery_cost;
      if (player.recovery < 0) player.recovery = 0;

      renderMenu([{ name: 'Back to Menu', action: showMainMenu }],
        getMessage('workout_feedback', {
          name: option.name,
          fitness_gain: option.fitness_gain,
          recovery_cost: option.recovery_cost
        }));
    }
  }));

  renderMenu(options, getMessage('workout_intro'));
}

// Handle veg activities
function veg() {
  if (!gameData.actions || !gameData.actions.veg_options) {
    renderMenu([{ name: 'Back to Menu', action: showMainMenu }], getMessage('no_veg_options'));
    return;
  }

  const options = gameData.actions.veg_options.map(option => ({
    name: option.name,
    action: () => {
      player.recovery += option.recovery_gain;
      player.fitness -= option.fitness_loss;
      if (player.fitness < 0) player.fitness = 0;

      renderMenu([{ name: 'Back to Menu', action: showMainMenu }],
        getMessage('veg_feedback', {
          name: option.name,
          recovery_gain: option.recovery_gain,
          fitness_loss: option.fitness_loss
        }));
    }
  }));

  renderMenu(options, getMessage('veg_intro'));
}

// Load the game configuration/
loadConfig();