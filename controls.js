(() => {
  const ELEMENTS = {
    "KeyW": "water",
    "KeyA": "forest",
    "KeyD": "light",
    "KeyS": "fire",
  };

  let startTime;
  let score;
  let gameOver = true;

  const body = document.querySelector('body');
  const game = body.querySelector('.game');

  const elementDivs = [...game.querySelectorAll('.element')];

  const [waterDiv, forestDiv, lightDiv, fireDiv] = elementDivs;
  const ELEMENTS_MAP = {
    "water": waterDiv,
    "forest": forestDiv,
    "light": lightDiv,
    "fire": fireDiv,
  };

  const scoreDiv = game.querySelector('.score');
  const statsDiv = game.querySelector('.stats');
  const surviveDiv = statsDiv.querySelector('.survive');
  const speedDiv = statsDiv.querySelector('.speed');

  function initializeGame() {
    startTime = new Date();
    score = -1;
    gameOver = false;
    surviveDiv.textContent = '';
    speedDiv.textContent = '';
  }

  function endGame() {
    gameOver = true;
    const secondsSurvived = (new Date().getTime() - startTime) / 1000;
    surviveDiv.textContent = `You survived for ${secondsSurvived.toFixed(2)}s`;
    speedDiv.textContent = `Speed: ${(score / secondsSurvived).toFixed(2)} hits/sec`;
  }

  function setNewElement() {
    elementDivs.forEach(elementDiv => {
      elementDiv.classList.add("hidden");
    });

    const randomElementId = Math.floor(Math.random() * 4);
    elementDivs[randomElementId].classList.remove("hidden");

    game.classList.add("animate");
    setTimeout(() => {
      game.classList.remove("animate");
    }, 500);
  }

  body.onkeypress = (e) => {
    const element = ELEMENTS[e.code];

    if (!element) return;

    const elementDiv = ELEMENTS_MAP[element];

    if (gameOver) {
      initializeGame();
    } else if (elementDiv.classList.contains("hidden")) {
      endGame();
      return;
    }

    score += 1;
    scoreDiv.textContent = `${score} points`;

    setNewElement();
  };

  setNewElement();
})();
