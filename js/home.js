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
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<strong>${g}年</strong> `;

    for (let term in kanjiData[g]) {

      // ★ 1年生の「1学期」は表示しない
      if (g === "1" && term === "1学期") continue;

      const btn = document.createElement("button");
      btn.textContent = term;
      btn.onclick = () => toggleTerm(g, term, btn);
      wrapper.appendChild(btn);
    }

    // ★ 全選択ボタン
    const allBtn = document.createElement("button");
    allBtn.textContent = "全部";
    allBtn.onclick = () => {
      for (let term in kanjiData[g]) {
        if (g === "1" && term === "1学期") continue;

        const key = `${g}-${term}`;
        if (!selectedTerms.includes(key)) selectedTerms.push(key);
      }
      renderKanjiList();
      renderTerms();
    };
    wrapper.appendChild(allBtn);

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

function renderKanjiList() {
  kanjiListDiv.innerHTML = "";
  selectedKanji = [];

  selectedTerms.forEach(key => {
    const [g, term] = key.split("-");
    kanjiData[g][term].forEach(k => {
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

document.querySelectorAll(".gridBtn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".gridBtn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    gridSize = Number(btn.dataset.grid);
  };
});

/* ===== ここから追加部分 ===== */

// 配列をシャッフルする関数
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// スタートボタン処理（ランダム順にしてから出題開始）
document.getElementById("startBtn").onclick = () => {
  shuffle(selectedKanji); // ← 並び順をランダムに
  localStorage.setItem("kanjiList", JSON.stringify(selectedKanji));
  localStorage.setItem("gridSize", gridSize);
  localStorage.setItem("qIndex", 0);
  location.href = "play.html";
};
