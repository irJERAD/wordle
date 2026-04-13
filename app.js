const WORD_SETS = {
  mixed: {
    label: "Mixed",
    words: ["brain", "story", "learn", "spark", "focus", "dream", "magic", "quest"]
  },
  science: {
    label: "Science",
    words: ["atoms", "cells", "force", "laser", "sound", "solid", "cloud", "brain"]
  },
  history: {
    label: "History",
    words: ["crown", "event", "queen", "roman", "sword", "treat", "march", "civil"]
  },
  ela: {
    label: "ELA",
    words: ["novel", "story", "poems", "drama", "genre", "scene", "infer", "claim"]
  },
  nature: {
    label: "Nature",
    words: ["ocean", "river", "plant", "tiger", "stone", "flame", "cloud", "earth"]
  }
};

const VALID_GUESSES = new Set(DICTIONARY_WORDS);
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
const STORAGE_KEY = "wordle";

const state = {
  activeTheme: "mixed",
  secretWord: "",
  guesses: Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill("")),
  evaluations: Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill("")),
  rowIndex: 0,
  colIndex: 0,
  gameOver: false,
  wins: 0
};

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
const notice = document.getElementById("notice");
const nativeInput = document.getElementById("native-input");
const themeChip = document.getElementById("theme-chip");
const themeSelect = document.getElementById("theme-select");
const winsCount = document.getElementById("wins-count");
const newGameTopButton = document.getElementById("new-game-top");
const newGameButton = document.getElementById("new-game");

const keyboardLayout = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"]
];

function loadProgress() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  state.wins = Number(saved.wins) || 0;
  state.activeTheme = saved.activeTheme || "mixed";
  winsCount.textContent = String(state.wins);
  themeSelect.value = state.activeTheme;
}

function saveProgress() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      wins: state.wins,
      activeTheme: state.activeTheme
    })
  );
}

function chooseWord() {
  const words = WORD_SETS[state.activeTheme].words;
  return words[Math.floor(Math.random() * words.length)];
}

function currentThemeWords() {
  return WORD_SETS[state.activeTheme].words;
}

function isAllowedGuess(guess) {
  return VALID_GUESSES.has(guess);
}

function updateThemeUi() {
  themeChip.textContent = `Theme: ${WORD_SETS[state.activeTheme].label}`;
}

function resetGame() {
  state.secretWord = chooseWord();
  state.guesses = Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill(""));
  state.evaluations = Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill(""));
  state.rowIndex = 0;
  state.colIndex = 0;
  state.gameOver = false;
  updateThemeUi();
  setNotice(`Theme: ${WORD_SETS[state.activeTheme].label}. Type a five-letter word and press Enter.`);
  renderBoard();
  renderKeyboard();
  syncNativeInput();
}

function setNotice(message) {
  notice.textContent = message;
}

function syncNativeInput() {
  nativeInput.value = state.guesses[state.rowIndex].join("");
}

function focusNativeInput() {
  if (state.gameOver) return;
  nativeInput.focus({ preventScroll: true });
  nativeInput.setSelectionRange(nativeInput.value.length, nativeInput.value.length);
}

function renderBoard() {
  board.innerHTML = "";

  for (let row = 0; row < MAX_GUESSES; row += 1) {
    const rowEl = document.createElement("div");
    rowEl.className = "board-row";

    for (let col = 0; col < WORD_LENGTH; col += 1) {
      const tile = document.createElement("div");
      tile.className = "tile";
      const letter = state.guesses[row][col];
      const evaluation = state.evaluations[row][col];

      if (letter) {
        tile.classList.add("filled");
        tile.textContent = letter;
      }

      if (evaluation) {
        tile.classList.add(evaluation);
      }

      rowEl.appendChild(tile);
    }

    board.appendChild(rowEl);
  }
}

function currentKeyStateMap() {
  const priority = { miss: 1, present: 2, correct: 3 };
  const result = {};

  state.guesses.forEach((guessRow, rowIndex) => {
    guessRow.forEach((letter, colIndex) => {
      const status = state.evaluations[rowIndex][colIndex];
      if (!letter || !status) return;
      const existing = result[letter];
      if (!existing || priority[status] > priority[existing]) {
        result[letter] = status;
      }
    });
  });

  return result;
}

