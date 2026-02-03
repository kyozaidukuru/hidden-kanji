const kanjiList = JSON.parse(localStorage.getItem("kanjiList") || "[]");
let qIndex = Number(localStorage.getItem("qIndex") || 0);
const gridSize = Number(localStorage.getItem("gridSize") || 6);

const qNum = document.getElementById("qNum");
const kanjiChar = document.getElementById("kanjiChar");
const coverGrid = document.getElementById("coverGrid");
const scoreDisplay = document.getElementById("scoreDisplay");

let openedCount = 0;
let initialScore = gridSize === 9 ? 10 : gridSize;

function loadQuestion() {
  openedCount = 0;
  qNum.textContent = `第${qIndex + 1}問`;
  kanjiChar.textContent = kanjiList[qIndex];
  buildCovers();
  updateScore();
}

function buildCovers() {
  coverGrid.innerHTML = "";
  let rows, cols;
  if (gridSize === 4) [rows, cols] = [2, 2];
  if (gridSize === 6) [rows, cols] = [2, 3];
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
  let score = initialScore - openedCount;
  if (score < 1) score = 1;
  scoreDisplay.textContent = `現在の得点：${score}点`;
}

document.getElementById("answerBtn").onclick = () => {
  document.querySelectorAll(".cover").forEach(c => c.classList.add("hidden"));
};

document.getElementById("nextBtn").onclick = () => {
  qIndex++;
  if (qIndex >= kanjiList.length) {
    alert("終了です！");
    location.href = "index.html";
  } else {
    localStorage.setItem("qIndex", qIndex);
    loadQuestion();
  }
};

loadQuestion();
