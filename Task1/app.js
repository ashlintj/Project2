let secretNumber, attemptsLeft, guessHistory = [];
let bestScore = localStorage.getItem("bestScore") || null;
const guessInput = document.getElementById("guess");
const guessBtn = document.getElementById("guessBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");
const attemptsSpan = document.getElementById("attempts");
const bestScoreSpan = document.getElementById("bestScore");
const historyList = document.getElementById("history");
const guessForm = document.getElementById("guessForm");
function initGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attemptsLeft = 10;
  guessHistory = [];
  message.textContent = "";
  message.className = "";
  attemptsSpan.textContent = attemptsLeft;
  historyList.innerHTML = "";
  guessInput.value = "";
  guessBtn.disabled = true;
  guessInput.disabled = false;
  guessBtn.disabled = false;
  bestScoreSpan.textContent = bestScore || "-";
}
function checkGuess(e) {
  e.preventDefault();
  const guess = Number(guessInput.value);
  if (!guess || guess < 1 || guess > 100) {
    message.textContent = "⚠️ Please enter a number between 1 and 100";
    message.className = "fail";
    return;
  }

  attemptsLeft--;
  attemptsSpan.textContent = attemptsLeft;
  guessHistory.push(guess);
  const li = document.createElement("li");
  li.textContent = guess;
  historyList.appendChild(li);
  if (guess === secretNumber) {
    message.textContent = "🎉 Correct! You win!";
    message.className = "success";
    guessInput.disabled = true;
    guessBtn.disabled = true;
    let attemptsUsed = 10 - attemptsLeft;
    if (!bestScore || attemptsUsed < bestScore) {
      bestScore = attemptsUsed;
      localStorage.setItem("bestScore", bestScore);
      bestScoreSpan.textContent = bestScore;
    }
  } else if (attemptsLeft === 0) {
    message.textContent = `💀 Game Over! The number was ${secretNumber}`;
    message.className = "fail";
    guessInput.disabled = true;
    guessBtn.disabled = true;
  } else if (guess < secretNumber) {
    message.textContent = "📉 Too low!";
    message.className = "fail";
  } else {
    message.textContent = "📈 Too high!";
    message.className = "fail";
  }

  guessInput.value = "";
  guessBtn.disabled = true;
};
guessInput.addEventListener("input", () => {
  const val = Number(guessInput.value);
  guessBtn.disabled = !(val >= 1 && val <= 100);
});
guessForm.addEventListener("submit", checkGuess);
resetBtn.addEventListener("click", initGame);
initGame();
