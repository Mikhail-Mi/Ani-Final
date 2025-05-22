document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.querySelector('.back-button');
    const startButton = document.querySelector('.start-button');

    backButton.addEventListener('click', () => {
        console.log('Back button clicked');
        window.location.href = 'index.html';
    });

    startButton.addEventListener('click', () => {
        console.log('Start button clicked');
  
    });

    const player1Color = document.getElementById('player1-color');
    const player1Cpu = document.getElementById('player1-cpu');
    const goalsToWin = document.getElementById('goals-to-win');
    const timeLeft = document.getElementById('time-left');
    const map = document.getElementById('map');
    const player2Color = document.getElementById('player2-color');
    const player2Cpu = document.getElementById('player2-cpu');

    backButton.addEventListener('click', () => {
        console.log('Back button clicked');
        window.location.href = 'index.html';
    });

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
