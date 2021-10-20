(() => {
  const shareData = {
    title: "Binamon Run Training",
    text: "Practice your fingers through this lite web-based version of Binamon Run!",
    url: "https://clrke.github.io/bmontrain/",
  }

  const ads = document.querySelector(".initial-screen");
  const closeAdButton = ads.querySelector(".close-initial-screen");
  const adTimer = closeAdButton.querySelector(".initial-screen-timer");
  let adTimerSeconds = 5;
  const adCountdownInterval = setInterval(() => {
    adTimerSeconds--;
    adTimer.textContent = adTimerSeconds;

    if (!adTimerSeconds) {
      clearInterval(adCountdownInterval);
      closeAdButton.disabled = false;
    }
  }, 1000);

  // closeAdButton.addEventListener('click', () => {
    ads.style.display = 'none';
    // setNewElement();
    // initializeGame();
  // });

  const toolsDiv = document.querySelector(".tools");
  const shareButton = toolsDiv.querySelector(".share");
  const shouldShakeCheckbox = toolsDiv.querySelector("input.should-shake");
  const shouldOffsetCheckbox = toolsDiv.querySelector("input.should-offset");
  const hasCircleTimerCheckbox = toolsDiv.querySelector("input.has-circle-timer");

  shareButton.addEventListener("click", async () => {
    try {
      await navigator.share(shareData)
      alert("Shared successfully!");
    } catch(err) {
      const copyText = document.querySelector(".url-copy");
      copyText.value = `${shareData.text} ${shareData.url}`;

      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */

      navigator.clipboard.writeText(copyText.value);
      shareButton.textContent = "Copied!";
    }
  });

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

  const body = document.querySelector("body");
  const game = body.querySelector(".game");
  const controls = body.querySelector(".controls");

  const elementsDiv = game.querySelector(".elements");
  const elementDivs = [...elementsDiv.querySelectorAll(".element")];
  const controlDivs = [...controls.querySelectorAll(".element")];

  let circleTimer;
  const circleTimerTemplate = elementsDiv.querySelector(".circle-timer.template");

  const [waterDiv, forestDiv, lightDiv, fireDiv] = elementDivs;
  const ELEMENTS_MAP = {
    "water": waterDiv,
    "forest": forestDiv,
    "light": lightDiv,
    "fire": fireDiv,
  };

  const ZOOM_TYPE_CHOICES = [
    "top",
    "left",
    "right",
    "bottom",
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ];

  const scoreDiv = game.querySelector(".score");
  const statsDiv = game.querySelector(".stats");
  const surviveDiv = statsDiv.querySelector(".survive");
  const speedDiv = statsDiv.querySelector(".speed");

  let circleTimerTimeout;
  let endScreenShake;

  function initializeGame() {
    startTime = new Date();
    score = -1;
    gameOver = false;
    surviveDiv.textContent = "";
    speedDiv.textContent = "";
  }

  function endGame() {
    if (!gameOver) {
      const secondsSurvived = (new Date().getTime() - startTime) / 1000;
      surviveDiv.textContent = `You survived for ${secondsSurvived.toFixed(2)}s`;
      speedDiv.textContent = `Speed: ${(score / secondsSurvived).toFixed(2)} hits/sec`;
      if (circleTimer) {
        elementsDiv.removeChild(circleTimer);
        circleTimer = null;
        clearTimeout(circleTimerTimeout);
      }
    }
    gameOver = true;
  }

  function setNewElement() {
    elementDivs.forEach(elementDiv => {
      elementDiv.classList.add("hidden");
    });

    const hasCircleTimer = hasCircleTimerCheckbox.checked;

    if (circleTimer) {
      elementsDiv.removeChild(circleTimer);
      circleTimer = null;
    }

    if (hasCircleTimer) {
      circleTimer = circleTimerTemplate.cloneNode();
      circleTimer.classList.remove("template");
      elementsDiv.append(circleTimer);
    }

    const randomElementId = Math.floor(Math.random() * 4);
    elementDivs[randomElementId].classList.remove("hidden");

    const shouldShake = shouldShakeCheckbox.checked;
    const shouldOffset = shouldOffsetCheckbox.checked;
    const zoomType = ZOOM_TYPE_CHOICES[Math.floor(Math.random() * 8)];

    if (shouldShake) game.classList.add("animate");
    if (shouldOffset) game.classList.add(zoomType);


    clearTimeout(endScreenShake);
    endScreenShake = setTimeout(() => {
      game.classList.remove("animate");
      ZOOM_TYPE_CHOICES.forEach(type => {
        game.classList.remove(type);
      });
    }, 500);

    if (hasCircleTimer) {
      circleTimer.classList.add("ongoing");
      clearTimeout(circleTimerTimeout);
      circleTimerTimeout = setTimeout(() => {
        game.classList.remove("ongoing");
        endGame();
      }, 1000);
    }
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
    const element = control.getAttribute("data-element");
    control.addEventListener("click", () => {
      activateElement(element);
    });
  });

  setNewElement();
})();
