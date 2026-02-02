let selectedGrades = [];
let selectedTerms = [];
let selectedKanji = [];
let gridSize = 6;

const gradeButtonsDiv = document.getElementById("gradeButtons");
const termButtonsDiv = document.getElementById("termButtons");
const kanjiListDiv = document.getElementById("kanjiList");

for (let g in kanjiData) {
  const btn = document.createElement("button");
  btn.textContent = g + "年";
  btn.onclick = () => toggleGrade(g, btn);
  gradeButtonsDiv.appendChild(btn);
}

function toggleGrade(g, btn) {
  if (selectedGrades.includes(g)) {
    selectedGrades = selectedGrades.filter(x => x !== g);
    btn.classList.remove("active");
  } else {
    selectedGrades.push(g);
    btn.classList.add("active");
  }
  renderTerms();
}

function renderTerms() {
  termButtonsDiv.innerHTML = "";
  selectedTerms = [];
  selectedGrades.forEach(g => {
    for (let term in kanjiData[g]) {
      const btn = document.createElement("button");
      btn.textContent = g + "年 " + term;
      btn.onclick = () => toggleTerm(g, term, btn);
      termButtonsDiv.appendChild(btn);
    }
  });
}

function toggleTerm(g, term, btn) {
  const key = g + "-" + term;
  if (selectedTerms.includes(key)) {
    selectedTerms = selectedTerms.filter(x => x !== key);
    btn.classList.remove("active");
  } else {
    selectedTerms.push(key);
    btn.classList.add("active");
  }
  renderKanjiList();
}

function renderKanjiList() {
  kanjiListDiv.innerHTML = "";
  selectedKanji = [];
  selectedTerms.forEach(key => {
    const [g, term] = key.split("-");
    kanjiData[g][term].forEach(k => {
      const span = document.createElement("span");
      span.textContent = k;
      span.onclick = () => {
        span.classList.toggle("selected");
        if (selectedKanji.includes(k)) {
          selectedKanji = selectedKanji.filter(x => x !== k);
        } else {
          selectedKanji.push(k);
        }
      };
      kanjiListDiv.appendChild(span);
    });
  });
}

document.querySelectorAll(".gridBtn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".gridBtn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    gridSize = Number(btn.dataset.grid);
  };
});

document.getElementById("randomBtn").onclick = () => {
  selectedKanji = [];
  for (let g in kanjiData) {
    for (let t in kanjiData[g]) {
      selectedKanji.push(...kanjiData[g][t]);
    }
  }
};

document.getElementById("startBtn").onclick = () => {
  localStorage.setItem("kanjiList", JSON.stringify(selectedKanji));
  localStorage.setItem("gridSize", gridSize);
  localStorage.setItem("qIndex", 0);
  location.href = "play.html";
};
