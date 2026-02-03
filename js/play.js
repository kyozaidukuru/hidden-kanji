const kanjiList = JSON.parse(localStorage.getItem("kanjiList") || "[]");
let qIndex = Number(localStorage.getItem("qIndex") || 0);
const gridSize = Number(localStorage.getItem("gridSize") || 6);
const limitCount = Number(localStorage.getItem("limitCount") || 0);

const qNum = document.getElementById("qNum");
const kanjiChar = document.getElementById("kanjiChar");
const coverGrid = document.getElementById("coverGrid");
const scoreDisplay = document.getElementById("scoreDisplay");
const totalDisplay = document.getElementById("totalScore");

let openedCount = 0;
let totalScore = Number(localStorage.getItem("totalScore") || 0);

const scoreTable = {
  4: [null, 10, 6, 3, 0],
  6: [null, 10, 8, 6, 4, 2, 0],
  9: [null, 10, 9, 7, 6, 4, 3, 2, 1, 0]
};

function loadQuestion() {
  openedCount = 0;
  qNum.textContent = `第${qIndex + 1}問`;
  kanjiChar.textContent = kanjiList[qIndex];
  buildCovers();
  updateScore();
  totalDisplay.textContent = `合計得点：${totalScore}点`;
}

function buildCovers() {
  coverGrid.innerHTML = "";
  let rows, cols;
  if (gridSize === 4) [rows, cols] = [2, 2];
  if (gridSize === 6) [rows, cols] = [3, 2];
  if (gridSize === 9) [rows, cols] = [3, 3];

  coverGrid.style.gridTemplateRows = `repeat(${rows},1fr)`;
  coverGrid.style.gridTemplateColumns = `repeat(${cols},1fr)`;

  for (let i = 0; i < gridSize; i++) {
    const div = document.createElement("div");
    div.className = "cover";
    div.onclick = () => {
      if (!div.classList.contains("hidden")) {
        div.classList.add("hidden");
        openedCount++;
        updateScore();
      }
    };
    coverGrid.appendChild(div);
  }
}

function updateScore() {
  if (openedCount === 0) {
    scoreDisplay.textContent = "";
    return;
  }
  const score = scoreTable[gridSize][openedCount];
  scoreDisplay.textContent = `現在の得点：${score}点`;
}

function finalizeScore() {
  if (openedCount === 0) return;
  const score = scoreTable[gridSize][openedCount];
  totalScore += score;
  localStorage.setItem("totalScore", totalScore);
}

document.getElementById("answerBtn").onclick = () => {
  document.querySelectorAll(".cover").forEach(c => c.classList.add("hidden"));
};

document.getElementById("nextBtn").onclick = () => {
  finalizeScore();
  qIndex++;
  if ((limitCount && qIndex >= limitCount) || qIndex >= kanjiList.length) {
    alert(`終了！ 合計得点：${totalScore}点`);
    localStorage.removeItem("totalScore");
    location.href = "index.html";
  } else {
    localStorage.setItem("qIndex", qIndex);
    loadQuestion();
  }
};

loadQuestion();
