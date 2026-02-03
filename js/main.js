/* ================= Config ================= */
const CONFIG = {
  LEVEL_CLOSE_GAP: 20,
  MAX_SUGGESTIONS: 8,
  HINT_STAGES: [3, 5, 7, 9]  // misses before next hint (stage 1 at 3, stage 2 at 5, etc.)
};

/* ================= Load data from data/pool.json ================= */
async function loadPoolData() {
  try {
    const res = await fetch('data/pool.json');
    if (!res.ok) throw new Error('Missing data/pool.json');
    return res.json();
  } catch (e) {
    if (window.__POOL_EMBED__) return window.__POOL_EMBED__;
    console.error('Could not load data/pool.json. Open via a local server (e.g. Live Server) or use embedded pool.', e);
    throw e;
  }
}

/* ================= Dev Buttons ================= */
document.getElementById("reset-btn").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});
document.getElementById("random-btn").addEventListener("click", () => {
  const idx = Math.floor(Math.random() * (window.__POOL__?.length || 1));
  localStorage.setItem("dev_force_index", String(idx));
  localStorage.setItem("guesses_items", JSON.stringify({ date: new Date().toDateString(), guesses: [] }));
  location.reload();
});
document.getElementById("daily-btn").addEventListener("click", () => {
  localStorage.removeItem("dev_force_index");
  localStorage.setItem("guesses_items", JSON.stringify({ date: new Date().toDateString(), guesses: [] }));
  location.reload();
});
document.getElementById("next-btn").addEventListener("click", () => {
  const len = window.__POOL__?.length || 1;
  const current = parseInt(localStorage.getItem("dev_force_index") ?? "-1", 10);
  const next = isNaN(current) ? 0 : (current + 1) % len;
  localStorage.setItem("dev_force_index", String(next));
  localStorage.setItem("guesses_items", JSON.stringify({ date: new Date().toDateString(), guesses: [] }));
  location.reload();
});
document.getElementById("reveal-btn").addEventListener("click", () => {
  const ans = window.__ANSWER__;
  document.getElementById("reveal").textContent = `Answer (Dev): ${ans?.name || '—'}`;
});
  
  /* ================= WIP  ================= */  
