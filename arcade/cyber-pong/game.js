const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scorePlayerEl = document.getElementById('score-player');
const scoreAiEl = document.getElementById('score-ai');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const winnerText = document.getElementById('winner-text');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

// Game constants
const WIN_SCORE = 5;
const PADDLE_WIDTH = 12;
const BALL_SIZE = 12;
const INITIAL_BALL_SPEED = 2.8;
const MAX_BALL_SPEED = 14;

const DIFFICULTIES = {
  easy: { playerHeight: 110, aiHeight: 60, playerSpeed: 6.5, aiSpeedMult: 0.50, aiDeadzone: 25 },
  normal: { playerHeight: 80, aiHeight: 80, playerSpeed: 5.5, aiSpeedMult: 0.70, aiDeadzone: 15 },
  hard: { playerHeight: 60, aiHeight: 100, playerSpeed: 5.5, aiSpeedMult: 0.90, aiDeadzone: 5 }
};
let currentDifficulty = 'normal';

// Game state
let isPlaying = false;
let scorePlayer = 0;
let scoreAi = 0;

// Countdown state
let countdownValue = 0;
let countdownTimer = null;
let roundActive = false; // Is ball moving?

// Entities
const player = {
  x: 20,
  y: canvas.height / 2 - 40,
  width: PADDLE_WIDTH,
  height: 80,
  color: '#06d6a0', // cyan
  dy: 0,
  speed: 5.5
};

const ai = {
  x: canvas.width - 20 - PADDLE_WIDTH,
  y: canvas.height / 2 - 40,
  width: PADDLE_WIDTH,
  height: 80,
  color: '#f472b6', // pink
  dy: 0,
  speed: 5.5 * 0.70,
  deadzone: 15
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: BALL_SIZE,
  dx: 0,
  dy: 0,
  color: '#fff',
  speedMultiplier: 1.05
};

// Input handling
const keys = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false
};

window.addEventListener('keydown', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
    e.preventDefault(); // prevent scrolling
  }
});

window.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

// Setup Events
const diffBtns = document.querySelectorAll('.diff-btn');
diffBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const selectedDiff = e.target.dataset.diff;
    diffBtns.forEach(b => {
      b.classList.remove('active');
      if (b.dataset.diff === selectedDiff) {
        b.classList.add('active');
      }
    });
    currentDifficulty = selectedDiff;
  });
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

function startGame() {
  const diff = DIFFICULTIES[currentDifficulty];
  player.height = diff.playerHeight;
  ai.height = diff.aiHeight;
  player.speed = diff.playerSpeed;
  ai.speed = diff.playerSpeed * diff.aiSpeedMult;
  ai.deadzone = diff.aiDeadzone;

  scorePlayer = 0;
  scoreAi = 0;
  updateScoreDisplay();

  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');

  isPlaying = true;
  requestAnimationFrame(gameLoop);
  startRound();
}

function stopGame(winner) {
  isPlaying = false;
  roundActive = false;
  winnerText.textContent = winner === 'player' ? 'You Win!' : 'System Wins!';
  winnerText.style.background = winner === 'player' ? 'var(--color-accent-cyan)' : 'var(--color-accent-pink)';
  winnerText.style.webkitBackgroundClip = 'text';
  winnerText.style.webkitTextFillColor = 'transparent';
  gameOverScreen.classList.remove('hidden');
}

function startRound(loser = null) {
  roundActive = false;

  // Center ball, zero velocity
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 0;
  ball.dy = 0;

  // Reset paddles
  player.y = canvas.height / 2 - player.height / 2;
  ai.y = canvas.height / 2 - ai.height / 2;

  // Start countdown
  countdownValue = 3;
  if (countdownTimer) clearInterval(countdownTimer);

  countdownTimer = setInterval(() => {
    countdownValue--;
    if (countdownValue <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      launchBall(loser);
    }
  }, 1000);
}

function launchBall(loser) {
  roundActive = true;
  let directionX = Math.random() > 0.5 ? 1 : -1;
  // Serve the ball towards the loser of the previous point
  if (loser === 'player') directionX = -1;
  if (loser === 'ai') directionX = 1;

  ball.dx = INITIAL_BALL_SPEED * directionX;

  // Flatter angle: randomize Y speed between 0.15 and 0.40 of the X speed
  ball.dy = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.25 + 0.15);
}

function updateScoreDisplay() {
  scorePlayerEl.textContent = scorePlayer;
  scoreAiEl.textContent = scoreAi;
}

