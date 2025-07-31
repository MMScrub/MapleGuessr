// MapleGuessr daily pool
const gameData = [
  { name: "Zakum Helmet", type: "item" },
  { name: "Papulatus", type: "boss" },
  { name: "Grendel the Really Old", type: "npc" },
  { name: "Stormcaster Gloves", type: "item" },
  { name: "Anego", type: "boss" },
  { name: "Athena Pierce", type: "npc" },
  { name: "Heartstopper", type: "item" },
  { name: "Bigfoot", type: "boss" },
  { name: "Cody", type: "npc" },
  { name: "Onyx Apple", type: "item" }
];

// Daily answer logic — rotate based on day
const todayIndex = new Date().getDate() % gameData.length;
const answer = gameData[todayIndex].name.toLowerCase();
