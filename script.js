"use strict";

// Selecting elements
const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");
const score0El = document.querySelector("#score--0");
const score1El = document.getElementById("score--1");
const name0El = document.getElementById("name--0");
const name1El = document.getElementById("name--1");
const current0El = document.getElementById("current--0");
const current1El = document.getElementById("current--1");
const diceEl = document.querySelector(".dice");
const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");
const btnSettings = document.querySelector(".btn--settings");
const settingsModal = document.querySelector(".settings-modal");
const closeModal = document.querySelector(".close-modal");
const btnSaveSettings = document.querySelector(".btn--settings-save");
const rollCountEl = document.getElementById("roll-count");
const p1WinsEl = document.getElementById("p1-wins");
const p2WinsEl = document.getElementById("p2-wins");

let scores, currentScore, activePlayer, playing;
let winningScore = 100;
let rollCount = 0;
let playerWins = [0, 0];

// Game settings
const gameSettings = {
  player1Name: "Player 1",
  player2Name: "Player 2",
  winningScore: 100,
  gameMode: "normal",
};

// Settings modal handlers
const openSettings = function () {
  settingsModal.classList.remove("hidden");
  document.getElementById("player1-name").value = gameSettings.player1Name;
  document.getElementById("player2-name").value = gameSettings.player2Name;
  document.getElementById("winning-score").value = gameSettings.winningScore;
  document.getElementById("game-mode").value = gameSettings.gameMode;
};

const closeSettings = function () {
  settingsModal.classList.add("hidden");
};

const saveSettings = function () {
  gameSettings.player1Name =
    document.getElementById("player1-name").value || "Player 1";
  gameSettings.player2Name =
    document.getElementById("player2-name").value || "Player 2";
  gameSettings.gameMode = document.getElementById("game-mode").value;

  // Update winning score based on game mode
  switch (gameSettings.gameMode) {
    case "quick":
      gameSettings.winningScore = 50;
      break;
    case "challenge":
      gameSettings.winningScore = 150;
      break;
    default:
      gameSettings.winningScore =
        Number(document.getElementById("winning-score").value) || 100;
  }

  winningScore = gameSettings.winningScore;
  name0El.textContent = gameSettings.player1Name;
  name1El.textContent = gameSettings.player2Name;
  closeSettings();
  init();
};

// Starting conditions
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;
  rollCount = 0;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;
  rollCountEl.textContent = 0;

  diceEl.classList.add("hidden");
  player0El.classList.remove("player--winner");
  player1El.classList.remove("player--winner");
  player0El.classList.add("player--active");
  player1El.classList.remove("player--active");
};

const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle("player--active");
  player1El.classList.toggle("player--active");
};

// Rolling dice functionality with animation
const rollDice = function () {
  if (playing) {
    rollCount++;
    rollCountEl.textContent = rollCount;

    const dice = Math.trunc(Math.random() * 6) + 1;

    diceEl.classList.remove("hidden");

    // Remove and re-add animation class to trigger it again
    diceEl.classList.remove("dice-rolling");
    void diceEl.offsetWidth; // Trigger reflow to restart animation
    diceEl.classList.add("dice-rolling");

    // Wait for animation to complete before showing the result
    setTimeout(() => {
      diceEl.src = `./images/dice-${dice}.png`;

      if (dice !== 1) {
        currentScore += dice;
        document.getElementById(`current--${activePlayer}`).textContent =
          currentScore;
      } else {
        switchPlayer();
      }
    }, 800); // Match the animation duration
  }
};

// Holding current score
const holdScore = function () {
  if (playing) {
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    if (scores[activePlayer] >= winningScore) {
      playing = false;
      diceEl.classList.add("hidden");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add("player--winner");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove("player--active");

      // Update win count
      playerWins[activePlayer]++;
      p1WinsEl.textContent = playerWins[0];
      p2WinsEl.textContent = playerWins[1];
    } else {
      switchPlayer();
    }
  }
};

// Event listeners
btnRoll.addEventListener("click", rollDice);
btnHold.addEventListener("click", holdScore);
btnNew.addEventListener("click", init);
btnSettings.addEventListener("click", openSettings);
closeModal.addEventListener("click", closeSettings);
btnSaveSettings.addEventListener("click", saveSettings);

// Keyboard controls
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    e.preventDefault(); // Prevent page scroll
    rollDice();
  } else if (e.code === "Enter") {
    e.preventDefault();
    holdScore();
  } else if (e.code === "KeyN") {
    init();
  } else if (
    e.code === "Escape" &&
    !settingsModal.classList.contains("hidden")
  ) {
    closeSettings();
  }
});

// Initialize game
init();
