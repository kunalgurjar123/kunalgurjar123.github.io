const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// PLAYER
let player = {
    x: 100,
    y: 300,
    width: 50,
    height: 50,
    dx: 0,
    dy: 0,
    speed: 5,
    gravity: 0.5,
    jumpPower: -10,
    grounded: false
};

// GROUND
let ground = {
    x: 0,
    y: canvas.height - 50,
    width: canvas.width,
    height: 50
};

// BRICKS
let bricks = [
    { x: 300, y: 300, width: 60, height: 60 },
    { x: 380, y: 300, width: 60, height: 60 },
    { x: 460, y: 300, width: 60, height: 60 }
];

// CONTROLS (KEYBOARD)
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") player.dx = player.speed;
    if (e.key === "ArrowLeft") player.dx = -player.speed;

    if (e.key === " " && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }
});

document.addEventListener("keyup", () => {
    player.dx = 0;
});

// MOBILE BUTTONS
function moveLeft() {
    player.dx = -player.speed;
}

function moveRight() {
    player.dx = player.speed;
}

function jump() {
    if (player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }
}

// UPDATE
function update() {
    // Movement
    player.x += player.dx;
    player.y += player.dy;

    // Gravity
    player.dy += player.gravity;

    // Ground collision
    if (player.y + player.height >= ground.y) {
        player.y = ground.y - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    // Brick collision (simple top collision)
    bricks.forEach(brick => {
        if (
            player.x < brick.x + brick.width &&
            player.x + player.width > brick.x &&
            player.y < brick.y + brick.height &&
            player.y + player.height > brick.y
        ) {
            // landing on brick
            if (player.dy > 0) {
                player.y = brick.y - player.height;
                player.dy = 0;
                player.grounded = true;
            }
        }
    });
}

// DRAW
function draw() {
    // Player
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Ground
    ctx.fillStyle = "green";
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

    // Bricks
    ctx.fillStyle = "brown";
    bricks.forEach(brick => {
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
    });
}

// LOOP
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
