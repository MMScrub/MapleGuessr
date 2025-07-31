// Load data from data.js
const guessInput = document.getElementById("guess-input");
const submitBtn = document.getElementById("submit-btn");
const guessHistory = document.getElementById("guess-history");
const result = document.getElementById("result");
const suggestionBox = document.createElement("ul");
suggestionBox.id = "suggestions";
guessInput.insertAdjacentElement("afterend", suggestionBox);

// Get current category and pool
const gameCategories = window.gameCategories;
const activeCategory = localStorage.getItem("category") || "item";
const pool = gameCategories[activeCategory];
const todayIndex = new Date().getDate() % pool.length;
const answer = pool[todayIndex].toLowerCase();

let guesses = JSON.parse(localStorage.getItem("mapleguessr_guesses_" + activeCategory)) || [];

// Normalize input
function normalize(text) {
  return text.trim().toLowerCase();
}

// Load existing guesses
guesses.forEach(g => addGuessToHistory(g));

// Suggest matching entries
guessInput.addEventListener("input", () => {
  const val = normalize(guessInput.value);
  suggestionBox.innerHTML = "";

  if (val.length === 0) return;

  const matches = pool.filter(entry => entry.toLowerCase().includes(val));
  matches.slice(0, 5).forEach(match => {
    const li = document.createElement("li");
    li.textContent = match;
    li.addEventListener("click", () => {
      guessInput.value = match;
      suggestionBox.innerHTML = "";
    });
    suggestionBox.appendChild(li);
  });
});

// Submit guess
submitBtn.addEventListener("click", () => {
  const userGuess = normalize(guessInput.value);
  if (!userGuess) return;

  if (guesses.includes(userGuess)) {
    alert("You already guessed that.");
    return;
  }

  guesses.push(userGuess);
  localStorage.setItem("mapleguessr_guesses_" + activeCategory, JSON.stringify(guesses));
  addGuessToHistory(userGuess);

  if (userGuess === answer) {
    result.textContent = `🎉 You got it in ${guesses.length} guesses!`;
    result.style.color = "#6dff6d";
  } else {
    result.textContent = `❌ Not quite. ${guesses.length} guesses so far.`;
    result.style.color = "#ff7a7a";
  }

  guessInput.value = "";
  suggestionBox.innerHTML = "";
});

// Add guess to the history list
function addGuessToHistory(guess) {
  const li = document.createElement("li");
  li.textContent = guess;
  guessHistory.appendChild(li);
}
