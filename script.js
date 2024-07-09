const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 400;
canvas.height = 600;

// Load bird image
const birdImg = new Image();
birdImg.src = 'bird.png'; // Ganti dengan path gambar burung Anda

// Game variables
let birdX = 50;
let birdY = canvas.height / 2;
let birdWidth = 40;
let birdHeight = 30;
let gravity = 0.2; // Gravitasi yang lebih ringan
let jumpStrength = -4; // Loncatan yang lebih kuat
let velocity = 0;
let pipes = [];
let score = 0;
let gameover = false;

// Event listener for mouse or touch input
canvas.addEventListener('click', function() {
    if (!gameover) {
        velocity = jumpStrength;
    } else {
        resetGame();
    }
});

// Function to reset the game
function resetGame() {
    birdY = canvas.height / 2;
    velocity = 0;
    pipes = [];
    score = 0;
    gameover = false;
}

// Function to update game state
function update() {
    if (!gameover) {
        // Update bird position
        velocity += gravity;
        birdY += velocity;

        // Move background based on bird's movement
        let backgroundSpeed = 1; // Adjust speed as needed
        let backgroundPosition = birdY * backgroundSpeed;
        document.querySelector('.background').style.backgroundPosition = `0 ${backgroundPosition}px`;

        // Generate pipes
        if (frames % 120 === 0) { // Jarak antar rintangan yang lebih besar
            pipes.push({
                x: canvas.width,
                y: Math.random() * (canvas.height - 250) + 100
            });
        }

        // Move pipes
        pipes.forEach(pipe => {
            pipe.x -= 2;

            // Check collision with bird
            if (birdX + birdWidth > pipe.x && birdX < pipe.x + 50 && (birdY < pipe.y || birdY + birdHeight > pipe.y + 150)) {
                gameOver();
            }

            // Remove pipes that have moved off screen
            if (pipe.x + 50 < 0) {
                pipes.shift();
                score++;
            }
        });

        // Check collision with ground
        if (birdY + birdHeight / 2 > canvas.height) {
            gameOver();
        }
    }
}

// Function to draw everything on canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird image
    ctx.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);

    // Draw pipes
    pipes.forEach(pipe => {
        ctx.fillStyle = '#68c355';
        ctx.fillRect(pipe.x, 0, 50, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + 150, 50, canvas.height - pipe.y - 150);
    });

    // Draw score
    ctx.font = '30px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`Score: ${score}`, 10, 50);

    // Draw game over message
    if (gameover) {
        ctx.font = '40px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText('Game Over', 100, canvas.height / 2 - 20);
        ctx.font = '20px Arial';
        ctx.fillText('Click to Restart', 120, canvas.height / 2 + 20);
    }
}

// Function to end the game
function gameOver() {
    gameover = true;
}

// Game loop
let frames = 0;
function gameLoop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
