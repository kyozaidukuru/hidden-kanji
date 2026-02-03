let selectedGrades = [];
let selectedTerms = [];
let selectedKanji = [];
let gridSize = 6;

const gradeButtonsDiv = document.getElementById("gradeButtons");
const termButtonsDiv = document.getElementById("termButtons");
const kanjiListDiv = document.getElementById("kanjiList");

// ★ 漢字を全部選択ボタン
document.getElementById("selectAllKanjiBtn").onclick = () => {
  document.querySelectorAll("#kanjiList span").forEach(span => {
    span.classList.add("selected");
  });
};

// ===== 学年ボタン生成 =====
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

// ===== 学期表示（※ 全部ボタンは無し） =====
function renderTerms() {
  termButtonsDiv.innerHTML = "";
  selectedTerms = [];

  selectedGrades.forEach(g => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<strong>${g}年</strong> `;

    for (let term in kanjiData[g]) {
      if (g === "1" && term === "1学期") continue;

      const btn = document.createElement("button");
      btn.textContent = term;
      btn.onclick = () => toggleTerm(g, term, btn);
      wrapper.appendChild(btn);
    }

    termButtonsDiv.appendChild(wrapper);
  });
}

function toggleTerm(g, term, btn) {
  const key = `${g}-${term}`;
  if (selectedTerms.includes(key)) {
    selectedTerms = selectedTerms.filter(x => x !== key);
    btn.classList.remove("active");
  } else {
    selectedTerms.push(key);
    btn.classList.add("active");
  }
  renderKanjiList();
}

// ===== 漢字一覧表示 =====
function renderKanjiList() {
  kanjiListDiv.innerHTML = "";
  selectedKanji = [];

  selectedTerms.forEach(key => {
    const [g, term] = key.split("-");
    const grade = Number(g);

    kanjiData[grade][term].forEach(k => {
      if (!selectedKanji.includes(k)) selectedKanji.push(k);
    });
  });

  selectedKanji.forEach(k => {
    const span = document.createElement("span");
    span.textContent = k;
    span.onclick = () => span.classList.toggle("selected");
    kanjiListDiv.appendChild(span);
  });
}

// ===== マス数ボタン =====
document.querySelectorAll(".gridBtn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".gridBtn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    gridSize = Number(btn.dataset.grid);
  };
});

// ===== 配列シャッフル =====
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ===== スタートボタン（選んだ漢字だけ出題） =====
document.getElementById("startBtn").onclick = () => {
  const picked = [];

  document.querySelectorAll("#kanjiList span.selected").forEach(span => {
    picked.push(span.textContent);
  });

  if (picked.length === 0) {
    alert("出題する漢字を選択してください");
    return;
  }

  shuffle(picked);

  localStorage.setItem("kanjiList", JSON.stringify(picked));
  localStorage.setItem("gridSize", gridSize);
  localStorage.setItem("qIndex", 0);
  location.href = "play.html";
};
