const scrollButtons = document.querySelectorAll("[data-scroll]");
scrollButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const gameText = document.getElementById("gameText");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const startGameBtn = document.getElementById("startGame");
const resetBestBtn = document.getElementById("resetBest");
const mineGrid = document.getElementById("mineGrid");

const GAME_TIME = 30;
const GRID_SIZE = 6;
const HEARTS_COUNT = 10;
let timeLeft = GAME_TIME;
let score = 0;
let best = Number(localStorage.getItem("rubishaBestScore")) || 0;
let timerId = null;
let gameActive = false;
let hearts = new Set();
let revealed = new Set();

bestEl.textContent = best.toString();

function resetBoard() {
  hearts = new Set();
  revealed = new Set();
  mineGrid.innerHTML = "";
  const total = GRID_SIZE * GRID_SIZE;
  while (hearts.size < HEARTS_COUNT) {
    hearts.add(Math.floor(Math.random() * total));
  }
  for (let i = 0; i < total; i += 1) {
    const tile = document.createElement("button");
    tile.className = "mine-tile";
    tile.type = "button";
    tile.dataset.index = i.toString();
    tile.textContent = "•";
    mineGrid.appendChild(tile);
  }
}

function resetGame() {
  timeLeft = GAME_TIME;
  score = 0;
  gameActive = false;
  timerEl.textContent = GAME_TIME.toString();
  scoreEl.textContent = "0";
  gameText.textContent = "Tap Play to start the challenge.";
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  resetBoard();
}

function updateBest() {
  if (score > best) {
    best = score;
    bestEl.textContent = best.toString();
    localStorage.setItem("rubishaBestScore", best.toString());
  }
}

function endGame(message) {
  gameActive = false;
  updateBest();
  gameText.textContent = message;
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startGame() {
  resetGame();
  gameActive = true;
  gameText.textContent = "Find hearts 💖 — wrong tiles cost time!";

  timerId = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = timeLeft.toString();
    if (timeLeft <= 0) {
      endGame(`Time's up! You scored ${score}.`);
    }
  }, 1000);
}

function revealTile(tile) {
  if (!gameActive) return;
  const index = Number(tile.dataset.index);
  if (revealed.has(index)) return;
  revealed.add(index);
  tile.classList.add("revealed");

  if (hearts.has(index)) {
    tile.classList.add("heart");
    tile.textContent = "💖";
    score += 1;
    scoreEl.textContent = score.toString();
    if (score >= HEARTS_COUNT) {
      endGame("All hearts found! Champion 🏆");
    }
  } else {
    tile.textContent = "✨";
    timeLeft = Math.max(0, timeLeft - 2);
    timerEl.textContent = timeLeft.toString();
    if (timeLeft <= 0) {
      endGame(`Time's up! You scored ${score}.`);
    }
  }
}

mineGrid.addEventListener("click", (event) => {
  const tile = event.target.closest(".mine-tile");
  if (!tile) return;
  revealTile(tile);
});

startGameBtn.addEventListener("click", startGame);
resetBestBtn.addEventListener("click", () => {
  best = 0;
  bestEl.textContent = "0";
  localStorage.removeItem("rubishaBestScore");
});

resetGame();

const noBtn = document.getElementById("noBtn");
const buttonsWrap = document.getElementById("valentineButtons");
const yesBtn = document.getElementById("yesBtn");
const yesMessage = document.getElementById("yesMessage");
const quizScore = document.getElementById("quizScore");
const resetQuizBtn = document.getElementById("resetQuiz");
const quizQuestions = document.querySelectorAll(".quiz-question");

function moveNoButton() {
  const wrapRect = buttonsWrap.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();
  const padding = 8;

  const maxX = wrapRect.width - btnRect.width - padding;
  const maxY = wrapRect.height - btnRect.height - padding;

  const x = Math.max(padding, Math.random() * maxX);
  const y = Math.max(padding, Math.random() * maxY);

  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

["mouseover", "pointerdown", "touchstart"].forEach((evt) => {
  noBtn.addEventListener(evt, (e) => {
    e.preventDefault();
    moveNoButton();
  });
});

yesBtn.addEventListener("click", () => {
  yesMessage.hidden = false;
  buttonsWrap.style.display = "none";
});

window.addEventListener("resize", () => {
  noBtn.style.transform = "translate(0, 0)";
});

let quizPoints = 0;

function updateQuizScore() {
  quizScore.textContent = `Score: ${quizPoints}/${quizQuestions.length}`;
}

quizQuestions.forEach((question) => {
  const answer = Number(question.dataset.answer);
  const options = question.querySelectorAll(".quiz-option");
  options.forEach((option, index) => {
    option.addEventListener("click", () => {
      if (option.classList.contains("correct") || option.classList.contains("wrong")) {
        return;
      }
      if (index === answer) {
        option.classList.add("correct");
        quizPoints += 1;
      } else {
        option.classList.add("wrong");
        options[answer].classList.add("correct");
      }
      updateQuizScore();
    });
  });
});

resetQuizBtn.addEventListener("click", () => {
  quizPoints = 0;
  quizQuestions.forEach((question) => {
    question.querySelectorAll(".quiz-option").forEach((option) => {
      option.classList.remove("correct", "wrong");
    });
  });
  updateQuizScore();
});

updateQuizScore();
