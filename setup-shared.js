export function getGoalsToWin() {
    return parseInt(document.getElementById('goals-to-win').value, 10);
}

export function updateBorderGradient() {
    const container = document.querySelector('.container');
    if (!container) {
        console.log('No container found!');
        return;
    }
    console.log('Container found:', container);
    const color1 = player1ColorSelect.value;
    const color2 = player2ColorSelect.value;
    container.style.borderImage = `linear-gradient(to right, ${color1}, ${color2}) 1`;
}