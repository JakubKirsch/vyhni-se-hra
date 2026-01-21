// Získáme canvas a kontext
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// TŘÍDA PRO PŘEKÁŽKY
class Obstacle {
    constructor(x, y, width, height, speed, color) {
        this.x = x;             // pozice X
        this.y = y;             // pozice Y
        this.width = width;    // šířka překážky
        this.height = height;  // výška překážky
        this.speed = speed;    // rychlost pohybu
        this.color = color;    // barva překážky
    }

    // Metoda pro pohyb překážky
    update() {
        this.y += this.speed;
    }

    // Metoda pro vykreslení překážky
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


// HRÁČ
let player = {
    x: 180,
    y: 550,
    width: 40,
    height: 40,
    speed: 6
};

// Pole všech překážek
let obstacles = [];

let score = 0;
let gameOver = false;

let leftPressed = false;
let rightPressed = false;

// OVLÁDÁNÍ
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") leftPressed = true;
    if (e.key === "ArrowRight") rightPressed = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") leftPressed = false;
    if (e.key === "ArrowRight") rightPressed = false;
});


// VYTVÁŘENÍ RŮZNÝCH TYPŮ PŘEKÁŽEK
function createObstacle() {
    const type = Math.floor(Math.random() * 3); 
    // Náhodně vybereme typ 0, 1 nebo 2

    let obs;

    if (type === 0) {
        // Typ 0 – klasický čtverec
        obs = new Obstacle(
            Math.random() * (canvas.width - 40),
            -40,
            40,
            40,
            3,
            "red"
        );
    } 
    else if (type === 1) {
        // Typ 1 – široký obdélník (pomalejší)
        obs = new Obstacle(
            Math.random() * (canvas.width - 80),
            -30,
            80,
            30,
            2,
            "orange"
        );
    } 
    else {
        // Typ 2 – malá rychlá překážka
        obs = new Obstacle(
            Math.random() * (canvas.width - 25),
            -25,
            25,
            25,
            5,
            "purple"
        );
    }

    obstacles.push(obs);
}


// LOGIKA HRY
function update() {
    if (gameOver) return;

    // Pohyb hráče
    if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    }
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    // Pohyb všech překážek a kontrola kolizí
    for (let obs of obstacles) {
        obs.update();  // zavoláme metodu třídy

        // Kolize hráče s překážkou
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver = true;
            alert("Konec hry! Skóre: " + score);
        }
    }

    // Odstranění překážek mimo obrazovku
    obstacles = obstacles.filter(o => o.y < canvas.height + 50);

    score++;
    document.getElementById("score").textContent = score;
}


// VYKRESLOVÁNÍ
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Hráč
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Překážky – každá se vykreslí metodou třídy
    for (let obs of obstacles) {
        obs.draw();
    }
}


// HLAVNÍ SMYČKA
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Každou sekundu vytvoříme novou překážku
setInterval(() => {
    if (!gameOver) createObstacle();
}, 1000);

// Restart hry
function restartGame() {
    obstacles = [];
    score = 0;
    gameOver = false;
    player.x = 180;
}

// Spuštění hry
gameLoop();

