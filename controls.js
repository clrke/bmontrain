(() => {
  const ELEMENTS = {
    "KeyW": "water",
    "ArrowUp": "water",
    "KeyA": "forest",
    "ArrowLeft": "forest",
    "KeyD": "light",
    "ArrowRight": "light",
    "KeyS": "fire",
    "ArrowDown": "fire",
  };

  let startTime;
  let score;
  let gameOver = true;

  const body = document.querySelector('body');
  const game = body.querySelector('.game');
  const controls = body.querySelector('.controls');

  const elementDivs = [...game.querySelectorAll('.element')];
  const controlDivs = [...controls.querySelectorAll('.element')];

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

  let endScreenShake;

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
    clearTimeout(endScreenShake);
    endScreenShake = setTimeout(() => {
      game.classList.remove("animate");
    }, 500);
  }

  function activateElement(element) {
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
  }

  body.onkeydown = (e) => {
    const element = ELEMENTS[e.code];

    if (!element) return;

    activateElement(element);
  };

  controlDivs.forEach(control => {
    const element = control.getAttribute('data-element');
    control.addEventListener('click', () => {
      activateElement(element);
    });
  });

  setNewElement();
})();
