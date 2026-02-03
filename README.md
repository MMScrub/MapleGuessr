# 🎯 MapleGuessr (Very Early Early Early Access v0.2.5)

A daily guessing game for **MapleLegends** items, inspired by Wordle-style mechanics.  
Guess the hidden item by entering names, each guess gives structured feedback to help you narrow it down.

---

## 📖 How to Play
1. 🗂 Select a category from the menu  
   - Currently only **Items** is playable  
   - **NPCs** and **Bosses** are planned (WIP)

2. ⌨️ Enter an item name in the input field  
   - Autocomplete suggestions help with spelling and discovery

3. 📊 After submitting a guess, the table compares it against the correct answer:

### 🔍 Table Feedback
- 🟩 **Green** = Exact match  
- 🟨 **Yellow** = Partial / close match  
- 🟥 **Red** = No match  

### ⬆️⬇️ Equip Level (Range)
- Items use **min–max** level ranges (e.g. `50–90`)
- Indicators:
  - `✓` = Your range **overlaps** the answer’s range
  - `↑` = The correct item’s range is **higher**
  - `↓` = The correct item’s range is **lower**
  - `—` = Not equipable

### 🧙 Classes
- Shows which classes can equip the item (e.g. `Beginner, Warrior`)
- Color feedback:
  - 🟩 Same class set
  - 🟨 Partial overlap
  - 🟥 No overlap

### 🧩 Class Type
- Weapon / armor type (Bow, Helmet, Pendant, etc.)

### 🔁 Tradable
- Whether the item can be traded

### 🐉 Dropped By / Source
Includes color-coded source badges:
- [PQ] = Party Quest 🎉  
- [Gachapon] = Gachapon 🎰  
- [Quest] = Quest / Exchange 📜  
- [Mob] = Monster / Boss drop 🐉  
- [Store] = NPC Store 🏪  

4. 🔄 Keep guessing until you find the correct item!

---

## 🛠 Development Notes
- Developer tools included for testing:
  - Reset Game
  - Random Answer / Daily Mode
  - Next Answer
  - Reveal Answer
- Item data is filtered to **equipable items only**
  - No chairs, scrolls, consumables, throwing stars, or NX items
- Equip levels are stored as `minLevel` / `maxLevel`
- Class data now drives gameplay and comparison logic

---

## 📅 Changelog v0.2.5
- 🆕 Added **Classes** column (replaced Stackable)
- 🧠 Class comparison logic (exact / partial / none)
- 🧹 Cleaned item pool to equipables only
- 🔧 Stability fixes after category & filtering refactor
- ✍️ UI and table alignment improvements

---

## 🚀 Planned Implementations / Changes
- Gradual hint system (category → type → source)
- Fix Item tags
- NPC and Boss guessing modes
- Daily leaderboard
- Larger item pool
- NPC and Boss guessing modes

---

## 📜 Credits
Created by **Jacob / MMScrub**  
Inspired by **MapleLegends** and community projects like **MCDLE**
