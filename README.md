**MapleGuessr** is a MapleLegends-inspired guessing game based on the popular daily puzzle format (similar to Wordle, MCDLE, etc.).  
Every day, there’s a **new hidden MapleLegends item** to guess. Use clues like **Equip Level**, **Class Type**, **Stackable**, **Tradable**, and **Dropped By** to find the answer.

---

## 🕹 How to Play
1. Select your category (**Items** only for now — NPCs & Bosses are WIP).
2. Enter your guesses in the input box.  
3. Feedback colors will guide you:
   - 🟩 **Green** = Exact match  
   - 🟨 **Yellow** = Close match (Equip Level ±5 or same drop type but wrong source)  
   - 🟥 **Red** = No match  
4. **Equip Level Arrows**:
   - ↑ = Correct item has a higher level requirement  
   - ↓ = Correct item has a lower level requirement  
5. Keep guessing until you find the daily item.

---

## 📅 v0.2.2 Early Access Changelog

New Features
- Source-type badges added in Dropped By column: [Mob], [Gachapon], [PQ]
- Color feedback for drop sources now works with badges
- Updated "How to Play" to explain badges

Improvements
- Auto-focus on input after each guess
- Highlight correct guess row
- Better drop source feedback (mob vs gachapon vs wrong)

---

## 🚧 Planned for The Future
- NPC & Boss categories.
- Expanded item list with more MapleLegends data.
- Mobile-friendly layout tweaks.
- Persistent “How to Play” open/close state.

---

## 🛠 Development
This project is built using **HTML, CSS, and JavaScript** only.  
No frameworks or external libraries are required.

### Local Testing
To run locally:
1. Download the repository.
2. Open `index.html` in your web browser.
3. Start guessing!

---

## 📜 Credits
Created by Jacob / MMScrub 
Inspired by **MapleLegends** and community projects like **MCDLE**.