function renderKeyboard() {
  const keyStates = currentKeyStateMap();
  keyboard.innerHTML = "";

  keyboardLayout.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "keyboard-row";

    row.forEach((label) => {
      const button = document.createElement("button");
      button.className = "key";
      button.type = "button";
      button.textContent = label === "BACK" ? "Delete" : label;
      button.dataset.key = label;

      if (label === "ENTER" || label === "BACK") {
        button.classList.add("wide");
      }

      const mappedLetter = label.length === 1 ? label : "";
      if (mappedLetter && keyStates[mappedLetter]) {
        button.classList.add(keyStates[mappedLetter]);
      }

      button.addEventListener("click", () => handleKey(label));
      rowEl.appendChild(button);
    });

    keyboard.appendChild(rowEl);
  });
}

function evaluateGuess(guess) {
  const result = Array(WORD_LENGTH).fill("miss");
  const secretLetters = state.secretWord.split("");
  const used = Array(WORD_LENGTH).fill(false);

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (guess[i] === secretLetters[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (result[i] === "correct") continue;

    const matchIndex = secretLetters.findIndex(
      (letter, idx) => !used[idx] && letter === guess[i]
    );

    if (matchIndex >= 0) {
      result[i] = "present";
      used[matchIndex] = true;
    }
  }

  return result;
}

function submitGuess() {
  if (state.colIndex < WORD_LENGTH) {
    setNotice("That word is too short.");
    return;
  }

  const guess = state.guesses[state.rowIndex].join("").toLowerCase();
  if (!isAllowedGuess(guess)) {
    setNotice("Try a real five-letter dictionary word.");
    return;
  }

  const evaluation = evaluateGuess(guess);
  state.evaluations[state.rowIndex] = evaluation;
  renderBoard();
  renderKeyboard();

  if (guess === state.secretWord) {
    state.gameOver = true;
    state.wins += 1;
    winsCount.textContent = String(state.wins);
    saveProgress();
    setNotice("You solved it. Hit New Word for another round.");
    return;
  }

  if (state.rowIndex === MAX_GUESSES - 1) {
    state.gameOver = true;
    setNotice(`The word was ${state.secretWord.toUpperCase()}. Tap New Word to try again.`);
    return;
  }

  state.rowIndex += 1;
  state.colIndex = 0;
  setNotice("Keep going. You still have more guesses.");
  syncNativeInput();
}

function handleKey(input) {
  if (state.gameOver) {
    return;
  }

  if (input === "ENTER") {
    submitGuess();
    return;
  }

  if (input === "BACK") {
    if (state.colIndex > 0) {
      state.colIndex -= 1;
      state.guesses[state.rowIndex][state.colIndex] = "";
      renderBoard();
      syncNativeInput();
    }
    return;
  }

  if (state.colIndex >= WORD_LENGTH) return;

  state.guesses[state.rowIndex][state.colIndex] = input;
  state.colIndex += 1;
  renderBoard();
  syncNativeInput();
}

function handleThemeChange() {
  state.activeTheme = themeSelect.value;
  saveProgress();
  resetGame();
}

document.addEventListener("keydown", (event) => {
  if (event.target === nativeInput) {
    return;
  }

  const key = event.key.toUpperCase();
  if (key === "BACKSPACE") {
    handleKey("BACK");
    return;
  }

  if (key === "ENTER") {
    handleKey("ENTER");
    return;
  }

  if (/^[A-Z]$/.test(key)) {
    handleKey(key);
  }
});

nativeInput.addEventListener("input", () => {
  if (state.gameOver) {
    nativeInput.value = "";
    return;
  }

  const letters = nativeInput.value
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, WORD_LENGTH)
    .split("");

  state.guesses[state.rowIndex] = Array.from(
    { length: WORD_LENGTH },
    (_, index) => letters[index] || ""
  );
  state.colIndex = letters.length;
  nativeInput.value = letters.join("");
  renderBoard();
});

nativeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submitGuess();
  }
});

board.addEventListener("click", focusNativeInput);
notice.addEventListener("click", focusNativeInput);
keyboard.addEventListener("click", focusNativeInput);

newGameTopButton.addEventListener("click", resetGame);
newGameButton.addEventListener("click", resetGame);
themeSelect.addEventListener("change", handleThemeChange);

loadProgress();
resetGame();
