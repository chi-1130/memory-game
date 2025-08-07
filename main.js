const board = document.getElementById('game-board');
let flippedCards = [];
let lockBoard = false;
let matchedCount = 0;
let totalPairs = 0;
const resetButton = document.getElementById('reset-button');

async function loadConfig() {
  const response = await fetch('config.json');
  const data = await response.json();
  return data.cards;
}

function shuffle(array) {
  // Fisher–Yates shuffle 算法
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCard(imagePath) {
  const card = document.createElement('div');
  card.classList.add('card');

  const img = document.createElement('img');
  img.src = imagePath;

  card.appendChild(img);

  card.addEventListener('click', () => {
    if (lockBoard || card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      checkMatch();
    }
  });

  return card;
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const img1 = card1.querySelector('img').src;
  const img2 = card2.querySelector('img').src;

  if (img1 === img2) {
    matchedCount += 1;
    flippedCards = [];

    if (matchedCount === totalPairs) {
      showWinMessage();
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

async function initGame() {
  const images = await loadConfig();
  const cardImages = shuffle([...images, ...images]); // 每张图两张

  totalPairs = images.length; // 每种图有一对

  cardImages.forEach(imagePath => {
    const card = createCard(imagePath);
    board.appendChild(card);
  });
}

initGame();

function showWinMessage() {
  const winMessage = document.getElementById('win-message');
  winMessage.style.display = 'block';
  resetButton.style.display = 'inline-block';
}

function resetGame() {
  // 清空游戏状态
  board.innerHTML = '';
  flippedCards = [];
  matchedCount = 0;
  lockBoard = false;

  // 隐藏胜利提示和按钮
  document.getElementById('win-message').style.display = 'none';
  resetButton.style.display = 'none';

  // 重新开始游戏
  initGame();
}

resetButton.addEventListener('click', resetGame);