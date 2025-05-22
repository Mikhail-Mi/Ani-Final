import { getGoalsToWin, updateBorderGradient } from './setup.js';


let leftScore = 0;
let rightScore = 0;

window.onload = function() {
    updateBorderGradient();
};

document.addEventListener('DOMContentLoaded', function () {
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');

    const pos = {
        player1: { x: 50, y: 300 },
        player2: { x: 720, y: 300 }
    };

    const speed = 5;
    const keys = {};

    document.addEventListener('keydown', e => {
        keys[e.key.toLowerCase()] = true;
    });

    document.addEventListener('keyup', e => {
        keys[e.key.toLowerCase()] = false;
    });

    function movePlayers() {
        // Player 1 - WASD
        if (keys['w']) pos.player1.y -= speed;
        if (keys['s']) pos.player1.y += speed;
        if (keys['a']) pos.player1.x -= speed;
        if (keys['d']) pos.player1.x += speed;

        // Player 2 - Arrow keys
        if (keys['arrowup']) pos.player2.y -= speed;
        if (keys['arrowdown']) pos.player2.y += speed;
        if (keys['arrowleft']) pos.player2.x -= speed;
        if (keys['arrowright']) pos.player2.x += speed;

        player1.style.left = pos.player1.x + 'px';
        player1.style.top = pos.player1.y + 'px';
        player2.style.left = pos.player2.x + 'px';
        player2.style.top = pos.player2.y + 'px';

        requestAnimationFrame(movePlayers);
    }

    movePlayers();
});

// Fix comparison here
function checkWin() {
    if (leftScore === getGoalsToWin()) {
        return "left-won";
    }
    if (rightScore === getGoalsToWin()) {
        return "right-won";
    }
}
