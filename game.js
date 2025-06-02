const maxSpeed = 10;

const settings = JSON.parse(localStorage.getItem('gameSettings'));
console.log(settings);

// If no settings were saved (e.g., direct page access), fall back to defaults
const player1Color = settings?.player1Color || 'red';
const player2Color = settings?.player2Color || 'blue';
const goalsToWin = settings?.goalsToWin || 5;

function getGoalsToWin() {
    return goalsToWin;
}

function updateBorderGradient() {
    const container = document.querySelector('.container');
    const start = document.querySelector('.start');
    const match = document.querySelector('.match');

    if (!container || !start || !match) return;

    container.style.borderImage = `linear-gradient(to right, ${player1Color}, ${player2Color}) 1`;
    start.style.color = player1Color;
    match.style.color = player2Color;
}

function resetGame() {
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');
    const ball = document.getElementById('gameBall');
    const container = document.querySelector('.container');

    const containerRect = container.getBoundingClientRect();
    const playerWidth = player1.offsetWidth;
    const playerHeight = player1.offsetHeight;
    const ballWidth = ball.offsetWidth;
    const ballHeight = ball.offsetHeight;

    //styles
    player1.style.backgroundColor = settings.player1Color;
    player2.style.backgroundColor = settings.player2Color;
    container.style.borderImage = `linear-gradient(to right, ${settings.player1Color}, ${settings.player2Color}) 1`;

    // Reset player positions
    player1.style.left = '250px';
    player1.style.top = (containerRect.height / 2 - playerHeight / 2) + 'px';

    player2.style.left = (containerRect.width - 50 - playerWidth) + 'px';
    player2.style.top = (containerRect.height / 2 - playerHeight / 2) + 'px';

    // Reset ball position (center)
    ball.style.left = (containerRect.width / 2 - ballWidth / 2) + 'px';
    ball.style.top = (containerRect.height / 2 - ballHeight / 2) + 'px';
}

resetGame();
let leftScore = 0;
let rightScore = 0;

let playerOriginalSize;
let ballOriginalSize;

