const allKanjiData = { 
  ...(typeof kanjiData !== 'undefined' ? kanjiData : {}), 
  ...(typeof juniorKanjiData !== 'undefined' ? juniorKanjiData : {}) 
};

let selectedGrades = [];
let selectedTerms = [];
let selectedKanji = [];
let gridSize = 6;
let limitCount = 0;

const gradeButtonsDiv = document.getElementById("gradeButtons");
const termButtonsDiv = document.getElementById("termButtons");
const kanjiListDiv = document.getElementById("kanjiList");

// ===== ① カテゴリーボタン（学年・50音）生成 =====
for (let g in allKanjiData) {
  const btn = document.createElement("button");
  // 数字（1〜6）なら「年」を付け、それ以外（あ、か…）ならそのまま表示
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
  
  // 選択が解除された学年・カテゴリーに対応するTermを掃除する
  selectedTerms = selectedTerms.filter(key => {
    const [g] = key.split("-");
    return selectedGrades.includes(g);
  });

  selectedGrades.forEach(g => {
    const data = allKanjiData[g];
    const wrapper = document.createElement("div");
    
    // 見出しのラベル
    const label = isNaN(g) ? g : `${g}年`;
    wrapper.innerHTML = `<strong>${label}</strong> `;

    // データが配列（中学生：あ、か…）の場合
    if (Array.isArray(data)) {
      const btn = document.createElement("button");
      btn.textContent = "全表示";
      const key = `${g}-ALL`;
      
      if (selectedTerms.includes(key)) btn.classList.add("active");
      
      btn.onclick = () => toggleTerm(g, "ALL", btn);
      wrapper.appendChild(btn);
    } 
    // データがオブジェクト（小学生：1学期、2学期…）の場合
    else {
      for (let term in data) {
        // 1年生の1学期データが空の場合はスキップ（既存仕様）
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
      // 中学生用：配列をそのまま結合
      data.forEach(k => {
        if (!selectedKanji.includes(k)) selectedKanji.push(k);
      });
    } else {
      // 小学生用：学期指定で結合
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

// ===== 漢字を全部選択ボタン =====
document.getElementById("selectAllKanjiBtn").onclick = () => {
  document.querySelectorAll("#kanjiList span").forEach(span => {
    span.classList.add("selected");
  });
};

// ===== マス数ボタン =====
document.querySelectorAll(".gridBtn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".gridBtn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    gridSize = Number(btn.dataset.grid);
  };
});

// ===== 出題数ボタン =====
document.querySelectorAll(".countBtn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".countBtn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    limitCount = Number(btn.dataset.count);
  };
});

// ===== シャッフル関数 =====
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ===== スタートボタン =====
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

  // 前回のセッション情報をクリアするために上書き
  localStorage.setItem("kanjiList", JSON.stringify(picked));
  localStorage.setItem("gridSize", gridSize);
  localStorage.setItem("qIndex", 0);
  localStorage.setItem("totalScore", 0);
  localStorage.setItem("limitCount", limitCount);

  location.href = "play.html";
};
