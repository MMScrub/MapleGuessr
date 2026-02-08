Current version: v0.3.2 
See CHANGELOG.md for details.

# 🎯 MapleGuessr (Early Access v0.3.2)

A daily guessing game for MapleLegends items, inspired by Wordle-style mechanics.  
Guess the hidden item by entering names — the table will give you feedback on your guess based on stats and source.

## 📖 How to Play
1. ▶️ The game auto-starts in **Daily** mode. Click **MapleGuessr** to return to the menu (Equipment only; NPCs/Bosses are WIP).
2. ⌨️ Enter your guess. The suggestion list helps with spelling and narrows as hints unlock.
3. 📊 The table compares your guess to the answer:
   - 🟩 **Green** = Exact match
   - 🟨 **Yellow** = Close match (Equip Level gap ≤ ±20, or same source type but different specific source)
   - ⬛ **Grey** = No match
4. ⬆️⬇️ **Equip Level (Range)**
   - Items use **min–max** level ranges (e.g., `50–90`).
   - `✓` means your range **overlaps** the answer’s range.
   - `↑` means the answer’s range is **higher**.
   - `↓` means the answer’s range is **lower**.
5. 🧠 **Hints** (under Mode)
   - Hint 1: Source badges
   - Hint 2: Weapon / Armor / Acc (earlier)
   - Hint 3: Exact category (e.g., `One-Handed Sword`)
   - Hint 4: Category + classes
   - Hint 5: Category + classes + source
6. 🎛 **Settings (⚙)**
   - Abbreviate class names (live)
   - Show hints (live)
7. ♾ **Endless Mode**
   - Toggle via **Endless Mode** button
   - Use **Next Item** to keep going
8.  "Dropped By / Source" includes badges:
   - [PQ], [Gachapon], [Quest], [Mob], [Store], [Event]
9. 🔄 Keep guessing until you find the correct item!

## 🛠 Development Notes
- The app is split into `index.html`, `css/style.css`, and `js/main.js`.
- Data is loaded from `data/pool.json` (run with a local server like Live Server).
- Equip Level is stored as **minLevel/maxLevel**; missing values are treated as `0` for display.
- Data accuracy is based on MapleLegends (v62) with custom exceptions where applicable.
- Certain items are compiled together to keep gameplay fair and fun (e.g., color/gender variants).

## 📅 Changelog 🧩 Update v0.3.2 – Mobile + UX
- Mobile table scaling and column clipping (ellipsis)
- Column headers shortened for mobile readability
- Source badges as the first hint (badge-only) and cumulative hint display
- Search matches category terms across all playable items
- Drop/source formatting improvements (multi‑tags, ordering, truncation)
- Wordle-style share output uses last 6 rows + total guesses
- Exact source match highlighted in green

## 🚀 Future Plans
- Expand item list
- Implement daily leaderboard
- Add NPC and Boss categories
---

## 📜 Credits
Created by Jacob / MMScrub  | Play-Tested by @lynerd
Inspired by **MapleLegends** and community projects like **MCDLE**, and **Wordle**.