document.addEventListener('DOMContentLoaded', function () {
    updateBorderGradient();
    resetGame();
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');
    const ball = document.getElementById('gameBall');

    playerOriginalSize = parseFloat(getComputedStyle(player1).width);
    ballOriginalSize = parseFloat(getComputedStyle(ball).width);

    //speed is positive when it either goes up for Y or right for X 
    let speed1X = 0;
    let speed2X = 0;
    let speed1Y = 0;
    let speed2Y = 0;
    let ballSpeedX = 0; // Ball starts with no horizontal speed
    let ballSpeedY = 5; // Ball starts falling immediately

    const keys = {};

    document.addEventListener('keydown', e => {
        keys[e.key.toLowerCase()] = true;
    });

    document.addEventListener('keyup', e => {
        keys[e.key.toLowerCase()] = false;
    });



const friction = 0.1; // Increased friction for player balls
const acc = 0.4;
const vertAcc = 0.2;
const gravity = 0.13; // Constant downward pull

function movePlayers() {
    const ball = document.getElementById('gameBall');
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();

    // PLAYER 1 - X Axis
    if (keys['a']) {
        if (speed1X > -maxSpeed) speed1X -= acc;
    } else if (keys['d']) {
        if (speed1X < maxSpeed) speed1X += acc;
    } else {
        if (speed1X > 0) {
            speed1X -= friction;
            if (speed1X < 0) speed1X = 0;
        } else if (speed1X < 0) {
            speed1X += friction;
            if (speed1X > 0) speed1X = 0;
        }
    }

    // PLAYER 1 - Y Axis
    if (keys['w']) {
        speed1Y -= vertAcc;
    } else if (keys['s']) {
        speed1Y += vertAcc;
    }
    speed1Y += gravity;

    // PLAYER 2 - X Axis
    if (keys['arrowleft']) {
        if (speed2X > -maxSpeed) speed2X -= acc;
    } else if (keys['arrowright']) {
        if (speed2X < maxSpeed) speed2X += acc;
    } else {
        if (speed2X > 0) {
            speed2X -= friction;
            if (speed2X < 0) speed2X = 0;
        } else if (speed2X < 0) {
            speed2X += friction;
            if (speed2X > 0) speed2X = 0;
        }
    }

    // PLAYER 2 - Y Axis
    if (keys['arrowup']) {
        speed2Y -= vertAcc;
    } else if (keys['arrowdown']) {
        speed2Y += vertAcc;
    }
    speed2Y += gravity;

    // Move players
    player1.style.left = (parseFloat(player1.style.left || 0) + speed1X) + 'px';
    player1.style.top = (parseFloat(player1.style.top || 0) + speed1Y) + 'px';

    player2.style.left = (parseFloat(player2.style.left || 0) + speed2X) + 'px';
    player2.style.top = (parseFloat(player2.style.top || 0) + speed2Y) + 'px';

    // Move ball
    ball.style.left = (parseFloat(ball.style.left || 0) + ballSpeedX) + 'px';
    ball.style.top = (parseFloat(ball.style.top || 0) + ballSpeedY) + 'px';

    // Apply gravity to ball and cap speed
    ballSpeedY += gravity;
    if (ballSpeedY > maxSpeed) ballSpeedY = maxSpeed;
    if (ballSpeedY < -maxSpeed) ballSpeedY = -maxSpeed;
    if (ballSpeedX > maxSpeed) ballSpeedX = maxSpeed;
    if (ballSpeedX < -maxSpeed) ballSpeedX = -maxSpeed;

    // BOUNCE LOGIC
    let bounce1 = checkWallCollision(player1, speed1X, speed1Y);
    speed1X = bounce1.x;
    speed1Y = bounce1.y;

    let bounce2 = checkWallCollision(player2, speed2X, speed2Y);
    speed2X = bounce2.x;
    speed2Y = bounce2.y;

    let ballBounce = checkBallWallCollision(ball, ballSpeedX, ballSpeedY);
    ballSpeedX = ballBounce.x;
    ballSpeedY = ballBounce.y;

    function checkWallCollision(player, speedX, speedY) {
        const playerRect = player.getBoundingClientRect();
        const leftWall = document.getElementById('leftWall').getBoundingClientRect();
        const rightWall = document.getElementById('rightWall').getBoundingClientRect();
        const topWall = document.getElementById('topWall').getBoundingClientRect();
        const bottomWall = document.getElementById('bottomWall').getBoundingClientRect();
        const container = document.querySelector('.container').getBoundingClientRect();
        const originalSize = parseFloat(getComputedStyle(player).width);
        const shrunkSize = originalSize * 0.8;

        let bounce = { x: speedX, y: speedY };

        // Left wall
        if (playerRect.left <= leftWall.right) {
            bounce.x = Math.abs(bounce.x)*((Math.random()*0.4)+0.85); // bounce right
            player.style.width = shrunkSize + "px";
            setTimeout(() => {
                player.style.width = originalSize + "px";
            }, 50);
        }

        // Right wall
        if (playerRect.right >= rightWall.left) {
            bounce.x = -Math.abs(bounce.x)*((Math.random()*0.4)+0.85); // bounce left
            player.style.width = shrunkSize + "px";
            setTimeout(() => {
                player.style.width = originalSize + "px";
            }, 50);
        }

        // Top wall
        if (playerRect.top <= topWall.bottom) {
            bounce.y = Math.abs(bounce.y)*((Math.random()*0.4)+0.65); // bounce down
            player.style.top += 1 + 'px';
            player.style.height = shrunkSize + "px";
            setTimeout(() => {
                player.style.height = originalSize + "px";
            }, 50);
        }

        // Bottom wall
        if (playerRect.bottom >= bottomWall.top) {
            bounce.y = -Math.abs(bounce.y)*((Math.random()*0.4)+0.85); // bounce up
            player.style.height = shrunkSize + "px";
            setTimeout(() => {
                player.style.height = originalSize + "px";
            }, 50);
        }

        return bounce;
    }

    function checkBallWallCollision(ball, speedX, speedY) {
        const ballRect = ball.getBoundingClientRect();
        const leftWall = document.getElementById('leftWall').getBoundingClientRect();
        const rightWall = document.getElementById('rightWall').getBoundingClientRect();
        const topWall = document.getElementById('topWall').getBoundingClientRect();
        const bottomWall = document.getElementById('bottomWall').getBoundingClientRect();
        const shrunkSize = ballOriginalSize * 0.8;

        let bounce = { x: speedX, y: speedY };

        // Left wall
        if (ballRect.left <= leftWall.right) {
            bounce.x = Math.abs(bounce.x)*((Math.random()*0.4)+0.85); // bounce right
            ball.style.width = shrunkSize + "px";
            setTimeout(() => {
                ball.style.width = ballOriginalSize + "px";
            }, 50);
        }

        // Right wall
        if (ballRect.right >= rightWall.left) {
            bounce.x = -Math.abs(bounce.x)*((Math.random()*0.4)+0.85); // bounce left
            ball.style.width = shrunkSize + "px";
            setTimeout(() => {
                ball.style.width = ballOriginalSize + "px";
            }, 50);
        }

        // Top wall
        if (ballRect.top <= topWall.bottom) {
            bounce.y = Math.abs(bounce.y)*((Math.random()*0.4)+0.65); // bounce down
            ball.style.top = topWall.bottom + 1 + 'px'; // Adjust position to prevent sticking
            ball.style.height = shrunkSize + "px";
            setTimeout(() => {
                ball.style.height = ballOriginalSize + "px";
            }, 50);
        }

        // Bottom wall
        if (ballRect.bottom >= bottomWall.top) {
            bounce.y = -Math.abs(bounce.y)*((Math.random()*0.4)+0.65); // bounce up, reduced bounce height
            ball.style.top = bottomWall.top - ballRect.height - 1 + 'px'; // Adjust position to prevent sticking
            ball.style.height = shrunkSize + "px";
            setTimeout(() => {
                ball.style.height = ballOriginalSize + "px";
            }, 50);
        }

        return bounce;
    }

    handlePlayerCollisions(player1,player2, speed1X, speed1Y, speed2X, speed2Y);
    handleBallPlayerCollision(ball, player1);
    handleBallPlayerCollision(ball, player2);
    updateBorderGradient;
    requestAnimationFrame(movePlayers);
}

function handleBallPlayerCollision(ball, player) {
    if (isColliding(ball, player)) {
        const ballRect = ball.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        // Get center points
        const ballCenterX = ballRect.left + ballRect.width / 2;
        const ballCenterY = ballRect.top + ballRect.height / 2;
        const playerCenterX = playerRect.left + playerRect.width / 2;
        const playerCenterY = playerRect.top + playerRect.height / 2;

        // Vector from player to ball
        let dx = ballCenterX - playerCenterX;
        let dy = ballCenterY - playerCenterY;

        // Normalize the vector
        const magnitude = Math.sqrt(dx * dx + dy * dy) || 1; // Avoid division by 0
        dx /= magnitude;
        dy /= magnitude;

        // Ball speed magnitude
        const speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY) || 1;

        // Reflect the ball in the opposite direction (scaled slightly for variation)
        const speedMultiplier = (Math.random() * 0.4) + 0.85;
        ballSpeedX = dx * speed * speedMultiplier;
        ballSpeedY = dy * speed * speedMultiplier;

        // Reposition the ball just outside the player to prevent sticking
        const overlapBuffer = 2;
        ball.style.left = (playerCenterX + dx * (playerRect.width / 2 + ballRect.width / 2 + overlapBuffer) - ballRect.width / 2) + 'px';
        ball.style.top = (playerCenterY + dy * (playerRect.height / 2 + ballRect.height / 2 + overlapBuffer) - ballRect.height / 2) + 'px';
    }
}




    updateBorderGradient;
    movePlayers();
});




