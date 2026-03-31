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
  y: 300,
  width: 50,
  height: 50,
  dy: 0,
  gravity: 0.5,
  jump: -10
};

// ENEMY
let enemy = {
  x: 600,
  y: 320,
  width: 50,
  height: 50
};

// COIN
let coin = {
  x: 400,
  y: 250,
  width: 30,
  height: 30
};

// CONTROLS
document.addEventListener("click", () => {
  player.dy = player.jump;
  jumpSound.play();
});

// GAME LOOP
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // gravity
  player.dy += player.gravity;
  player.y += player.dy;

  // ground collision
  if (player.y > 300) {
    player.y = 300;
    player.dy = 0;
  }

  // draw player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // draw enemy
  ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

  // draw coin
  ctx.drawImage(coinImg, coin.x, coin.y, coin.width, coin.height);

  // coin collision
  if (
    player.x < coin.x + coin.width &&
    player.x + player.width > coin.x &&
    player.y < coin.y + coin.height &&
    player.y + player.height > coin.y
  ) {
    coin.x = Math.random() * 800 + 200;
    coinSound.play();
  }

  // enemy collision
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
