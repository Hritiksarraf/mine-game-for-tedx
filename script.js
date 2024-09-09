let blocks = [];
let score = 0;
let blockCount = 0;  // Track the number of blocks selected
let startTime = Date.now();
let gameOver = false;
let interval;

document.addEventListener("DOMContentLoaded", function() {
    const grid = document.getElementById('grid');
    const scoreElement = document.getElementById('score');
    const timeElement = document.getElementById('time');

    // Initialize blocks with 22 diamonds and 3 bombs
    blocks = new Array(22).fill('diamond').concat(new Array(3).fill('bomb'));
    blocks = shuffleArray(blocks);

    // Start real-time timer
    interval = setInterval(() => {
        const currentTime = Math.round((Date.now() - startTime) / 1000);
        timeElement.textContent = currentTime;
    }, 1000);

    // Create the 5x5 grid of buttons with images
    blocks.forEach((block, index) => {
        const button = document.createElement('button');
        const img = document.createElement('img');
        img.src = 'X.jpeg';  // Set initial image to 'X.jpeg'
        button.appendChild(img);

        button.addEventListener('click', function() {
            if (gameOver || button.classList.contains('clicked')) return;

            button.classList.add('clicked');
            blockCount++;  // Increment block count when a block is clicked
            const currentTime = Math.round((Date.now() - startTime) / 1000);

            if (block === 'diamond') {
                const timeTaken = currentTime;
                const points = calculateScore(timeTaken, blockCount);  // Calculate score based on time and blocks chosen
                score += points;
                scoreElement.textContent = score;
                img.src = 'diamond.png';  // Change image to 'diamond.jpeg'
            } else if (block === 'bomb') {
                img.src = 'bomb.png';  // Change image to 'bomb.jpeg'

                // Change background color to red with smooth transition
                document.body.style.backgroundColor = 'red';

                // Disable all buttons immediately after clicking a bomb
                disableAllButtons();

                // End the game after a 1-second delay
                setTimeout(() => endGame(), 1000);
            }
        });

        grid.appendChild(button);
    });
});

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Disable all buttons
function disableAllButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);
}

// Calculate score based on time taken and number of blocks chosen
function calculateScore(timeTaken, blockCount) {
    // Base score is related to the number of blocks chosen and time taken.
    let baseScore = 10;  // Base score for selecting a diamond
    let timeBonus = Math.max(0, 10 - timeTaken);  // Bonus score that decreases with time (caps at 10 seconds)
    let blockBonus = blockCount * 2;  // Bonus score for the number of blocks selected (increase score for more blocks chosen)
    return baseScore + timeBonus + blockBonus;
}

// End game when bomb is clicked
function endGame() {
    gameOver = true;
    clearInterval(interval);  // Stop the timer
    const finalTime = Math.round((Date.now() - startTime) / 1000);
    alert(`Game Over! Your final score is ${score}. Total time: ${finalTime} seconds`);
}
