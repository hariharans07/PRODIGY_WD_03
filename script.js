const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');
const playerVsPlayerBtn = document.getElementById('player-vs-player');
const playerVsComputerBtn = document.getElementById('player-vs-computer');
const homePage = document.getElementById('home-page');
const gamePage = document.getElementById('game-page');
const messageBox = document.getElementById('message-box');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let isPlayerVsComputer = false;

function showGamePage() {
    homePage.style.display = 'none';
    gamePage.style.display = 'block';
}

function showHomePage() {
    homePage.style.display = 'flex';
    gamePage.style.display = 'none';
}

function handleClick(event) {
    const cellIndex = event.target.getAttribute('data-index');
    if (board[cellIndex] !== '' || !isGameActive) return;

    board[cellIndex] = currentPlayer;
    event.target.textContent = currentPlayer;
    checkWinner();
    if (isPlayerVsComputer && isGameActive) setTimeout(computerMove, 500);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            animateWin(pattern);
            showMessage(`${board[a]} wins!`);
            isGameActive = false;
            return;
        }
    }

    if (!board.includes('')) {
        showMessage("It's a tie!");
        isGameActive = false;
    }
}

function showMessage(message) {
    messageBox.textContent = message;
    messageBox.classList.add('show');
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000);
}

function animateWin(pattern) {
    pattern.forEach(index => {
        cells[index].classList.add('winner');
    });

    setTimeout(() => {
        cells.forEach(cell => cell.classList.remove('winner'));
    }, 2000);
}

function computerMove() {
    const bestMove = findBestMove();
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    checkWinner();
    currentPlayer = 'X';
}

function findBestMove() {
    const availableCells = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);

    let bestScore = -Infinity;
    let move;
    for (const cell of availableCells) {
        board[cell] = 'O';
        const score = minimax(board, 0, false);
        board[cell] = '';
        if (score > bestScore) {
            bestScore = score;
            move = cell;
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    const winner = checkWinnerMinimax(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (!board.includes('')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerMinimax(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
    });
}

playerVsPlayerBtn.addEventListener('click', () => {
    isPlayerVsComputer = false;
    showGamePage();
});

playerVsComputerBtn.addEventListener('click', () => {
    isPlayerVsComputer = true;
    showGamePage();
});

homeBtn.addEventListener('click', showHomePage);
cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);