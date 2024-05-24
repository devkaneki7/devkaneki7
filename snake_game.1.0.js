document.addEventListener('DOMContentLoaded', (event) => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const userInfo = document.getElementById('user-info');
    const upButton = document.getElementById('up');
    const downButton = document.getElementById('down');
    const leftButton = document.getElementById('left');
    const rightButton = document.getElementById('right');
    const boardSize = 20;
    const initialSnakeLength = 3;
    let snake = [];
    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };
    let food = { x: 0, y: 0 };
    let score = 0;
    let gameInterval;
    let touchStartX = 0;
    let touchStartY = 0;

    // Recupera e exibe o nome do usuário
    const username = localStorage.getItem('snakeUsername');
    if (username) {
        userInfo.textContent = `Usuário: ${username}`;
    }

    function init() {
        snake = [];
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };
        score = 0;
        scoreDisplay.textContent = 'Pontos: ' + score;

        for (let i = initialSnakeLength - 1; i >= 0; i--) {
            snake.push({ x: i, y: 0 });
        }
        placeFood();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, 100);
    }

    function placeFood() {
        let newFoodPosition;
        do {
            newFoodPosition = {
                x: Math.floor(Math.random() * boardSize),
                y: Math.floor(Math.random() * boardSize)
            };
        } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
        food = newFoodPosition;
    }

    function updateGame() {
        direction = nextDirection;
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        
        if (isCollision(head)) {
            clearInterval(gameInterval);
            alert('Game Over! Seu Score: ' + score);
            return;
        }
        
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreDisplay.textContent = 'Pontos: ' + score;
            placeFood();
        } else {
            snake.pop();
        }

        drawGame();
    }

    function isCollision(position) {
        return (
            position.x >= boardSize || 
            position.y >= boardSize || 
            position.x < 0 || 
            position.y < 0 || 
            snake.some(segment => segment.x === position.x && segment.y === position.y)
        );
    }

    function drawGame() {
        gameBoard.innerHTML = '';
        snake.forEach(segment => {
            const segmentElement = document.createElement('div');
            segmentElement.style.gridRowStart = segment.y + 1;
            segmentElement.style.gridColumnStart = segment.x + 1;
            segmentElement.classList.add('snake');
            gameBoard.appendChild(segmentElement);
        });

        const foodElement = document.createElement('div');
        foodElement.style.gridRowStart = food.y + 1;
        foodElement.style.gridColumnStart = food.x + 1;
        foodElement.classList.add('food');
        gameBoard.appendChild(foodElement);
    }

    function changeDirection(event) {
        switch (event.key) {
            case 'ArrowUp':
                if (direction.y === 0) nextDirection = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
                if (direction.y === 0) nextDirection = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
                if (direction.x === 0) nextDirection = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
                if (direction.x === 0) nextDirection = { x: 1, y: 0 };
                break;
        }
    }

    function handleTouchStart(event) {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }

    function handleTouchMove(event) {
        if (event.touches.length > 1) return; // Ignore if multiple touches

        const touch = event.touches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0 && direction.x === 0) {
                nextDirection = { x: 1, y: 0 };
            } else if (deltaX < 0 && direction.x === 0) {
                nextDirection = { x: -1, y: 0 };
            }
        } else {
            // Vertical swipe
            if (deltaY > 0 && direction.y === 0) {
                nextDirection = { x: 0, y: 1 };
            } else if (deltaY < 0 && direction.y === 0) {
                nextDirection = { x: 0, y: -1 };
            }
        }
    }

    // Event listeners
    document.addEventListener('keydown', changeDirection);
    gameBoard.addEventListener('touchstart', handleTouchStart, { passive: true });
    gameBoard.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    // Mobile control buttons
    upButton.addEventListener('click', () => {
        if (direction.y === 0) nextDirection = { x: 0, y: -1 };
    });
    downButton.addEventListener('click', () => {
        if (direction.y === 0) nextDirection = { x: 0, y: 1 };
    });
    leftButton.addEventListener('click', () => {
        if (direction.x === 0) nextDirection = { x: -1, y: 0 };
    });
    rightButton.addEventListener('click', () => {
        if (direction.x === 0) nextDirection = { x: 1, y: 0 };
    });

    init();
});
