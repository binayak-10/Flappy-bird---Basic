// Board dimensions
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Bird properties
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// Pipes properties
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load images
    birdImg = new Image();
    birdImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='24'%3E%3Ccircle cx='17' cy='12' r='10' fill='%23FFD700'/%3E%3C/svg%3E";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };

    topPipeImg = new Image();
    topPipeImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='512'%3E%3Crect width='64' height='512' fill='%23228B22'/%3E%3C/svg%3E";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='512'%3E%3Crect width='64' height='512' fill='%23228B22'/%3E%3C/svg%3E";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    
    // Keyboard controls for PC
    document.addEventListener("keydown", moveBird);
    
    // Touch controls for mobile
    document.addEventListener("touchstart", moveBird);
    
    // Mouse click controls
    document.addEventListener("click", moveBird);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    // Pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // Clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillStyle = "red";
        context.font = "30px sans-serif";
        context.fillText("GAME OVER", boardWidth / 2 - 90, boardHeight / 2);
        context.font = "20px sans-serif";
        context.fillText("Tap/Click to Restart", boardWidth / 2 - 90, boardHeight / 2 + 30);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    // Prevent default touch behavior
    if (e.type === 'touchstart') {
        e.preventDefault();
    }
    
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW" || 
        e.type === "touchstart" || e.type === "click") {
        
        // Jump
        velocityY = -6;

        // Reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
