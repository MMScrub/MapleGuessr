# Changelog
All notable changes to this project will be documented in this file.

The format is based on *Keep a Changelog*,
and this project adheres to semantic versioning (pre-1.0).

---

## [0.3.2] – 2026-02-08
### Added
- Mobile-friendly table scaling with column clipping (ellipsis)
- Source badges as the initial hint (badge-only), with cumulative hint progression
- Wordle-style share output (last 6 guesses + total guess count)
- Multi-tag source badges with deterministic ordering and truncation

### Changed
- Search now matches category terms across all playable items
- Drop/source formatting prioritizes matching mobs
- Equipment title display and general UI polish for mobile layouts

### Fixed
- Yellow highlight for partial source tag overlap
- Search misses for Eye/Face accessory class types due to normalization issues

---

## [0.3.1] – 2026-02-08
### Added
- Equipment title display
- Cumulative hint behavior (hints no longer replace previous ones)
- Earlier Weapon/Armor/Accessory hint stage
- Category-aware search terms (e.g., "claw", "pendant")

### Changed
- Drop/source formatting improved (multi-tag handling, ordering, truncation)
- Drop/source column width capped with ellipsis and mobile scaling
- The item data sheet was fully overhauled for accuracy and future additions

### Fixed
- Exact source matches now consistently highlight green

---

## [0.3.0] – 2026-02-08
### Added
- Daily mode as default with Endless mode toggle
- Next Item control for Endless mode
- Settings modal with live updates
- Shareable results output
- Wordle-style share grid (6-row cap with summary line)
- Progressive multi-stage hint system with configurable settings
- Abbreviated class display toggle
- Expanded source badge logic including [Event] and [PQ]

### Changed
- Level comparison logic updated: ±20 range for yellow (near match)
- Drop source logic refactored for multi-tag badges and ordered lists
- Item data sheet fully overhauled for accuracy
- Cosmetic color and gender variants consolidated for fair gameplay

### Fixed
- Settings refresh inconsistencies
- Guess counter desynchronization issues

---

## [0.2.5] – 2026-02-03
### Changed
- Replaced **Stackable** column with **Classes**

### Fixed
- Item class comparison logic (exact / partial / none)
- Cleaned item pool to equipable items only
- Stability issues following category and filtering refactors
- UI and table alignment inconsistencies
- Items failing to appear in search results

---

## [0.2.4] – 2025-08-11
### Added
- Equip Level represented as ranges (min–max)
- Range-based feedback:
  - Green for overlapping ranges
  - Yellow for ranges within ±5
  - Red for distant ranges
- Visual indicators (✓ / ↑ / ↓) for level comparisons

### Changed
- Retained all v0.2.3 quality-of-life improvements

---

## [0.2.3] – 2025-08-10
### Added
- Mode indicator
- Guess counter
- Partial name match highlighting
- Colored source badges by drop type
- Collapsible “How to Play” section

### Changed
- Refined drop source color logic
- UI layout and spacing improvements

---

## [0.2.2] – 2025-08-10
### Added
- Source-type badges in Dropped By column ([Mob], [Gachapon], [PQ])
- Badge-aware color feedback for drop sources

### Changed
- Updated “How to Play” to document badge behavior
- Improved input auto-focus behavior after guesses

### Fixed
- Correct guess row highlighting
- Drop source feedback accuracy (mob vs gachapon vs incorrect)

---

## [0.2.0] – 2025-08-10
### Added
- Equip Level column with up/down indicators and ±5 yellow threshold
- Crimson Arcglaive as a post-v62/custom item
- Collapsible “How to Play” section

### Improved
- Input auto-focus after each guess
- Correct guess row highlighting
- Drop source feedback clarity