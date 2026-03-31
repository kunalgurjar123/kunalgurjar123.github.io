const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// IMAGES
const playerImg = new Image();
playerImg.src = "player.png";

const enemyImg = new Image();
enemyImg.src = "enemy.png";

const coinImg = new Image();
coinImg.src = "coin.jpg";

const bgImg = new Image();
bgImg.src = "bg.png";

const groundImg = new Image();
groundImg.src = "ground.png";

// SOUNDS
const jumpSound = new Audio("jump.wav");
const coinSound = new Audio("coin.wav");
const hitSound = new Audio("hit.wav");

// PLAYER
let player = {
  x: 100,
  y: 0,
  width: 60,
  height: 60,
  dx: 0,
  dy: 0,
  speed: 5,
  gravity: 0.6,
  jump: -12,
  grounded: false
};

// GROUND
let groundY = canvas.height - 120;

// ENEMY
let enemy = {
  x: 800,
  y: groundY - 50,
  width: 50,
  height: 50
};

// COIN
let coin = {
  x: 500,
  y: groundY - 100,
  width: 30,
  height: 30
};

// CONTROLS
let keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// GAME LOOP
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // BACKGROUND
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // GROUND DRAW
  ctx.drawImage(groundImg, 0, groundY, canvas.width, 120);

  // LEFT RIGHT MOVEMENT
  if (keys["ArrowRight"]) {
    player.dx = player.speed;
  } else if (keys["ArrowLeft"]) {
    player.dx = -player.speed;
  } else {
    player.dx = 0;
  }

  player.x += player.dx;

  // JUMP
  if (keys["Space"] && player.grounded) {
    player.dy = player.jump;
    player.grounded = false;
    jumpSound.play();
  }

  // GRAVITY
  player.dy += player.gravity;
  player.y += player.dy;

  // GROUND COLLISION
  if (player.y + player.height >= groundY) {
    player.y = groundY - player.height;
    player.dy = 0;
    player.grounded = true;
  }

  // DRAW PLAYER
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // DRAW ENEMY
  ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

  // DRAW COIN
  ctx.drawImage(coinImg, coin.x, coin.y, coin.width, coin.height);

  // COIN COLLISION
  if (
    player.x < coin.x + coin.width &&
    player.x + player.width > coin.x &&
    player.y < coin.y + coin.height &&
    player.y + player.height > coin.y
  ) {
    coin.x = Math.random() * canvas.width;
    coinSound.play();
  }

  // ENEMY COLLISION
  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    hitSound.play();
    alert("Game Over!");
    location.reload();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
