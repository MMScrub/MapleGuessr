# 🎯 MapleGuessr (Early Access v0.2.5)

A daily guessing game for MapleLegends items, inspired by Wordle-style mechanics.  
Guess the hidden item by entering names — the table will give you feedback on your guess based on stats and source.

## 📖 How to Play
1. ▶️ The game auto-starts in **Daily** mode. Click **MapleGuessr** to return to the menu (Items only; NPCs/Bosses are WIP).
2. ⌨️ Enter your guess. The suggestion list helps with spelling and narrows as hints unlock.
3. 📊 The table compares your guess to the answer:
   - 🟩 **Green** = Exact match
   - 🟨 **Yellow** = Close match (Equip Level gap ≤ ±5, or same source type but different specific source)
   - ⬛ **Grey** = No match
4. ⬆️⬇️ **Equip Level (Range)**
   - Items use **min–max** level ranges (e.g., `50–90`).
   - `✓` means your range **overlaps** the answer’s range.
   - `↑` means the answer’s range is **higher**.
   - `↓` means the answer’s range is **lower**.
5. 🧠 **Hints** (under Mode)
   - Guess 1–2: `Hint: ???`
   - Guess 3: `Weapon` / `Armor` / `Acc`
   - Guess 5: Exact category (e.g., `One-Handed Sword`)
   - Guess 7: Category + classes
   - Guess 9: Category + classes + source
6. 🎛 **Settings (⚙)**
   - Abbreviate class names (live)
   - Show hints (live)
7. ♾ **Endless Mode**
   - Toggle via **Endless Mode** button
   - Use **Next Item** to keep going
8.  "Dropped By / Source" includes badges:
   - [PQ], [Gachapon], [Quest], [Mob], [Store]
9. 🔄 Keep guessing until you find the correct item!

## 🛠 Development Notes
- The app is split into `index.html`, `css/style.css`, and `js/main.js`.
- Data is loaded from `data/pool.json` (run with a local server like Live Server).
- Equip Level is stored as **minLevel/maxLevel**; missing values are treated as `0` for display.
- Data accuracy is based on MapleLegends (v62) with custom exceptions where applicable.

## 📅 Changelog 🧩 Update v0.2.5 – Core Systems & UX
- Split into separate HTML/CSS/JS files
- Daily mode default + Endless mode toggle
- Progressive hint system (multi‑stage) + hint settings
- Abbreviated class display (toggle)
- Scrolling suggestion list + narrowing by hint stage
- Settings modal (live updates)
- Removed dev buttons; cleaner UI

## 🚀 Future Plans
- Add NPC and Boss categories
- Implement daily leaderboard
- Expand item list
- Mobile-friendly UI improvements

---

## 📜 Credits
Created by Jacob / MMScrub  
Inspired by **MapleLegends** and community projects like **MCDLE**.
