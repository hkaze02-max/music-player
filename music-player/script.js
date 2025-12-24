let songs = [];
let index = 0;

const audio = new Audio();

const fileInput = document.getElementById("fileInput");
const loadBtn = document.getElementById("loadBtn");

const title = document.getElementById("title");
const artist = document.getElementById("artist");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const progress = document.getElementById("progress");

/* =========================
   FILE PICKER
========================= */

loadBtn.onclick = () => fileInput.click();

fileInput.onchange = (e) => {
  const files = Array.from(e.target.files);

  songs = files.map(file => ({
    title: file.name.replace(/\.[^/.]+$/, "").toUpperCase(),
    artist: "LOCAL FILE",
    src: URL.createObjectURL(file)
  }));

  index = 0;
  loadSong(index);
};

/* =========================
   PLAYER LOGIC
========================= */

function loadSong(i) {
  if (!songs.length) return;
  audio.src = songs[i].src;
  title.textContent = songs[i].title;
  artist.textContent = songs[i].artist;
  playBtn.textContent = "▶";
}

playBtn.onclick = () => {
  if (!audioCtx) {
    setupVisualizer();
    drawVisualizer();
  }

  if (audio.paused) {
    audio.play();
    audioCtx.resume();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶";
  }
};

prevBtn.onclick = () => {
  if (!songs.length) return;
  index = (index - 1 + songs.length) % songs.length;
  loadSong(index);
  audio.play();
  playBtn.textContent = "⏸";
};

nextBtn.onclick = () => {
  if (!songs.length) return;
  index = (index + 1) % songs.length;
  loadSong(index);
  audio.play();
  playBtn.textContent = "⏸";
};

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

/* =========================
   VISUALIZER
========================= */

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

let audioCtx;
let analyser;
let source;
let dataArray;

function setupVisualizer() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();

  source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 64;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
}

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);

  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = 6;
  const gap = 2;

  for (let i = 0; i < 20; i++) {
    const value = dataArray[i];
    const barHeight = value / 4;

    ctx.fillStyle = "#00ff88";
    ctx.fillRect(
      i * (barWidth + gap),
      canvas.height - barHeight,
      barWidth,
      barHeight
    );
  }
}