// Game Loop Functions
function update() {
  if (!isPlaying) return;

  // Move Player
  if (keys.w || keys.ArrowUp) {
    player.y -= player.speed;
  } else if (keys.s || keys.ArrowDown) {
    player.y += player.speed;
  }

  // Constrain Player
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  // Move AI (simple follow logic)
  const aiCenter = ai.y + ai.height / 2;
  if (roundActive && ball.dx > 0) {
    if (aiCenter < ball.y - ai.deadzone) {
      ai.y += Math.min(ai.speed, ball.y - aiCenter);
    } else if (aiCenter > ball.y + ai.deadzone) {
      ai.y -= Math.min(ai.speed, aiCenter - ball.y);
    }
  } else {
    // return to center when waiting
    const boardCenter = canvas.height / 2;
    if (aiCenter < boardCenter - 10) {
      ai.y += ai.speed * 0.4;
    } else if (aiCenter > boardCenter + 10) {
      ai.y -= ai.speed * 0.4;
    }
  }

  // Constrain AI
  ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));

  if (!roundActive) return; // Don't move ball if round hasn't started

  // Move Ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball & Wall Collision (Top/Bottom)
  if (ball.y - ball.size / 2 <= 0) {
    ball.y = ball.size / 2; // snap
    ball.dy *= -1;
  } else if (ball.y + ball.size / 2 >= canvas.height) {
    ball.y = canvas.height - ball.size / 2; // snap
    ball.dy *= -1;
  }

  // Ball & Paddle Collision
  // Player
  if (ball.dx < 0 &&
    ball.x - ball.size / 2 <= player.x + player.width &&
    ball.x + ball.size / 2 > player.x &&
    ball.y + ball.size / 2 >= player.y &&
    ball.y - ball.size / 2 <= player.y + player.height) {

    // snap to paddle to avoid stuck ball
    ball.x = player.x + player.width + ball.size / 2;
    ball.dx *= -1;
    // slightly increase speed
    ball.dx = Math.min(ball.dx * ball.speedMultiplier, MAX_BALL_SPEED);

    // add some english (spin) based on where it hit
    const hitPos = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
    ball.dy = hitPos * INITIAL_BALL_SPEED * 1.5;
  }

  // AI
  if (ball.dx > 0 &&
    ball.x + ball.size / 2 >= ai.x &&
    ball.x - ball.size / 2 < ai.x + ai.width &&
    ball.y + ball.size / 2 >= ai.y &&
    ball.y - ball.size / 2 <= ai.y + ai.height) {

    // snap to paddle
    ball.x = ai.x - ball.size / 2;
    ball.dx *= -1;
    ball.dx = Math.max(ball.dx * ball.speedMultiplier, -MAX_BALL_SPEED);

    const hitPos = (ball.y - (ai.y + ai.height / 2)) / (ai.height / 2);
    ball.dy = hitPos * INITIAL_BALL_SPEED * 1.5;
  }

  // Scoring
  if (ball.x < -ball.size) {
    scoreAi++;
    updateScoreDisplay();
    if (scoreAi >= WIN_SCORE) {
      stopGame('ai');
    } else {
      startRound('player'); // player lost the point, so serve to player
    }
  } else if (ball.x > canvas.width + ball.size) {
    scorePlayer++;
    updateScoreDisplay();
    if (scorePlayer >= WIN_SCORE) {
      stopGame('player');
    } else {
      startRound('ai'); // AI lost the point, so serve to AI
    }
  }
}

function drawRect(x, y, w, h, color, isGlow = false) {
  ctx.fillStyle = color;

  if (isGlow) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
  } else {
    ctx.shadowBlur = 0;
  }

  ctx.fillRect(x, y, w, h);
  ctx.shadowBlur = 0; // reset
}

function drawCircle(x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.shadowBlur = 20;
  ctx.shadowColor = color;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0; // reset
}

function drawNet() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  for (let i = 0; i < canvas.height; i += 30) {
    ctx.fillRect(canvas.width / 2 - 1, i + 10, 2, 10);
  }
}

function drawCountdown() {
  if (countdownValue > 0) {
    ctx.fillStyle = '#fff';
    ctx.font = '700 80px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(255,255,255,0.8)';
    ctx.fillText(countdownValue, canvas.width / 2, canvas.height / 2 - 50);
    ctx.shadowBlur = 0; // reset
  }
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawNet();
  drawRect(player.x, player.y, player.width, player.height, player.color, true);
  drawRect(ai.x, ai.y, ai.width, ai.height, ai.color, true);
  drawCircle(ball.x, ball.y, ball.size / 2, ball.color);

  if (isPlaying && !roundActive) {
    drawCountdown();
  }
}

function gameLoop() {
  update();
  draw();
  if (isPlaying) {
    requestAnimationFrame(gameLoop);
  }
}

// Initial draw
draw();
