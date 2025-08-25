const textInput = document.getElementById("textInput");
const charCount = document.getElementById("charCount");
const byteCount = document.getElementById("byteCount");
const lineCount = document.getElementById("lineCount");
const remaining = document.getElementById("remaining");
const maxCharsInput = document.getElementById("maxCharsInput");

const set280Btn = document.getElementById("set280Btn");
const set500Btn = document.getElementById("set500Btn");
const set1000Btn = document.getElementById("set1000Btn");
const setCustomBtn = document.getElementById("setCustomBtn");
const recentButtonsDiv = document.getElementById("recentButtons");
const clearRecentBtn = document.getElementById("clearRecentBtn");
const saveBtn = document.getElementById("saveBtn");

let MAX_CHARS = parseInt(maxCharsInput.value, 10);
let recentValues = JSON.parse(localStorage.getItem("recentMaxChars")) || [];

function countBytes(str) {
  return new TextEncoder().encode(str).length;
}

function updateCount() {
  let text = textInput.value;
  if (text.length > MAX_CHARS) {
    text = text.substring(0, MAX_CHARS);
    textInput.value = text;
  }

  const chars = text.length;
  const bytes = countBytes(text);
  const lines = text.split(/\n/).length;
  const remain = MAX_CHARS - chars;

  charCount.textContent = chars;
  byteCount.textContent = bytes;
  lineCount.textContent = lines;
  remaining.textContent = remain;

  if (remain < 0) {
    remaining.classList.add("warning");
  } else {
    remaining.classList.remove("warning");
  }

  textInput.style.height = "auto";
  textInput.style.height = textInput.scrollHeight + "px";
}

function setMaxChars(value) {
  MAX_CHARS = value;
  maxCharsInput.value = value;
  updateCount();
  addRecentValue(value);
}

function addRecentValue(value) {
  if (!recentValues.includes(value)) {
    recentValues.unshift(value);
    if (recentValues.length > 5) recentValues.pop();
    localStorage.setItem("recentMaxChars", JSON.stringify(recentValues));
    renderRecentButtons();
  }
}

function renderRecentButtons() {
  recentButtonsDiv.innerHTML = recentValues.length > 0 ? "最近使った上限: " : "";
  recentValues.forEach(val => {
    const btn = document.createElement("button");
    btn.textContent = val + "に設定";
    btn.addEventListener("click", () => setMaxChars(val));
    recentButtonsDiv.appendChild(btn);
  });
}

clearRecentBtn.addEventListener("click", () => {
  if (confirm("履歴を本当に削除しますか？")) {
    recentValues = [];
    localStorage.removeItem("recentMaxChars");
    renderRecentButtons();
  }
});

maxCharsInput.addEventListener("input", () => {
  MAX_CHARS = parseInt(maxCharsInput.value, 10) || 1;
  updateCount();
});

set280Btn.addEventListener("click", () => setMaxChars(280));
set500Btn.addEventListener("click", () => setMaxChars(500));
set1000Btn.addEventListener("click", () => setMaxChars(1000));

setCustomBtn.addEventListener("click", () => {
  const custom = prompt("上限文字数を入力してください:", MAX_CHARS);
  if (custom && !isNaN(custom) && custom > 0) {
    setMaxChars(parseInt(custom, 10));
  }
});

saveBtn.addEventListener("click", () => {
  let text = textInput.value;
  text += `\n\n© しのれーるらぼ / 制作者: 篠ノ井乗務区\nAll Rights Reserved / 無断転載禁止 / 利用は個人目的に限る / 商用利用禁止`;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const now = new Date();
  const timestamp = now.getFullYear().toString() +
                    ("0" + (now.getMonth()+1)).slice(-2) +
                    ("0" + now.getDate()).slice(-2) + "_" +
                    ("0" + now.getHours()).slice(-2) +
                    ("0" + now.getMinutes()).slice(-2) +
                    ("0" + now.getSeconds()).slice(-2);
  const randomNum = Math.floor(Math.random()*10000);
  a.download = `text_${timestamp}_${randomNum}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

textInput.addEventListener("input", updateCount);
window.addEventListener("load", () => {
  renderRecentButtons();
  updateCount();
});
