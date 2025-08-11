# 🎯 MapleGuessr (Early Access v0.2.3)

A daily guessing game for MapleLegends items, inspired by Wordle-style mechanics.  
Guess the hidden item by entering names — the table will give you feedback on your guess based on stats and source.

## 📖 How to Play
1. 🗂 Select a category from the menu (currently only **Items** is available; NPCs and Bosses are WIP).
2. ⌨️ Enter your guess in the input field. A suggestion list will help with spelling.
3. 📊 After submitting, the table will compare your guess to the correct answer:
   - 🟩 **Green** = Exact match
   - 🟨 **Yellow** = Close match (Equip Level ±5, same source type but different source)
   - 🟥 **Red** = No match
4. ⬆️⬇️ Equip Level column shows an arrow if the real item requires higher/lower level.
5. 🎯 "Dropped By / Source" column includes badges:
   - `[Mob]` = Dropped by a monster/boss 🐉
   - `[PQ]` = Obtained from a Party Quest 🎉
   - `[Gachapon]` = Obtained from a gachapon machine 🎰
   - `[Quest]` = Obtained from a quest or crafting 📜
6. Keep guessing until you find the correct item!

## 🛠 Development Notes
- Currently only the **Items** category is functional.
- Added "Reset Game (Dev)" button for testing — clears local data and reloads.
- Data accuracy is based on MapleLegends (v62) with some minor exceptions for variety.

## 📅 Changelog v0.2.3
- Added `[Quest]` badge for quest/crafted items.
- Updated item data for MapleLegends accuracy.
- Added badge display for source types.
- Improved drop source color logic.
- Added collapsible "How to Play" section.
- Added "Reset Game (Dev)" button for testing.
- Removed automatic localStorage clearing on refresh.
- Minor UI spacing/layout tweaks.

## 🚀 Future Plans
- Add NPC and Boss categories.
- Implement daily leaderboard.
- Expand item list.
- Add mobile-friendly UI adjustments.

---

## 📜 Credits
Created by Jacob / MMScrub 
Inspired by **MapleLegends** and community projects like **MCDLE**.
