const canvas = document.getElementById("playfield");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const menu = document.getElementById("menu");
const menuHit = document.getElementById("menuHit");
const menuSpawn = document.getElementById("menuSpawn");

// ═══════════════════════════════════════════════
//  SOUND ENGINE  (Web Audio API — no files needed)
// ═══════════════════════════════════════════════
let audioCtx = null;

function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

// Generic synth helper: plays a shaped tone
function playTone({ freq = 440, freq2 = null, type = "sine", gain = 0.3, attack = 0.004,
                    decay = 0.08, sustain = 0.0, release = 0.12, duration = 0.22,
                    detune = 0, filterFreq = null, filterType = "lowpass" } = {}) {
  const ac = getAudio();
  const now = ac.currentTime;

  const osc = ac.createOscillator();
  const gainNode = ac.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (freq2) osc.frequency.exponentialRampToValueAtTime(freq2, now + duration);
  osc.detune.setValueAtTime(detune, now);

  // Envelope
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(gain, now + attack);
  gainNode.gain.linearRampToValueAtTime(gain * sustain || gain * 0.3, now + attack + decay);
  gainNode.gain.linearRampToValueAtTime(0, now + attack + decay + release);

  let node = gainNode;

  if (filterFreq) {
    const filter = ac.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, now);
    gainNode.connect(filter);
    filter.connect(ac.destination);
    node = gainNode;
  } else {
    gainNode.connect(ac.destination);
  }

  osc.connect(gainNode);
  osc.start(now);
  osc.stop(now + attack + decay + release + 0.05);
}

// Noise burst (for punchy hits)
function playNoise({ gain = 0.15, duration = 0.06, filterFreq = 800, filterType = "bandpass", filterQ = 1 } = {}) {
  const ac = getAudio();
  const now = ac.currentTime;
  const bufferSize = ac.sampleRate * duration;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ac.createBufferSource();
  source.buffer = buffer;

  const filter = ac.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.setValueAtTime(filterFreq, now);
  filter.Q.setValueAtTime(filterQ, now);

  const gainNode = ac.createGain();
  gainNode.gain.setValueAtTime(gain, now);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ac.destination);
  source.start(now);
  source.stop(now + duration);
}

// ─── Individual sound events ───────────────────

// Floor bounce: thuddy low thump, pitch scales with impact speed
function soundFloorBounce(impact) {
  const speed = Math.min(impact, 20);
  const freq = 80 + speed * 4;
  playTone({ freq, freq2: freq * 0.5, type: "sine", gain: 0.25 + speed * 0.012,
             attack: 0.003, decay: 0.06, release: 0.14, duration: 0.2,
             filterFreq: 300 + speed * 10, filterType: "lowpass" });
  playNoise({ gain: 0.08 + speed * 0.004, duration: 0.04, filterFreq: 200 + speed * 8, filterType: "bandpass", filterQ: 0.8 });
}

// Wall bounce: sharper mid-range thwack
function soundWallBounce(speed) {
  const s = Math.min(Math.abs(speed), 15);
  playTone({ freq: 220 + s * 10, freq2: 180 + s * 6, type: "triangle", gain: 0.18 + s * 0.008,
             attack: 0.002, decay: 0.04, release: 0.09, duration: 0.14 });
  playNoise({ gain: 0.06 + s * 0.003, duration: 0.03, filterFreq: 500 + s * 30, filterType: "bandpass", filterQ: 2 });
}

// Ceiling bounce: high airy ping
function soundCeilingBounce() {
  playTone({ freq: 600, freq2: 400, type: "sine", gain: 0.15,
             attack: 0.003, decay: 0.05, release: 0.18, duration: 0.24 });
}

// Ball clicked: soft tap
function soundBallClick() {
  playTone({ freq: 520, freq2: 480, type: "sine", gain: 0.18,
             attack: 0.002, decay: 0.04, release: 0.1, duration: 0.14 });
  playNoise({ gain: 0.05, duration: 0.025, filterFreq: 1200, filterType: "bandpass", filterQ: 3 });
}

