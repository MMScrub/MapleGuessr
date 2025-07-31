// MapleGuessr daily pool
const gameData = [
  // Items
  { name: "Zakum Helmet", type: "item" },
  { name: "Maple Claw", type: "item" },
  { name: "Maple Skanda", type: "item" },
  { name: "Stonetooth Sword", type: "item" },
  { name: "Maple Soul Singer", type: "item" },
  { name: "Green Christmas Sock", type: "item" },
  { name: "Dark Scroll for Claw for ATT", type: "item" },
  { name: "Scroll for Overall for DEX", type: "item" },
  { name: "Scroll for Overall for INT", type: "item" },
  { name: "Scroll for Cape for LUK", type: "item" },
  { name: "Scroll for Earring for INT", type: "item" },
  { name: "Scroll for Shield for Magic Attack", type: "item" },
  { name: "Stormcaster Gloves", type: "item" },
  { name: "Work Gloves", type: "item" },
  { name: "Onyx Apple", type: "item" },
  { name: "Heartstopper", type: "item" },
  { name: "Warrior Elixir", type: "item" },
  { name: "Wizard Elixir", type: "item" },

  // NPCs
  { name: "Grendel the Really Old", type: "npc" },
  { name: "Athena Pierce", type: "npc" },
  { name: "Dances with Balrog", type: "npc" },
  { name: "Dark Lord", type: "npc" },
  { name: "Cody", type: "npc" },
  { name: "Spinel", type: "npc" },
  { name: "Chief Tatamo", type: "npc" },
  { name: "Moira", type: "npc" },
  { name: "Maple Administrator", type: "npc" },

  // Bosses
  { name: "Zakum", type: "boss" },
  { name: "Papulatus", type: "boss" },
  { name: "Bigfoot", type: "boss" },
  { name: "Anego", type: "boss" },
  { name: "Pianus", type: "boss" },
  { name: "Crimsonwood Margana", type: "boss" },
  { name: "Headless Horseman", type: "boss" },
  { name: "Ravana", type: "boss" },
  { name: "Scarlion", type: "boss" },
  { name: "Targa", type: "boss" },
  { name: "Mano", type: "boss" },
  { name: "Stumpy", type: "boss" },
  { name: "Faust", type: "boss" },
  { name: "Ephenia", type: "boss" },
  { name: "Chaos", type: "boss" },
];

// Daily answer logic — rotate based on day
const todayIndex = new Date().getDate() % gameData.length;
const answer = gameData[todayIndex].name.toLowerCase();