function checkWin() {
    if (leftScore === getGoalsToWin()) {
        return "left-won";
    }
    if (rightScore === getGoalsToWin()) {
        return "right-won";
    }
}

function isColliding(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    return !(
        aRect.right <= bRect.left ||
        aRect.left >= bRect.right ||
        aRect.bottom <= bRect.top ||
        aRect.top >= bRect.bottom
    );
}

function handlePlayerCollisions(playerA, playerB, speed1X, speed1Y, speed2X, speed2Y) {
    if (isColliding(playerA, playerB)) {
        const rectA = playerA.getBoundingClientRect();
        const rectB = playerB.getBoundingClientRect();

        // Get center points
        const centerAX = rectA.left + rectA.width / 2;
        const centerAY = rectA.top + rectA.height / 2;
        const centerBX = rectB.left + rectB.width / 2;
        const centerBY = rectB.top + rectB.height / 2;

        // Vector from B to A
        let dx = centerAX - centerBX;
        let dy = centerAY - centerBY;

        // Normalize
        const magnitude = Math.sqrt(dx * dx + dy * dy) || 1;
        dx /= magnitude;
        dy /= magnitude;

        const speed1 = Math.sqrt(speed1X * speed1X + speed1Y * speed1Y) || 1;
        const speed2 = Math.sqrt(speed2X * speed2X + speed2Y * speed2Y) || 1;

        const speedMultiplier = (Math.random() * 0.4) + 0.85;
        speed1X = dx * speed1 * speedMultiplier;
        speed1Y = dy * speed1 * speedMultiplier;

        const speedMultiplier2 = (Math.random() * 0.4) + 0.85;
        speed2X = dx * speed2 * speedMultiplier2;
        speed2Y = dy * speed2 * speedMultiplier2;

        // Move playerA slightly away from playerB to resolve overlap
        const overlapBuffer = 5;
        playerA.style.left = (centerBX + dx * (rectA.width / 2 + rectB.width / 2 + overlapBuffer) - rectA.width / 2) + 'px';
        playerA.style.top = (centerBY + dy * (rectA.height / 2 + rectB.height / 2 + overlapBuffer) - rectA.height / 2) + 'px';
    }
}

