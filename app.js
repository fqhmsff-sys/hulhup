const audioFiles = ["audio/hulhup-01.m4a","audio/hulhup-02.m4a"];
const audioPool = audioFiles.map(src => {
  const a = new Audio();
  a.preload = "auto";
  a.src = src;
  a.load();
  return a;
});

const counterEl = document.getElementById("counter");
const button = document.getElementById("speakerButton");
let count = Number.parseInt(localStorage.getItem("hulhup-count") || "0", 10);
let lastIndex = -1;

if (counterEl) counterEl.textContent = Number.isFinite(count) ? count : 0;

function randomIndex() {
  if (audioPool.length < 2) return 0;
  let i = Math.floor(Math.random() * audioPool.length);
  while (i === lastIndex) i = Math.floor(Math.random() * audioPool.length);
  return i;
}

async function playRandomAudio() {
  const index = randomIndex();
  lastIndex = index;
  const audio = audioPool[index];

  audio.currentTime = 0;
  button.classList.add("playing");
  try {
    await audio.play();
  } catch (_) {
    // Browser autoplay policy can reject playback before a valid user gesture.
  }

  const clear = () => button.classList.remove("playing");
  audio.addEventListener("ended", clear, {once:true});
  window.setTimeout(clear, 2600);
}

if (button) {
  button.addEventListener("pointerdown", () => button.classList.add("pressed"));
  ["pointerup","pointercancel","pointerleave"].forEach(type => {
    button.addEventListener(type, () => button.classList.remove("pressed"));
  });
  button.addEventListener("click", async () => {
    count += 1;
    localStorage.setItem("hulhup-count", String(count));
    if (counterEl) counterEl.textContent = count;
    await playRandomAudio();
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