// Menu open: soft whoosh up
function soundMenuOpen() {
  playTone({ freq: 300, freq2: 600, type: "sine", gain: 0.1,
             attack: 0.01, decay: 0.08, release: 0.12, duration: 0.18 });
}

// Menu close / dismiss
function soundMenuClose() {
  playTone({ freq: 400, freq2: 200, type: "sine", gain: 0.07,
             attack: 0.005, decay: 0.05, release: 0.08, duration: 0.12 });
}

// Hit action: powerful smack
function soundHit() {
  playTone({ freq: 160, freq2: 60, type: "sawtooth", gain: 0.3,
             attack: 0.002, decay: 0.07, release: 0.18, duration: 0.24,
             filterFreq: 600, filterType: "lowpass" });
  playNoise({ gain: 0.22, duration: 0.07, filterFreq: 400, filterType: "bandpass", filterQ: 1 });
  // punchy high layer
  playTone({ freq: 900, freq2: 300, type: "sine", gain: 0.12,
             attack: 0.001, decay: 0.03, release: 0.06, duration: 0.09 });
}

// Spawn action: magical shimmer (ascending arpeggiated tones)
function soundSpawn() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => {
    setTimeout(() => {
      playTone({ freq: f, freq2: f * 1.05, type: "sine", gain: 0.14,
                 attack: 0.005, decay: 0.06, release: 0.14, duration: 0.18 });
    }, i * 45);
  });
  playNoise({ gain: 0.04, duration: 0.12, filterFreq: 4000, filterType: "highpass", filterQ: 1 });
}

// Start button: warm boot-up chime
function soundStart() {
  const notes = [261, 329, 392, 523];
  notes.forEach((f, i) => {
    setTimeout(() => {
      playTone({ freq: f, type: "sine", gain: 0.16,
                 attack: 0.01, decay: 0.1, release: 0.2, duration: 0.28 });
    }, i * 70);
  });
}

// Ball-ball collision: light clink
function soundBallCollision(speed) {
  const s = Math.min(speed, 15);
  playTone({ freq: 700 + s * 20, freq2: 600 + s * 10, type: "sine", gain: 0.12 + s * 0.006,
             attack: 0.002, decay: 0.03, release: 0.1, duration: 0.13 });
}

// ═══════════════════════════════════════════════
//  PHYSICS & RENDERING
// ═══════════════════════════════════════════════

const GRAVITY = 0.42;
const AIR_DRAG = 0.0012;
const GROUND_BOUNCE = 0.76;
const WALL_BOUNCE = 0.88;
const BALL_COLORS = [
  { top: "#fffaf1", mid: "#f6c98e", bot: "#db8f56" },
  { top: "#fff0f0", mid: "#f6a0a0", bot: "#c95050" },
  { top: "#f0f8ff", mid: "#90c8f0", bot: "#4090c0" },
  { top: "#f5fff0", mid: "#90e0a0", bot: "#3a9a50" },
  { top: "#fff8e0", mid: "#f0d060", bot: "#c09020" },
  { top: "#fdf0ff", mid: "#d090f0", bot: "#8040c0" },
];

let balls = [];
let started = false;
let selectedBall = null;

