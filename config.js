// ----- CONFIGURATION -----
export const CONFIG = {
  TITLE: "Text Bowl Football",
  OPPONENT: "",
  QUARTER_LENGTH: 600,
  MAX_DOWNS: 4,
  TOUCHDOWN_LINE: 100,
      TEAMS: {
      "Thunder Tacos": {
        name: "Thunder Tacos",
        run: 90,
        pass: 75,
        defense: 70,
        description: "They bring the heat... and the indigestion.",
      },
      "Flying Penguins": {
        name: "Flying Penguins",
        run: 60,
        pass: 85,
        defense: 80,
        description: "Defying gravity and expectations.",
      },
      "Brawling Bananas": {
        name: "Brawling Bananas",
        run: 80,
        pass: 70,
        defense: 85,
        description: "Slipping past defenses with shocking speed.",
      },
      "Giga Goats": {
        name: "Giga Goats",
        run: 85,
        pass: 90,
        defense: 75,
        description: "They charge through everything, including Wi-Fi signals.",
      },
      "Sloth Supremes": {
        name: "Sloth Supremes",
        run: 50,
        pass: 65,
        defense: 95,
        description: "Slow and steady... and surprisingly fiery.",
      },
      "Atomic Ants": {
        name: "Atomic Ants",
        run: 90,
        pass: 60,
        defense: 80,
        description: "Small but mighty. They'll leave you in the dirt.",
      },
    },

  // Injury settings
  INJURIES: [
    "dysentary",
    "cholera",
    "suffered a sprained ankle",
    "suffered a torn ACL",
    "suffered a concussion",
    "suffered a broken wrist",
    "suffered a pulled hamstring",
  ],
  POSITIONS: {
    run: "running back",
    pass: "receiver",
    "field goal": "kicker",
    razzle_dazzle: "receiver",
  },

  
  // Penalties
    PENALTIES: [
      {
        name: "Offside",
        yards: 5,
        lossofdown: false,
        affects: ["defense"],
        playtype: "all",
        automaticFirstDown: false,
        messages: [
          "Offside! Someone forgot to count to 'hike'.",
          "Offside! The defense was a bit too eager.",
          "Offside! Maybe they just wanted to say hello early?",
        ],
      },
      {
        name: "Holding",
        yards: 10,
        lossofdown: false,
        affects: ["offense"],
        playtype: "run",
        automaticFirstDown: false,
        messages: [
          "Holding! Your player just couldn't let go.",
          "Holding! Let go of the jersey, buddy.",
          "Holding! Did you think no one would notice?",
        ],
      },
      {
        name: "False Start",
        yards: 5,
        lossofdown: false,
        affects: ["offense"],
        playtype: "all",
        automaticFirstDown: false,
        messages: [
          "False Start! Someone jumped the gun.",
          "False Start! We weren't ready yet.",
          "False Start! The line didn't get the memo.",
        ],
      },
      {
        name: "Pass Interference",
        yards: 15,
        lossofdown: false,
        affects: ["defense"],
        playtype: "pass",
        automaticFirstDown: true,
        messages: [
          "Pass Interference! You can submit the replay as your wresling audition.",
          "Pass Interference! You can't just tackle them mid-air.",
          "Pass Interference! Next time, try not to grab their arms.",
        ],
      },
      {
        name: "Personal Foul",
        yards: 15,
        lossofdown: false,
        affects: ["offense", "defense"],
        playtype: "all",
        automaticFirstDown: true,
        messages: [
          "Personal Foul! That's just not nice.",
          "Personal Foul! Keep your temper in check.",
          "Personal Foul! Someone's feeling feisty.",
        ],
      },
      {
        name: "Illegal Formation",
        yards: 5,
        lossofdown: true,
        affects: ["offense"],
        playtype: "all",
        automaticFirstDown: false,
        messages: [
          "Illegal Formation! How many players do you need?",
          "Illegal Formation! That’s not how you line up.",
          "Illegal Formation! Check your playbook next time.",
        ],
      },
    ],
  
  

  FIELD_GOAL_MESSAGES: [
    "Split the uprights like a laser-guided baguette. Bon appétit, scoreboard!",
    "That ball had more hang time than your uncle's favorite fishing story. Three points, nailed!",
    "Kick so clean it practically did its taxes on the way through.",
    "Somebody call NASA, because that kick was out of this world—and right down the middle.",
    "The ball’s got a better sense of direction than your GPS. Straight through for the win!"
    
  ],
  MISSED_FIELD_GOAL_MESSAGES: [
    "That doink echoed louder than your excuses for not going for it on fourth down. That's a Miss!",  
    "Missed it by *that* much. Maybe next time, try punting for style points?",  
    "Doink! The sound of regret hitting harder than the uprights.No Good",  
    "Kicking a field goal when you could've gone for it? That miss was the football gods calling you out.",  
    "Nothing says 'we played it safe' quite like a missed field goal. Fortune favors the bold, not the kickers."
  ],
  FIRST_DOWN_MESSAGES: [
    "Moving the chains like a boss. Somebody’s got places to be!",  
    "Another first down! Looks like the defense is doing its best mannequin challenge.",
    "That’s one small step for the offense, one giant leap for field position.",  
    "First down! The defense is just out here getting cardio at this point.",  
    "Advancing the plot one yardstick at a time. Stay tuned!"
  ],
  TURNOVER_ON_DOWNS_MESSAGES: [
    "Turnover on downs! Because punting is so overrated, right?",  
    "Well, that was a creative way to hand the ball over. Bravo!",  
    "Who needs a punter when you can gift-wrap the ball for the other team?",  
    "Four tries, zero progress. At least you’re consistent!",  
    "Turnover on downs! Looks like the offensive strategy is 'make it interesting.'"
  ],
  FUMBLE_MESSAGES: [
    "Nice hands, butterfingers. Are you auditioning for a juggling act? The CPU recovers the ball.",
    "Fumble? Just making sure the ground gets a little action too, huh? The CPU takes possession.",
    "Where you playing the ball was lava? The CPU recovers the fumble.",
    "Fumble! I've seen clowns that juggle less than that!The CPU gets the ball.",
  ],
  INTERCEPTION_MESSAGES: [
    "Intercepted! The ol’ ‘surprise gift’ to the defense. The CPU picked off your pass.",
    "Nice pass! Too bad it was to the wrong jersey. CPU possession.",
    "Was the ball homesick? The CPU intercepts the ball.",
    "That’s an interception! CPU takes over.",
  ],
  PLAYER_TOUCHDOWN_MESSAGES: [
    "TOUCHDOWN! You made the CPU look like it was in demo mode.",
    "You made it to the end zone! TOUCHDOWN!",
    "Great drive! TOUCHDOWN and 7 points!",
    "You’re unstoppable! TOUCHDOWN scored!",
  ],
  CPU_TOUCHDOWN_MESSAGES: [
    "CPU Touchdown! Your defense just got friend-zoned by the end zone.",
    "CPU Touchdown! The machine uprising starts with your scoreboard.",
    "Touchdown! The CPU’s just flexing its digital dominance.",
    "Touchdown CPU! They’re gaining ground.",
    "Unstoppable CPU drive! Touchdown scored.",
  ],
  FAILED_RAZZLEDAZLE_MESSAGES: [
    "More Razzle than Dazzle, CPU recovers the ball!",
    "The Bold and the not so Beautiful! CPU thanks you for your donation.",
    "The CPU Dazzles with its Razzle as it takes the ball.",
    "You Razzled when you should have Dazzled. CPU recovers."
  ]
};