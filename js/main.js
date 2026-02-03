/* ================= Config ================= */
const CONFIG = {
  LEVEL_CLOSE_GAP: 5,
  MAX_SUGGESTIONS: 8,
  HINT_STAGES: [3, 5, 7, 9]  // misses before next hint (stage 1 at 3, stage 2 at 5, etc.)
};

const MODE_KEY = "mode";
const MODE_DAILY = "daily";
const MODE_ENDLESS = "endless";
const SETTINGS = {
  ABBREV: "setting_abbrev",
  HINTS: "setting_hints"
};
const GUESSES_KEY_DAILY = "guesses_items_daily";

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

/* ================= Settings + Mode ================= */
function getMode() {
  return localStorage.getItem(MODE_KEY) || MODE_DAILY;
}

function setMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
}

function isEndlessMode() {
  return getMode() === MODE_ENDLESS;
}

function getBoolSetting(key, defaultValue = true) {
  const raw = localStorage.getItem(key);
  if (raw == null) return defaultValue;
  return raw !== "false";
}

function setBoolSetting(key, value) {
  localStorage.setItem(key, value ? "true" : "false");
}

function isAbbrevEnabled() {
  return getBoolSetting(SETTINGS.ABBREV, true);
}

function isHintsEnabled() {
  return getBoolSetting(SETTINGS.HINTS, true);
}

function updateEndlessButton() {
  const btn = document.getElementById("endless-btn");
  const resetBtn = document.getElementById("endless-reset-btn");
  if (!btn) return;
  btn.textContent = isEndlessMode() ? "Daily Mode" : "Endless Mode";
  if (resetBtn) {
    if (isEndlessMode()) resetBtn.classList.remove("hidden");
    else resetBtn.classList.add("hidden");
  }
}

function initSettingsUI() {
  const modal = document.getElementById("settings-modal");
  const openBtn = document.getElementById("settings-btn");
  const closeBtn = document.getElementById("settings-close");
  const abbrevToggle = document.getElementById("setting-abbrev");
  const hintsToggle = document.getElementById("setting-hints");

  if (abbrevToggle) {
    abbrevToggle.checked = isAbbrevEnabled();
    abbrevToggle.addEventListener("change", () => {
      setBoolSetting(SETTINGS.ABBREV, abbrevToggle.checked);
      if (window.__REFRESH_UI__) window.__REFRESH_UI__();
    });
  }
  if (hintsToggle) {
    hintsToggle.checked = isHintsEnabled();
    hintsToggle.addEventListener("change", () => {
      setBoolSetting(SETTINGS.HINTS, hintsToggle.checked);
      if (window.__REFRESH_UI__) window.__REFRESH_UI__();
    });
  }

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
    });
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
    });
  }
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  }
}
  
  /* ================= WIP  ================= */  
