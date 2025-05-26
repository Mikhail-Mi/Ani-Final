
document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.querySelector('.back-button');
    const startButton = document.querySelector('.start-button');

    backButton.addEventListener('click', () => {
        console.log('Back button clicked');
        window.location.href = 'index.html';
    });
    

    startButton.addEventListener('click', () => {
    const settings = {
        player1Color: player1Color.value,
        player1Cpu: player1Cpu.checked,
        goalsToWin: parseInt(goalsToWin.value, 10),
        timeLeft: parseInt(timeLeft.value, 10),
        map: map.value,
        player2Color: player2Color.value,
        player2Cpu: player2Cpu.checked
    };

    localStorage.setItem('gameSettings', JSON.stringify(settings));
    window.location.href = 'game.html';
});

    const player1Color = document.getElementById('player1-color');
    const goalsToWin = document.getElementById('goals-to-win');
    const timeLeft = document.getElementById('time-left');
    const map = document.getElementById('map');
    const player2Color = document.getElementById('player2-color');

    startButton.addEventListener('click', () => {
        const settings = {
            player1Color: player1Color.value,
            player1Cpu: player1Cpu.checked,
            goalsToWin: goalsToWin.value,
            timeLeft: timeLeft.value,
            map: map.value,
            player2Color: player2Color.value,
            player2Cpu: player2Cpu.checked
        };
        console.log('Start button clicked with settings:', settings);
    });
});

function updateBorderGradient() {
    const color1 = player1ColorSelect.value;
    const color2 = player2ColorSelect.value;
    container.style.borderImage = `linear-gradient(to right, ${color1}, ${color2}) 1`;
    start.style.color = color1;
    match.style.color = color2;
}

//set color gradients 
const start = document.querySelector('.start');
const match = document.querySelector('.match');
const container = document.querySelector('.container');
const player1ColorSelect = document.getElementById('player1-color');
const player2ColorSelect = document.getElementById('player2-color');



// Listen for changes
player1ColorSelect.addEventListener('change', updateBorderGradient);
player2ColorSelect.addEventListener('change', updateBorderGradient);

// Set initial gradient when page loads
window.addEventListener('DOMContentLoaded', updateBorderGradient);

