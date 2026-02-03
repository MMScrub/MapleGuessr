# 🎯 MapleGuessr (Very Early Early Access v0.2.5)

A daily guessing game for MapleLegends items, inspired by Wordle-style mechanics.  
Guess the hidden item by entering names — the table will give you feedback on your guess based on stats and source.

## 📖 How to Play
1. 🗂 Select a category from the menu (currently only **Items** is available; NPCs and Bosses are WIP).
2. ⌨️ Enter your guess in the input field. A suggestion list will help with spelling.
3. 📊 After submitting, the table will compare your guess to the correct answer:
   - 🟩 **Green** = Exact match
   - 🟨 **Yellow** = Close match (Equip Level ±10 from the answer’s range, or same source type but different specific source)
   - 🟥 **Red** = No match
4. ⬆️⬇️ **Equip Level (Range)**
   - Items now use **min–max** level ranges (e.g., `50–90` for Ravana Helmet).
   - `✓` shows when your range **overlaps** the answer’s range.
   - `↑` means the correct item’s range is **higher** than your guess.
   - `↓` means the correct item’s range is **lower** than your guess.
   - `—` for non-equipable items (consumables, scrolls, stars, etc.).
5.  "Dropped By / Source" column includes colored badges:
   - <span style="color:#2b5fff">[PQ]</span> = Obtained from a Party Quest 🎉
   - <span style="color:#7b3fe4">[Gachapon]</span> = Obtained from a gachapon machine 🎰
   - <span style="color:#8a5a2b">[Quest]</span> = Obtained from a quest or crafting 📜
   - <span style="color:#555">[Mob]</span> = Dropped by a monster/boss 🐉
   - <span style="color:#2aa198">[Store]</span> = Obtained from stores 🏪
6. 🔄 Keep guessing until you find the correct item!

## 🛠 Development Notes
- Dev Buttons for testing:
  - Reset Game
  - Random Answer Mode / Daily Mode
  - Next Answer
  - Reveal Answer
- Equip Level is now stored as **minLevel/maxLevel** (or both `null` if not equipable).
- Data accuracy is based on MapleLegends (v62) with custom exceptions where applicable.

## 📅 Changelog 🧩 Update v0.2.5 – Core Systems Cleanup & Data Workflow

- restructured game into separate files (HTML / CSS / JS) for better organization and maintainability
- Added scrolling + improved usability to the dropdown suggestion search
- Implemented filtered, gradual hint logic to support future step-by-step narrowing gameplay
- Reworked item data structure (removed stackable, added class support, clarified categories)
- Created a shared spreadsheet-based workflow to make item pool updates easier and community-editable
- General cleanup, balance prep, and internal tooling improvements
- Game is now back to a stable, playable state and ready for content expansion.

## 🚀 Future Plans
- Add NPC and Boss categories
- Implement daily leaderboard
- Expand item list
- Mobile-friendly UI improvements

---

## 📜 Credits
Created by Jacob / MMScrub  
Inspired by **MapleLegends** and community projects like **MCDLE**.
