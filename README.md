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
4. ⬆️⬇️ Equip Level column shows:
   - `✓` exact match  
   - `↑` means the correct item’s level is higher  
   - `↓` means the correct item’s level is lower  
5. 🎯 "Dropped By / Source" column includes colored badges:
   - <span style="color:#2b5fff">[PQ]</span> = Obtained from a Party Quest 🎉
   - <span style="color:#7b3fe4">[Gachapon]</span> = Obtained from a gachapon machine 🎰
   - <span style="color:#8a5a2b">[Quest]</span> = Obtained from a quest or crafting 📜
   - <span style="color:#555">[Mob]</span> = Dropped by a monster/boss 🐉
6. Keep guessing until you find the correct item!

## 🛠 Development Notes
- Added **Dev Buttons** for testing:
  - Reset Game
  - Random Answer Mode
  - Daily Mode
  - Next Answer
  - Reveal Answer
- Data accuracy is based on MapleLegends (v62) with some minor exceptions for variety.

## 📅 Changelog v0.2.3
- Added Mode Indicator
- Added Guess Counter
- Equip Level icons (✓ exact, ↑ higher, ↓ lower)
- Partial name match highlighting
- Colored source badges by type
- Refined drop source color logic
- Added collapsible “How to Play” section
- UI layout tweaks

## 🚀 Future Plans
- Add NPC and Boss categories
- Implement daily leaderboard
- Expand item list
- Mobile-friendly UI improvements

---

## 📜 Credits
Created by Jacob / MMScrub  
Inspired by **MapleLegends** and community projects like **MCDLE**.
