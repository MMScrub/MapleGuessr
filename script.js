const categorySelect = document.getElementById("category-select");

// Set dropdown to current category on load
categorySelect.value = localStorage.getItem("category") || "item";

// When category changes, store it and reload page
categorySelect.addEventListener("change", () => {
  localStorage.setItem("category", categorySelect.value);
  location.reload(); // refresh page to use new category
});

const guessInput = document.getElementById("guess-input");
const submitBtn = document.getElementById("submit-btn");
const guessHistory = document.getElementById("guess-history");
const result = document.getElementById("result");

let guesses = JSON.parse(localStorage.getItem("mapleguessr_guesses")) || [];

function normalize(text) {
  return text.trim().toLowerCase();
}

// Load previous guesses on page load
guesses.forEach(g => addGuessToHistory(g));

// Handle submit
submitBtn.addEventListener("click", () => {
  const userGuess = normalize(guessInput.value);
  if (!userGuess) return;

  if (guesses.includes(userGuess)) {
    alert("You already guessed that.");
    return;
  }

  guesses.push(userGuess);
  localStorage.setItem("mapleguessr_guesses", JSON.stringify(guesses));

  addGuessToHistory(userGuess);

  if (userGuess === answer) {
    result.textContent = `🎉 You got it in ${guesses.length} guesses!`;
  } else {
    result.textContent = "❌ Not quite, keep trying!";
  }

  guessInput.value = "";
});

function addGuessToHistory(guess) {
  const li = document.createElement("li");
  li.textContent = guess;
  guessHistory.appendChild(li);
}