function createBall(x, y, vx, vy, colorIdx) {
  return {
    x: x ?? canvas.clientWidth / 2,
    y: y ?? -60,
    radius: 38,
    vx: vx ?? (Math.random() * 3 - 1.5),
    vy: vy ?? 0,
    rotation: 0,
    squishY: 1,
    squishX: 1,
    colorIdx: colorIdx ?? Math.floor(Math.random() * BALL_COLORS.length),
    // throttle flags so we don't spam sounds every frame
    _lastFloor: 0,
    _lastWall: 0,
    _lastCeil: 0,
  };
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function updateBall(ball) {
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  const floor = H - 60;
  const now = performance.now();

  ball.vy += GRAVITY;
  ball.vx *= (1 - AIR_DRAG);
  ball.vy *= (1 - AIR_DRAG * 0.4);
  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.rotation += 0.04 * Math.sign(ball.vx || 1);

  // Wall bounce
  if (ball.x + ball.radius >= W) {
    ball.x = W - ball.radius;
    const prevVx = ball.vx;
    ball.vx *= -WALL_BOUNCE;
    ball.squishX = Math.max(0.7, 1 - Math.abs(ball.vx) * 0.018);
    if (now - ball._lastWall > 80) { soundWallBounce(prevVx); ball._lastWall = now; }
  } else if (ball.x - ball.radius <= 0) {
    ball.x = ball.radius;
    const prevVx = ball.vx;
    ball.vx *= -WALL_BOUNCE;
    ball.squishX = Math.max(0.7, 1 - Math.abs(ball.vx) * 0.018);
    if (now - ball._lastWall > 80) { soundWallBounce(prevVx); ball._lastWall = now; }
  } else {
    ball.squishX += (1 - ball.squishX) * 0.18;
  }

  // Floor bounce
  if (ball.y + ball.radius >= floor) {
    ball.y = floor - ball.radius;
    const impact = Math.abs(ball.vy);
    ball.vy *= -GROUND_BOUNCE;
    ball.vx *= 0.993;
    ball.squishY = Math.max(0.62, 1 - impact * 0.022);
    ball.squishX = 1 + (1 - ball.squishY) * 0.9;
    if (impact > 1.0 && now - ball._lastFloor > 80) {
      soundFloorBounce(impact);
      ball._lastFloor = now;
    }
    if (Math.abs(ball.vy) < 1.4) ball.vy = -7;
  } else {
    ball.squishY += (1 - ball.squishY) * 0.14;
    ball.squishX += (1 - ball.squishX) * 0.14;
  }

  // Ceiling
  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius;
    const prevVy = ball.vy;
    ball.vy *= -0.7;
    if (now - ball._lastCeil > 120) { soundCeilingBounce(); ball._lastCeil = now; }
  }
}

// Simple ball-ball collision (sound + push)
function resolveBallCollisions() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i], b = balls[j];
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = a.radius + b.radius;
      if (dist < minDist && dist > 0) {
        const nx = dx / dist, ny = dy / dist;
        const overlap = minDist - dist;
        a.x -= nx * overlap * 0.5;
        a.y -= ny * overlap * 0.5;
        b.x += nx * overlap * 0.5;
        b.y += ny * overlap * 0.5;

        const relV = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (relV < 0) {
          const restitution = 0.7;
          const impulse = -(1 + restitution) * relV / 2;
          a.vx -= impulse * nx; a.vy -= impulse * ny;
          b.vx += impulse * nx; b.vy += impulse * ny;
          const speed = Math.abs(relV);
          if (speed > 1) soundBallCollision(speed);
        }
      }
    }
  }
}

