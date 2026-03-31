const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Assets
const playerImg = new Image();
playerImg.src = "assets/player.png";

const playerBigImg = new Image();
playerBigImg.src = "assets/player_big.png";

const enemyImg = new Image();
enemyImg.src = "assets/enemy.png";

const coinImg = new Image();
coinImg.src = "assets/coin.png";

// Sounds
const jumpSound = new Audio("assets/jump.wav");
const coinSound = new Audio("assets/coin.wav");
const hitSound = new Audio("assets/hit.wav");

// Player
let player = {
    x: 100,
    y: 0,
    width: 50,
    height: 50,
    dx: 0,
    dy: 0,
    speed: 5,
    gravity: 0.8,
    jump: -15,
    grounded: false,
    big: false
};

// Fireballs
let fireballs = [];

// Game state
let score = 0;
let lives = 3;
let cameraX = 0;

// Platforms
let platforms = [
    {x: 0, y: 400, width: 600, height: 50},
    {x: 700, y: 300, width: 200, height: 20},
    {x: 1000, y: 350, width: 300, height: 20}
];

// Coins
let coins = [
    {x: 750, y: 250, collected: false},
    {x: 1100, y: 300, collected: false}
];

// Enemy
let enemies = [
    {x: 900, y: 350, width: 40, height: 40, dir: 1}
];

// Controls
let keys = {};

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// Mobile Controls
function moveLeft(){ player.dx = -player.speed; }
function moveRight(){ player.dx = player.speed; }
function jump(){ if(player.grounded){ player.dy = player.jump; jumpSound.play(); } }
function shoot(){
    fireballs.push({x: player.x, y: player.y+20, speed: 8});
}

// Collision
function isColliding(a,b){
    return a.x < b.x+b.width &&
           a.x+a.width > b.x &&
           a.y < b.y+b.height &&
           a.y+a.height > b.y;
}

// Update
function update(){

    player.dx = 0;
    if(keys["ArrowRight"]) player.dx = player.speed;
    if(keys["ArrowLeft"]) player.dx = -player.speed;

    player.dy += player.gravity;
    player.x += player.dx;
    player.y += player.dy;

    player.grounded = false;

    platforms.forEach(p=>{
        if(isColliding(player,p) && player.dy>0){
            player.y = p.y - player.height;
            player.dy = 0;
            player.grounded = true;
        }
    });

    if(keys["Space"] && player.grounded){
        player.dy = player.jump;
        jumpSound.play();
    }

    cameraX = player.x - 200;

    // Coins
    coins.forEach(c=>{
        if(!c.collected &&
            player.x < c.x+20 &&
            player.x+player.width > c.x &&
            player.y < c.y+20 &&
            player.y+player.height > c.y){
            c.collected = true;
            score += 10;
            coinSound.play();
            document.getElementById("score").innerText = score;
        }
    });

    // Fireballs
    fireballs.forEach(f=>{
        f.x += f.speed;
    });

    // Enemies
    enemies.forEach((e,index)=>{
        e.x += e.dir*2;
        if(e.x<800 || e.x>1100) e.dir *= -1;

        // Fireball hit
        fireballs.forEach(f=>{
            if(isColliding({x:f.x,y:f.y,width:10,height:10}, e)){
                enemies.splice(index,1);
                score += 20;
            }
        });

        // Player hit
        if(isColliding(player,e)){
            lives--;
            hitSound.play();
            document.getElementById("lives").innerText = lives;

            if(lives<=0){
                alert("Game Over");
                location.reload();
            }
        }
    });
}

// Draw
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    platforms.forEach(p=>{
        ctx.fillStyle="green";
        ctx.fillRect(p.x-cameraX,p.y,p.width,p.height);
    });

    coins.forEach(c=>{
        if(!c.collected){
            ctx.drawImage(coinImg,c.x-cameraX,c.y,20,20);
        }
    });

    enemies.forEach(e=>{
        ctx.drawImage(enemyImg,e.x-cameraX,e.y,e.width,e.height);
    });

    fireballs.forEach(f=>{
        ctx.fillStyle="orange";
        ctx.fillRect(f.x-cameraX,f.y,10,10);
    });

    // Player
    let img = player.big ? playerBigImg : playerImg;
    ctx.drawImage(img,player.x-cameraX,player.y,player.width,player.height);
}

// Loop
function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