function normalizeClasses(it) {
  const arr = Array.isArray(it?.classes) ? it.classes : [];
  return [...new Set(arr.map(s => String(s).trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

// Abbreviate class names for in-game display
const CLASS_ABBREV = {
  Warrior: "War", Magician: "Mag", Thief: "Thf", Bowman: "Bow", Pirate: "Pir",
  Beginner: "Beg"
};

function abbreviateClass(name) {
  const n = (name || "").trim();
  return CLASS_ABBREV[n] || n.slice(0, 3);
}

function classesToText(arr, abbreviate = false) {
  if (!arr.length) return "—";
  const list = abbreviate ? arr.map(abbreviateClass) : arr;
  return list.join(", ");
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
  if (acc.has(c)) return "Acc";

  return "Equip";
}

function hintStageFromMisses(misses) {
  const stages = CONFIG.HINT_STAGES;
  for (let i = 0; i < stages.length; i++) {
    if (misses < stages[i]) return i;
  }
  return stages.length;
}

function showMenu() {
  const menu = document.getElementById("menu");
  const game = document.getElementById("game");
  if (menu) menu.style.display = "flex";
  if (game) game.style.display = "none";
}

function showGame() {
  const menu = document.getElementById("menu");
  const game = document.getElementById("game");
  if (menu) menu.style.display = "none";
  if (game) game.style.display = "block";
}

/* ================= Menu + How-to ================= */
document.getElementById("play-items").addEventListener("click", async () => {
  showGame();
  if (!window.__POOL__) window.__POOL__ = await loadPoolData();
  startGame(window.__POOL__);
});

document.getElementById("howto-toggle").addEventListener("click", () => {
  const content = document.getElementById("howto-content");
  const toggle = document.getElementById("howto-toggle");
  if (content.style.display === "block") { content.style.display = "none"; toggle.textContent = "How to Play +"; }
  else { content.style.display = "block"; toggle.textContent = "How to Play –"; }
});

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
// Display: "min–max" or single; add ✓ / ↑ / ↓
function levelDisplay(gMin, gMax, aMin, aMax) {
  const min = (gMin == null) ? 0 : gMin;
  const max = (gMax == null) ? 0 : gMax;
  const text = (min === max) ? `${max}` : `${min}–${max}`;
  if (aMin == null || aMax == null) return text;
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
  const endless = isEndlessMode();
  modeEl.innerHTML = endless
    ? `Mode: <span class="endless">Endless</span>`
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

  if (endless) {
    const idx = Math.floor(Math.random() * playablePool.length);
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
  const persistGuesses = !endless;
  const guessesKey = persistGuesses ? GUESSES_KEY_DAILY : null;

  let guessesData = persistGuesses
    ? (JSON.parse(localStorage.getItem(guessesKey)) || { date: today, category: dailyCategory, guesses: [] })
    : { guesses: [] };

  if (persistGuesses && (guessesData.date !== today || guessesData.category !== dailyCategory)) {
    guessesData = { date: today, category: dailyCategory, guesses: [] };
    localStorage.setItem(guessesKey, JSON.stringify(guessesData));
  }

  const guessInput = document.getElementById("guess-input");
  const submitBtn = document.getElementById("submit-btn");
  const tableBody = document.querySelector("#guess-table tbody");
  const result = document.getElementById("result");
  const copyBtn = document.getElementById("copy-btn");
  const suggestionBox = document.getElementById("suggestions");
  const counterEl = document.getElementById("guess-counter");

  tableBody.innerHTML = "";
  result.textContent = "";
  result.style.color = "";
  suggestionBox.innerHTML = "";
  guessInput.value = "";
  updateCounter();
  guessInput.focus();

  /* ================= Hints and Search Scope ================= */
  // Stages: 0 = ??? | 1 = Weapon/Armor/Acc (guess 3) | 2 = exact category (guess 5) | 3 = + classes (guess 7) | 4 = + source (guess 9)
  function updateHintsAndSearchScope() {
    const misses = getCurrentGuesses().length;
    const stage = hintStageFromMisses(misses);
    const group = broadGroupFromClassType(dailyCategory);

    if (categoryEl) {
      if (!isHintsEnabled()) {
        categoryEl.textContent = "Hint: —";
        window.__SUGGEST_POOL__ = playablePool;
        return;
      }
      if (stage === 0) {
        categoryEl.textContent = "Hint: ???";
      } else if (stage === 1) {
        categoryEl.textContent = `Hint: ${group}`;
      } else if (stage === 2) {
        categoryEl.textContent = `Hint: ${dailyCategory}`;
      } else if (stage === 3) {
        const classTxt = classesToText(normalizeClasses(answer), isAbbrevEnabled());
        categoryEl.textContent = `Hint: ${dailyCategory} · Classes: ${classTxt}`;
      } else {
        const classTxt = classesToText(normalizeClasses(answer), isAbbrevEnabled());
        const src = (answer.droppedBy || "—").trim();
        categoryEl.textContent = `Hint: ${dailyCategory} · Classes: ${classTxt} · Source: ${src}`;
      }
    }

    if (stage === 0) {
      window.__SUGGEST_POOL__ = playablePool;
    } else if (stage === 1) {
      window.__SUGGEST_POOL__ = playablePool.filter(it => broadGroupFromClassType(it.classType) === group);
    } else {
      window.__SUGGEST_POOL__ = categoryPool;
    }
  }

  function updateCounter() {
    counterEl.textContent = `Guess #${getCurrentGuesses().length + 1}`;
  }

  function getCurrentGuesses() {
    if (!persistGuesses) {
      return guessesData.guesses || [];
    }
    if (guessesKey) {
      try {
        const saved = JSON.parse(localStorage.getItem(guessesKey) || "null");
        if (saved && Array.isArray(saved.guesses)) {
          guessesData.guesses = saved.guesses;
          return saved.guesses;
        }
      } catch (e) {
        // ignore parse errors and fall back to in-memory
      }
    }
    return guessesData.guesses || [];
  }

  function updateCopyState() {
    if (copyBtn) {
      copyBtn.disabled = getCurrentGuesses().length === 0;
    }
  }

  function getShareText() {
    const guesses = getCurrentGuesses();
    if (!guesses.length) return null;

    const solveIndex = guesses.findIndex(g => g.name.toLowerCase() === answer.name.toLowerCase());
    const solved = solveIndex !== -1;
    const displayGuesses = solved ? guesses.slice(0, solveIndex + 1) : guesses;

    const emojiFor = (color) => {
      if (color === "green") return "🟩";
      if (color === "yellow") return "🟨";
      return "⬛";
    };

    const rowForGuess = (g) => {
      const levelC = levelColor(g.minLevel, g.maxLevel, answer.minLevel, answer.maxLevel);
      const classC = classesColor(normalizeClasses(g), normalizeClasses(answer));
      const typeC = (g.classType === answer.classType) ? "green" : "red";
      const tradC = (g.tradable === answer.tradable) ? "green" : "red";
      const dropC = dropColor(g.droppedBy, answer.droppedBy);

      // Exclude item name (5 columns total)
      return [
        emojiFor(levelC),
        emojiFor(classC),
        emojiFor(typeC),
        emojiFor(tradC),
        emojiFor(dropC)
      ].join("");
    };

    const visibleRows = displayGuesses.slice(0, 6).map(rowForGuess);
    const remaining = displayGuesses.length - visibleRows.length;
    const grid = [
      ...visibleRows,
      ...(remaining > 0 ? [`(+${remaining} more guesses)`] : [])
    ].join("\n");
    const modeLabel = isEndlessMode() ? "Endless" : "Daily";
    const hintsLabel = isHintsEnabled() ? "Hints" : "No Hints";
    const d = new Date();
    const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const dateLabel = `${weekdays[d.getDay()]} ${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")} ${d.getFullYear()}`;
    const scoreLine = solved
      ? `Solved in ${displayGuesses.length} guesses`
      : `Unsolved (${displayGuesses.length} guesses)`;

    return `MapleGuessr ${modeLabel} ${hintsLabel} — ${dateLabel}\n${scoreLine}\n\n${grid}`;
  }

  function addGuessToTable(item) {
  const row = document.createElement("tr");
  if (item.name === answer.name) row.classList.add("answer-row");

  const gClasses = normalizeClasses(item);
  const aClasses = normalizeClasses(answer);

  row.innerHTML = `
    <td class="${item.name === answer.name ? 'green' : 'red'} name-partial">${highlightName(item.name, answer.name)}</td>
    <td class="${levelColor(item.minLevel, item.maxLevel, answer.minLevel, answer.maxLevel)}">${levelDisplay(item.minLevel, item.maxLevel, answer.minLevel, answer.maxLevel)}</td>
    <td class="${classesColor(gClasses, aClasses)}">${classesToText(gClasses, isAbbrevEnabled())}</td>
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

  // render prior guesses
  getCurrentGuesses().forEach(g => addGuessToTable(g));
  updateHintsAndSearchScope();
  updateCounter();
  updateCopyState();

  window.__REFRESH_UI__ = () => {
    tableBody.innerHTML = "";
    getCurrentGuesses().forEach(g => addGuessToTable(g));
    updateHintsAndSearchScope();
    updateCounter();
    updateCopyState();
  };

  if (copyBtn) {
    copyBtn.onclick = async () => {
      const text = getShareText();
      if (!text) {
        alert("No results yet.");
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        const prev = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = prev; }, 1200);
      } catch (e) {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        const prev = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = prev; }, 1200);
      }
    };
  }

  // Suggestions (narrowed by hint stage: __SUGGEST_POOL__ or categoryPool)
  guessInput.oninput = () => {
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
  };

  // Submit guess
  submitBtn.onclick = () => {
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
    if (persistGuesses && guessesKey) {
      localStorage.setItem(guessesKey, JSON.stringify(guessesData));
    }
    addGuessToTable(item);

    if (item.name.toLowerCase() === answer.name.toLowerCase()) {
      result.textContent = endless
        ? "🎉 Correct! Press Next Item to continue."
        : `🎉 Correct! You got it in ${guessesData.guesses.length} guesses.`;
      result.style.color = "#6dff6d";
    } else {
      updateHintsAndSearchScope();
      result.textContent = "Not quite, try again.";
      result.style.color = "#ff7a7a";
    }

    updateCounter();
    updateCopyState();
    guessInput.value = "";
    suggestionBox.innerHTML = "";
    guessInput.focus();
  };
}

/* ================= App Boot ================= */
async function startApp() {
  if (!localStorage.getItem(MODE_KEY)) setMode(MODE_DAILY);
  localStorage.removeItem("dev_force_index");

  initSettingsUI();
  updateEndlessButton();

  const title = document.getElementById("title");
  if (title) title.addEventListener("click", showMenu);

  const endlessBtn = document.getElementById("endless-btn");
  if (endlessBtn) {
    endlessBtn.addEventListener("click", async () => {
      const nextMode = isEndlessMode() ? MODE_DAILY : MODE_ENDLESS;
      setMode(nextMode);
      updateEndlessButton();

      showGame();

      if (!window.__POOL__) window.__POOL__ = await loadPoolData();
      startGame(window.__POOL__);
    });
  }
  const endlessResetBtn = document.getElementById("endless-reset-btn");
  if (endlessResetBtn) {
    endlessResetBtn.addEventListener("click", () => {
      if (isEndlessMode()) location.reload();
    });
  }

  showGame();

  window.__POOL__ = await loadPoolData();
  startGame(window.__POOL__);
}

startApp();