function drawBall(ball) {
  const col = BALL_COLORS[ball.colorIdx];
  ctx.save();
  ctx.translate(ball.x, ball.y);
  ctx.rotate(ball.rotation);
  ctx.scale(ball.squishX, ball.squishY);

  const fill = ctx.createRadialGradient(-ball.radius * 0.28, -ball.radius * 0.35, ball.radius * 0.1, 0, 0, ball.radius);
  fill.addColorStop(0, col.top);
  fill.addColorStop(0.38, col.mid);
  fill.addColorStop(1, col.bot);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.52)";
  ctx.beginPath();
  ctx.ellipse(-ball.radius * 0.3, -ball.radius * 0.38, ball.radius * 0.3, ball.radius * 0.2, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const H = canvas.clientHeight;
  const floor = H - 60;
  const distToFloor = Math.max(0, floor - ball.y - ball.radius);
  const shadowAlpha = Math.max(0, 0.22 - distToFloor * 0.0004);
  const shadowScale = Math.max(0.3, 1 - distToFloor * 0.002);
  ctx.fillStyle = `rgba(0,0,0,${shadowAlpha})`;
  ctx.beginPath();
  ctx.ellipse(ball.x, floor + 10, ball.radius * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBackground() {
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  const floor = H - 60;

  ctx.clearRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, H * 0.6);
  glow.addColorStop(0, "rgba(180, 110, 50, 0.18)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const ground = ctx.createLinearGradient(0, floor, 0, H);
  ground.addColorStop(0, "#6b4225");
  ground.addColorStop(1, "#3e2310");
  ctx.fillStyle = ground;
  ctx.beginPath();
  ctx.roundRect(0, floor, W, H - floor, [0, 0, 20, 20]);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 200, 130, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, floor);
  ctx.lineTo(W, floor);
  ctx.stroke();
}

function render() {
  drawBackground();
  for (const ball of balls) drawBall(ball);
}

function animate() {
  if (started) {
    for (const ball of balls) updateBall(ball);
    resolveBallCollisions();
  }
  render();
  requestAnimationFrame(animate);
}

// ─── Click detection ───────────────────────────

function getBallAt(cx, cy) {
  for (let i = balls.length - 1; i >= 0; i--) {
    const b = balls[i];
    const dx = cx - b.x, dy = cy - b.y;
    if (Math.sqrt(dx * dx + dy * dy) <= b.radius + 6) return b;
  }
  return null;
}

function showMenu(screenX, screenY, ball) {
  selectedBall = ball;
  const wrap = canvas.parentElement.getBoundingClientRect();
  let lx = screenX - wrap.left + 12;
  let ly = screenY - wrap.top - 20;
  lx = Math.min(lx, wrap.width - 130);
  ly = Math.min(ly, wrap.height - 100);
  menu.style.left = lx + "px";
  menu.style.top = ly + "px";
  menu.classList.remove("hidden");
  soundMenuOpen();
}

function hideMenu(playSound = true) {
  if (!menu.classList.contains("hidden") && playSound) soundMenuClose();
  menu.classList.add("hidden");
  selectedBall = null;
}

canvas.addEventListener("click", (e) => {
  if (!started) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.clientWidth / rect.width;
  const scaleY = canvas.clientHeight / rect.height;
  const cx = (e.clientX - rect.left) * scaleX;
  const cy = (e.clientY - rect.top) * scaleY;

  const hit = getBallAt(cx, cy);
  if (hit) {
    soundBallClick();
    showMenu(e.clientX, e.clientY, hit);
  } else {
    hideMenu();
  }
});

menuHit.addEventListener("click", () => {
  if (!selectedBall) return;
  selectedBall.vx = (Math.random() * 16 - 8);
  selectedBall.vy = -(Math.random() * 10 + 8);
  selectedBall.squishY = 0.65;
  selectedBall.squishX = 1.3;
  soundHit();
  hideMenu(false);
});

menuSpawn.addEventListener("click", () => {
  if (!selectedBall) return;
  const newColorIdx = (selectedBall.colorIdx + 1 + Math.floor(Math.random() * (BALL_COLORS.length - 1))) % BALL_COLORS.length;
  balls.push(createBall(
    selectedBall.x + (Math.random() * 40 - 20),
    selectedBall.y - 60,
    Math.random() * 4 - 2,
    -2,
    newColorIdx
  ));
  soundSpawn();
  hideMenu(false);
});

document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && e.target !== canvas) hideMenu();
});

startButton.addEventListener("click", () => {
  started = true;
  balls = [createBall(canvas.clientWidth / 2, -60, 1.5, 0, 0)];
  startButton.classList.add("is-hidden");
  soundStart();
});

window.addEventListener("resize", () => { resizeCanvas(); render(); });

resizeCanvas();
render();
requestAnimationFrame(animate);
