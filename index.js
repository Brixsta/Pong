const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const global = {
  leftPaddleScore: 0,
  rightPaddleScore: 0,
};

const respawnBall = () => {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.xVelocity = randomVelocity();
  ball.yVelocity = randomVelocity();
};

const updateScoreBoardText = () => {
  const scoreBoardText = document.querySelector(".score-board-text");
  scoreBoardText.innerText = `${global.leftPaddleScore} | ${global.rightPaddleScore}`;
};

const incrementScore = () => {
  if (ball.x > canvas.width) {
    global.leftPaddleScore++;
  }
  if (ball.x < 0) {
    global.rightPaddleScore++;
  }
  respawnBall();
  updateScoreBoardText();
};

const createScoreBoard = () => {
  const scoreBoardContainer = document.createElement("div");
  scoreBoardContainer.classList.add("score-board-container");
  const canvasContainer = document.querySelector(".canvas-container");
  canvasContainer.appendChild(scoreBoardContainer);
  const scoreBoardText = document.createElement("span");
  scoreBoardText.classList.add("score-board-text");
  scoreBoardContainer.appendChild(scoreBoardText);
  scoreBoardText.innerText = `${global.leftPaddleScore} | ${global.rightPaddleScore}`;
};

const randomVelocity = () => {
  const values = [-5, 5];
  const randomNum = Math.floor(Math.random() * values.length);
  return values[randomNum];
};

const handleMouseMove = (e) => {
  const root = document.documentElement;
  const rect = canvas.getBoundingClientRect();
  let y = e.clientY - rect.top - root.scrollTop;

  if (y < leftPaddle.height / 2) {
    leftPaddle.y = 0;
  } else if (y > canvas.height - leftPaddle.height / 2) {
    leftPaddle.y = canvas.height - leftPaddle.height;
  } else {
    leftPaddle.y = y - leftPaddle.height / 2;
  }
};

window.addEventListener("mousemove", handleMouseMove);

const animate = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(animate);
  ball.draw();
  ball.move();
  leftPaddle.draw();
  leftPaddle.collidesWithBall();
  rightPaddle.draw();
  rightPaddle.move();
  rightPaddle.collidesWithBall();
};

class Ball {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2 + 20;
    this.radius = 20;
    this.xVelocity = randomVelocity();
    this.yVelocity = randomVelocity();
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  move() {
    if (this.x < 0 || this.x > canvas.width) incrementScore();
    if (this.y < 0 || this.y > canvas.height) this.yVelocity *= -1;
    this.x += this.xVelocity;
    this.y += this.yVelocity;
  }
}

class LeftPaddle {
  constructor() {
    this.width = 30;
    this.height = 150;
    this.x = 0;
    this.y = canvas.height / 2 - this.height / 2;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  collidesWithBall() {
    // collision detection for ball and paddle
    if (
      ball.y > leftPaddle.y &&
      ball.y < leftPaddle.y + leftPaddle.height &&
      ball.x > leftPaddle.x &&
      ball.x < leftPaddle.x + leftPaddle.width
    ) {
      ball.xVelocity *= -1;
    }
    // check if ball hits top of paddle
    if (
      (ball.y === leftPaddle.y &&
        ball.x > leftPaddle.x &&
        ball.x < leftPaddle.x + leftPaddle.width) ||
      (ball.y === leftPaddle.y + leftPaddle.height &&
        ball.x > leftPaddle.x &&
        ball.x < leftPaddle.x + leftPaddle.width)
    ) {
      ball.x += ball.radius;
    }
  }
}

class RightPaddle {
  constructor() {
    this.height = 150;
    this.width = 30;
    this.x = canvas.width - this.width;
    this.y = canvas.height / 2 - this.height / 2;
    this.yVelocity = 8;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    if (this.y >= canvas.height - this.height) {
      this.yVelocity *= -1;
    }
    if (this.y <= 0) {
      this.yVelocity *= -1;
    }

    this.y += this.yVelocity;
  }

  collidesWithBall() {
    // check for collision with ball
    if (
      ball.y > rightPaddle.y &&
      ball.y < rightPaddle.y + rightPaddle.height &&
      ball.x > rightPaddle.x &&
      ball.x < rightPaddle.x + rightPaddle.width
    ) {
      ball.xVelocity *= -1;
    }
    // check for collision with top of paddle
    if (
      (ball.y === rightPaddle.y &&
        ball.x > rightPaddle.x &&
        ball.x < rightPaddle.x + rightPaddle.width) ||
      (ball.y === rightPaddle.y + rightPaddle.height &&
        ball.x > rightPaddle.x &&
        ball.x < rightPaddle.x + rightPaddle.width)
    ) {
      ball.x -= ball.radius;
    }
  }
}

const ball = new Ball();
const leftPaddle = new LeftPaddle();
const rightPaddle = new RightPaddle();

window.onload = () => {
  createScoreBoard();
  animate();
};
