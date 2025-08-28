const loadBtn = document.getElementById("loadBtn");
const refreshBtn = document.getElementById("refreshBtn");
const copyBtn = document.getElementById("copyBtn");
const setupEl = document.getElementById("setup");
const punchlineEl = document.getElementById("punchline");
const statusEl = document.getElementById("status");

const API_URL = "https://official-joke-api.appspot.com/random_joke";
window.addEventListener("DOMContentLoaded", () => {
  const cached = localStorage.getItem("lastJoke");
  if (cached) {
    const joke = JSON.parse(cached);
    displayJoke(joke);
    refreshBtn.disabled = false;
    copyBtn.disabled = false;
  }
});

async function fetchJoke() {
  try {
    showStatus("Loading…");
    disableButtons(true);

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Server error " + response.status);

    const data = await response.json();
    displayJoke(data);
    localStorage.setItem("lastJoke", JSON.stringify(data));
    hideStatus();
    disableButtons(false);

  } catch (err) {
    showStatus("⚠️ Error: " + err.message);
    disableButtons(false);
  }
}

function displayJoke(joke) {
  setupEl.textContent = joke.setup;
  punchlineEl.textContent = joke.punchline;
  refreshBtn.disabled = false;
  copyBtn.disabled = false;
}

function showStatus(msg) {
  statusEl.textContent = msg;
}

function hideStatus() {
  statusEl.textContent = "";
}

function disableButtons(disabled) {
  loadBtn.disabled = disabled;
  refreshBtn.disabled = disabled;
  copyBtn.disabled = disabled;
}
copyBtn.addEventListener("click", () => {
  const text = `${setupEl.textContent} — ${punchlineEl.textContent}`;
  navigator.clipboard.writeText(text).then(() => {
    showStatus("✅ Copied!");
    setTimeout(hideStatus, 1500);
  });
});

loadBtn.addEventListener("click", fetchJoke);
refreshBtn.addEventListener("click", fetchJoke);