function normalizeClasses(it) {
  const arr = Array.isArray(it?.classes) ? it.classes : [];
  return [...new Set(arr.map(s => String(s).trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

function classesToText(arr) {
  return arr.length ? arr.join(", ") : "—";
}

function sameClasses(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/* ================= Broad Grouping + Hint Stage ================= */

function broadGroupFromClassType(classType) {
  const c = (classType || "").toLowerCase();

  const weapons = new Set([
    "bow","claw","dagger","gun","knuckle","mace","crossbow",
    "one-handed sword","one-handed axe","one-handed mace",
    "two-handed sword","two-handed axe","two-handed mace",
    "polearm","spear","staff","wand"
  ]);
  if (weapons.has(c)) return "Weapon";

  const armor = new Set(["hat","top","bottom","overall","cape","gloves","shoes","shield","helmet"]);
  if (armor.has(c)) return "Armor";

  const acc = new Set(["earrings","eye accessory","face accessory","pendant"]);
  if (acc.has(c)) return "Accessory";

  return "Equip";
}

function hintStageFromMisses(misses) {
  const stages = CONFIG.HINT_STAGES;
  for (let i = 0; i < stages.length; i++) {
    if (misses < stages[i]) return i;
  }
  return stages.length;
}

/* ================= Menu + How-to ================= */
document.getElementById("play-items").addEventListener("click", async () => {
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";

  const pool = await loadPoolData();
  window.__POOL__ = pool;

  startGame(pool);
});

document.getElementById("title").addEventListener("click", () => {
  document.getElementById("menu").style.display = "flex";
  document.getElementById("game").style.display = "none";
});

document.getElementById("howto-toggle").addEventListener("click", () => {
  const content = document.getElementById("howto-content");
  const toggle = document.getElementById("howto-toggle");
  if (content.style.display === "block") { content.style.display = "none"; toggle.textContent = "How to Play +"; }
  else { content.style.display = "block"; toggle.textContent = "How to Play –"; }
});

/* ================= Answer selection ================= */
function isRandomMode() {
  return localStorage.getItem("dev_force_index") !== null;
}

/* ================= Helpers: badges, names, ranges ================= */
  
function getDropType(src) {
  const s = (src || "").toLowerCase().trim();
  if (!s) return "mob";

  if (s.includes("gach")) return "gachapon";
  if (s.includes("pq")) return "pq";
  if (s.includes("quest")) return "quest";

  // NPC shop purchases as Store (exclude cash/nx)
  if (s.includes("store") || (s.includes("shop") && !s.includes("cash") && !s.includes("nx"))) {
    return "store";
  }

  return "mob"; // default mob/boss
}

function formatSourceWithBadge(src) {
  const t = getDropType(src);
  const map = {
    pq:       { cls: "pq",    label: "[PQ]" },
    gachapon: { cls: "gach",  label: "[Gachapon]" },
    quest:    { cls: "quest", label: "[Quest]" },
    store:    { cls: "store", label: "[Store]" },
    mob:      { cls: "mob",   label: "[Mob]" }
  };
  const entry = map[t] || map.mob;
  return `<span class="badge ${entry.cls}">${entry.label}</span>${src || ""}`;
}
  
function highlightName(guessName, answerName) {
  const g = guessName.split(/\s+/).map(s => s.toLowerCase());
  const aSet = new Set(answerName.split(/\s+/).map(s => s.toLowerCase()));
  return guessName.split(/\s+/).map(w => aSet.has(w.toLowerCase()) ? `<b>${w}</b>` : w).join(' ');
}

/* Range helpers */
function bothNull(aMin, aMax, bMin, bMax) {
  return aMin == null && aMax == null && bMin == null && bMax == null;
}
function anyNull(aMin, aMax, bMin, bMax) {
  const aNull = (aMin == null || aMax == null);
  const bNull = (bMin == null || bMax == null);
  return aNull || bNull;
}
function rangesOverlap(gMin, gMax, aMin, aMax) {
  return !(gMax < aMin || aMax < gMin);
}
function rangeGap(gMin, gMax, aMin, aMax) {
  if (rangesOverlap(gMin, gMax, aMin, aMax)) return 0;
  if (gMax < aMin) return aMin - gMax;   // guess below answer
  return gMin - aMax;                     // guess above answer
}
// Color logic: green = overlap; yellow = gap ≤ CONFIG.LEVEL_CLOSE_GAP; red = far/no data
function levelColor(gMin, gMax, aMin, aMax) {
  if (bothNull(gMin, gMax, aMin, aMax)) return 'green';
  if (anyNull(gMin, gMax, aMin, aMax))  return 'red';
  if (rangesOverlap(gMin, gMax, aMin, aMax)) return 'green';
  return rangeGap(gMin, gMax, aMin, aMax) <= CONFIG.LEVEL_CLOSE_GAP ? 'yellow' : 'red';
}
// Display: "—" for non-equipables; "min–max" or single; add ✓ / ↑ / ↓
function levelDisplay(gMin, gMax, aMin, aMax) {
  if (gMin == null || gMax == null) return "—";
  const text = (gMin === gMax) ? `${gMax}` : `${gMin}–${gMax}`;
  if (aMin == null || aMax == null) return text; // answer not equipable
  if (rangesOverlap(gMin, gMax, aMin, aMax)) return `${text} ✓`;
  if (gMax < aMin) return `${text} ↑`; // need higher
  if (gMin > aMax) return `${text} ↓`; // need lower
  return text;
}

/* ================= Game Logic ================= */
/* ================= Pool filtering + Daily selection ================= */

// Allow-list of equip categories (no chairs, no scrolls, no consumables, no stars, no nx)
const EQUIP_CATEGORIES = new Set([
  // Armor / accessories
  "Hat", "Helmet", "Top", "Bottom", "Overall",
  "Cape", "Gloves", "Shoes",
  "Shield",
  "Earrings", "Eye Accessory", "Face Accessory",
  "Pendant",

  // Weapons
  "Bow", "Claw", "Dagger", "Gun", "Knuckle", "Mace", "CrossBow",
  "One-Handed Sword", "One-Handed Axe", "One-Handed Mace",
  "Two-Handed Sword", "Two-Handed Axe", "Two-Handed Mace",
  "Polearm", "Spear",
  "Staff", "Wand"
]);

function isNxLike(item) {
  const name = (item.name || "").toLowerCase();
  const src  = (item.droppedBy || "").toLowerCase();
  return (
    name.includes("nx") || name.includes("cash") ||
    src.includes("nx") || src.includes("cash") || src.includes("cash shop")
  );
}

function getPlayablePool(pool) {
  return (pool || []).filter(it => {
    const cat = it.classType;

    // only allowed equip categories
    if (!EQUIP_CATEGORIES.has(cat)) return false;

    // explicitly block throwing stars if they ever appear
    if ((cat || "").toLowerCase() === "throwing star") return false;

    // block NX/cash shop items
    if (isNxLike(it)) return false;

    return true;
  });
}

function getLocalDateKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // stable per local day
}

function hashStrToInt(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
  return (h >>> 0);
}

function getDailyCategory(playablePool) {
  const counts = new Map();
  playablePool.forEach(it => counts.set(it.classType, (counts.get(it.classType) || 0) + 1));

  // avoid tiny categories
  const categories = [...counts.entries()]
    .filter(([_, n]) => n >= 4)
    .map(([c]) => c)
    .sort();

  const key = getLocalDateKey();
  const idx = hashStrToInt("cat|" + key) % categories.length;
  return categories[idx];
}

function getDailyAnswerFromCategory(categoryPool) {
  const key = getLocalDateKey();
  const idx = hashStrToInt("ans|" + key + "|" + categoryPool.length) % categoryPool.length;
  return categoryPool[idx];
}
  
function startGame(pool) {
  const modeEl = document.getElementById("mode");
  modeEl.innerHTML = isRandomMode()
    ? `Mode: <span class="random">Random (Dev)</span>`
    : `Mode: <span class="daily">Daily</span>`;

  const playablePool = getPlayablePool(pool);

  // Safety: if your allow-list filtered everything out, show a helpful message
  if (!playablePool.length) {
    document.getElementById("result").textContent =
      "No playable items found. Check classType names vs EQUIP_CATEGORIES.";
    return;
  }

  let dailyCategory;
  let categoryPool;
  let answer;

  if (isRandomMode()) {
    // Dev forced index picks a specific item from the playable pool
    const forced = parseInt(localStorage.getItem("dev_force_index") ?? "0", 10);
    const idx = Math.max(0, Math.min(playablePool.length - 1, isNaN(forced) ? 0 : forced));
    answer = playablePool[idx];

    dailyCategory = answer.classType;
    categoryPool = playablePool.filter(i => i.classType === dailyCategory);
  } else {
    dailyCategory = getDailyCategory(playablePool);
    categoryPool = playablePool.filter(i => i.classType === dailyCategory);

    // Safety: if the chosen category ended up empty for any reason, fallback
    if (!categoryPool.length) categoryPool = playablePool;

    answer = getDailyAnswerFromCategory(categoryPool);
  }

  // expose for dev tools
  window.__ANSWER__ = answer;
  window.__CATEGORY__ = dailyCategory;

  const categoryEl = document.getElementById("category");

  const today = new Date().toDateString();

  let guessesData = JSON.parse(localStorage.getItem("guesses_items")) || {
    date: today,
    category: dailyCategory,
    guesses: []
  };

  if ((!isRandomMode()) && (guessesData.date !== today || guessesData.category !== dailyCategory)) {
    guessesData = { date: today, category: dailyCategory, guesses: [] };
    localStorage.setItem("guesses_items", JSON.stringify(guessesData));
  }

  const guessInput = document.getElementById("guess-input");
  const submitBtn = document.getElementById("submit-btn");
  const tableBody = document.querySelector("#guess-table tbody");
  const result = document.getElementById("result");
  const suggestionBox = document.getElementById("suggestions");
  const counterEl = document.getElementById("guess-counter");

  tableBody.innerHTML = "";
  updateCounter();
  guessInput.focus();

  /* ================= Hints and Search Scope ================= */
  function updateHintsAndSearchScope() {
    const misses = (guessesData.guesses || []).length;
    const stage = hintStageFromMisses(misses);

    if (categoryEl) {
      if (stage === 0) categoryEl.textContent = "Hint: ???";
      else if (stage === 1) categoryEl.textContent = `Hint: ${broadGroupFromClassType(dailyCategory)}`;
      else categoryEl.textContent = `Hint: ${dailyCategory}`;
    }

    if (stage === 0) {
      window.__SUGGEST_POOL__ = playablePool;
    } else if (stage === 1) {
      const group = broadGroupFromClassType(dailyCategory);
      window.__SUGGEST_POOL__ = playablePool.filter(it => broadGroupFromClassType(it.classType) === group);
    } else {
      window.__SUGGEST_POOL__ = categoryPool;
    }
  }

  // render prior guesses
  (guessesData.guesses || []).forEach(g => addGuessToTable(g));
  updateHintsAndSearchScope();

  function updateCounter() {
    counterEl.textContent = `Guess #${(guessesData.guesses?.length || 0) + 1}`;
  }

  function addGuessToTable(item) {
  const row = document.createElement("tr");
  if (item.name === answer.name) row.classList.add("answer-row");

  const gClasses = normalizeClasses(item);
  const aClasses = normalizeClasses(answer);

  row.innerHTML = `
    <td class="${item.name === answer.name ? 'green' : 'red'} name-partial">${highlightName(item.name, answer.name)}</td>
    <td class="${levelColor(item.minLevel, item.maxLevel, answer.minLevel, answer.maxLevel)}">${levelDisplay(item.minLevel, item.maxLevel, answer.minLevel, answer.maxLevel)}</td>
    <td class="${classesColor(gClasses, aClasses)}">${classesToText(gClasses)}</td>
    <td class="${item.classType === answer.classType ? 'green' : 'red'}">${item.classType}</td>
    <td class="${item.tradable === answer.tradable ? 'green' : 'red'}">${item.tradable ? 'Yes' : 'No'}</td>
    <td class="${dropColor(item.droppedBy, answer.droppedBy)}">${formatSourceWithBadge(item.droppedBy)}</td>
  `;
  tableBody.appendChild(row);
}
  
function classesColor(g, a) {
  if (sameClasses(g, a)) return "green";
  const aSet = new Set(a);
  const overlap = g.some(x => aSet.has(x));
  return overlap ? "yellow" : "red";
}
  
  function dropColor(guessDrop, answerDrop) {
    if ((guessDrop || "") === (answerDrop || "")) return 'green';
    const gType = getDropType(guessDrop);
    const aType = getDropType(answerDrop);
    if (gType === aType) return 'yellow';
    return 'red';
  }

  // Suggestions (narrowed by hint stage: __SUGGEST_POOL__ or categoryPool)
  guessInput.addEventListener("input", () => {
    const val = guessInput.value.trim().toLowerCase();
    suggestionBox.innerHTML = "";
    if (!val) return;

    const suggestPool = (window.__SUGGEST_POOL__ != null) ? window.__SUGGEST_POOL__ : categoryPool;
    const matches = suggestPool.filter(e => e.name.toLowerCase().includes(val));
    matches.slice(0, CONFIG.MAX_SUGGESTIONS).forEach(match => {
      const li = document.createElement("li");
      li.textContent = match.name;
      li.onclick = () => {
        guessInput.value = match.name;
        suggestionBox.innerHTML = "";
      };
      suggestionBox.appendChild(li);
    });
  });

  // Submit guess
  submitBtn.addEventListener("click", () => {
    const userGuess = guessInput.value.trim().toLowerCase();
    if (!userGuess) return;

    if ((guessesData.guesses || []).find(g => g.name.toLowerCase() === userGuess)) {
      alert("Already guessed that!");
      guessInput.focus();
      return;
    }

    const item = playablePool.find(i => i.name.toLowerCase() === userGuess);
    if (!item) {
      alert("Unknown item.");
      guessInput.focus();
      return;
    }

    guessesData.guesses.push(item);
    localStorage.setItem("guesses_items", JSON.stringify(guessesData));
    addGuessToTable(item);

    if (item.name.toLowerCase() === answer.name.toLowerCase()) {
      result.textContent = `🎉 Correct! You got it in ${guessesData.guesses.length} guesses.`;
      result.style.color = "#6dff6d";
    } else {
      updateHintsAndSearchScope();
      result.textContent = "Not quite, try again.";
      result.style.color = "#ff7a7a";
    }

    updateCounter();
    guessInput.value = "";
    suggestionBox.innerHTML = "";
    guessInput.focus();
  });
}
