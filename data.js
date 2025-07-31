// MapleGuessr daily pools by category
const gameCategories = {
  item: [
    "Zakum Helmet",
    "Maple Claw",
    "Maple Skanda",
    "Stonetooth Sword",
    "Maple Soul Singer",
    "Green Christmas Sock",
    "Dark Scroll for Claw for ATT",
    "Scroll for Overall for DEX",
    "Scroll for Overall for INT",
    "Scroll for Cape for LUK",
    "Scroll for Earring for INT",
    "Scroll for Shield for Magic Attack",
    "Stormcaster Gloves",
    "Work Gloves",
    "Onyx Apple",
    "Heartstopper",
    "Warrior Elixir",
    "Wizard Elixir"
  ],
  npc: [
    "Grendel the Really Old",
    "Athena Pierce",
    "Dances with Balrog",
    "Dark Lord",
    "Cody",
    "Spinel",
    "Chief Tatamo",
    "Moira",
    "Maple Administrator"
  ],
  boss: [
    "Zakum",
    "Papulatus",
    "Bigfoot",
    "Anego",
    "Pianus",
    "Crimsonwood Margana",
    "Headless Horseman",
    "Ravana",
    "Scarlion",
    "Targa",
    "Mano",
    "Stumpy",
    "Faust",
    "Ephenia",
    "Chaos Zakum",
    "Chaos Papulatus"
  ]
};

// Get active category (default: 'item')
const activeCategory = localStorage.getItem("category") || "item";
const pool = gameCategories[activeCategory];

// Daily answer logic — rotate based on day
const todayIndex = new Date().getDate() % pool.length;
const answer = pool[todayIndex].toLowerCase();

window.gameCategories = gameCategories;
