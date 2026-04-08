// ブラウザがデータを認識するまで少し待つか、windowから確実に取得する
const getKanjiData = () => {
  const k = window.kanjiData || {};
  const j = window.juniorKanjiData || {};
  return { ...k, ...j };
};

const allKanjiData = getKanjiData();

let selectedGrades = [];
let selectedTerms = [];
let selectedKanji = [];
let gridSize = 6;
let limitCount = 0;

const gradeButtonsDiv = document.getElementById("gradeButtons");
const termButtonsDiv = document.getElementById("termButtons");
const kanjiListDiv = document.getElementById("kanjiList");

// ===== ① カテゴリーボタン生成（データがあるか確認してから回す） =====
if (Object.keys(allKanjiData).length === 0) {
  console.error("データが読み込めていません。kanjiData.jsのパスや中身を確認してください。");
}

for (let g in allKanjiData) {
  const btn = document.createElement("button");
  // 数字なら「年」を付け、それ以外（あ、か…）ならそのまま
  btn.textContent = isNaN(g) ? g : g + "年";
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

// ===== ② 学期または50音リストの描画 =====
function renderTerms() {
  termButtonsDiv.innerHTML = "";
  
  // 選択解除されたカテゴリーのTermを掃除
  selectedTerms = selectedTerms.filter(key => {
    const [g] = key.split("-");
    return selectedGrades.includes(g);
  });

  selectedGrades.forEach(g => {
    const data = allKanjiData[g];
    if (!data) return;

    const wrapper = document.createElement("div");
    const label = isNaN(g) ? g : `${g}年`;
    wrapper.innerHTML = `<strong>${label}</strong> `;

    // 配列（中学生）かオブジェクト（小学生）かで分岐
    if (Array.isArray(data)) {
      const btn = document.createElement("button");
      btn.textContent = "全表示";
      const key = `${g}-ALL`;
      if (selectedTerms.includes(key)) btn.classList.add("active");
      btn.onclick = () => toggleTerm(g, "ALL", btn);
      wrapper.appendChild(btn);
    } else {
      for (let term in data) {
        if (g === "1" && term === "1学期" && data[term].length === 0) continue;
        const btn = document.createElement("button");
        btn.textContent = term;
        const key = `${g}-${term}`;
        if (selectedTerms.includes(key)) btn.classList.add("active");
        btn.onclick = () => toggleTerm(g, term, btn);
        wrapper.appendChild(btn);
      }
    }
    termButtonsDiv.appendChild(wrapper);
  });
  renderKanjiList();
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

// ===== ③ 漢字一覧描画 =====
function renderKanjiList() {
  kanjiListDiv.innerHTML = "";
  selectedKanji = [];

  selectedTerms.forEach(key => {
    const [g, term] = key.split("-");
    const data = allKanjiData[g];

    if (term === "ALL") {
      data.forEach(k => {
        if (!selectedKanji.includes(k)) selectedKanji.push(k);
      });
    } else if (data[term]) {
      data[term].forEach(k => {
        if (!selectedKanji.includes(k)) selectedKanji.push(k);
      });
    }
  });

  selectedKanji.forEach(k => {
    const span = document.createElement("span");
    span.textContent = k;
    span.onclick = () => span.classList.toggle("selected");
    kanjiListDiv.appendChild(span);
  });
}

// ===== 各種ボタンイベント =====
document.getElementById("selectAllKanjiBtn").onclick = () => {
  document.querySelectorAll("#kanjiList span").forEach(span => {
    span.classList.add("selected");
  });
};

document.querySelectorAll(".gridBtn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".gridBtn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    gridSize = Number(btn.dataset.grid);
  };
});

document.querySelectorAll(".countBtn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".countBtn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    limitCount = Number(btn.dataset.count);
  };
});

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

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
  localStorage.setItem("totalScore", 0);
  localStorage.setItem("limitCount", limitCount);

  location.href = "play.html";
};
