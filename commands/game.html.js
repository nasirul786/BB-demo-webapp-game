/*CMD
  command: game.html
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Paper Plane Game</title>
  <script src="https://telegram.org/js/telegram-web-app.js?56"></script>
  <style>
    body {
      margin: 0;
      margin-top: 65px;
      overflow: hidden;
      background-color: #000;
    }
    canvas {
      display: block;
    }
    #gameOverPopup {
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: red;
      font-weight: bold;
      text-align: center;
      padding: 20px;
      border-radius: 15px;
    }
    #restartButton {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 5px;
      cursor: pointer;
    }
    #restartButton:hover {
      background-color: #218838;
    }
  </style>
</head>
<body>
<canvas id="gameCanvas"></canvas>
<div id="gameOverPopup">
  <h2>Game Over!</h2>
  <p Score: <span id="finalScore">0</span></p>
  <p>High Score: <span id="highScorePopup">0</span></p>
  <button id="restartButton">Restart</button>
  <audio id="backgroundMusic" loop>
  <source src="https://logicalhuman.link/test/music.mp3" type="audio/mp3">
</audio>
</div>

<script>
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const popup = document.getElementById('gameOverPopup');
  const finalScoreEl = document.getElementById('finalScore');
  const highScorePopupEl = document.getElementById('highScorePopup');
  const restartButton = document.getElementById('restartButton');
  window.Telegram.WebApp.requestFullscreen();
  window.Telegram.WebApp.isClosingConfirmationEnabled = true;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let plane = { x: canvas.width / 2, y: canvas.height - 100, size: 100, image: new Image() };
  let bullets = [];
  let objects = [];
  let score = 0;
  let highScore = 0;
  let gameOver = false;

  const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
  const cloudStorage = window.Telegram.WebApp.CloudStorage;

  plane.image.src = 'https://logicalhuman.link/test/rocket.png';
  const objectImages = ['https://logicalhuman.link/test/asteroid.png', 'https://logicalhuman.link/test/asteroid2.png'];

  function drawImage(x, y, size, imgSrc) {
    const img = new Image();
    img.src = imgSrc;
    ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
  }

  function createRandomObject() {
    const imgSrc = objectImages[Math.floor(Math.random() * objectImages.length)];
    const size = 30 + Math.random() * 30;
    const xPosition = 15 + size / 2 + Math.random() * (canvas.width - 30 - size);

    objects.push({ x: xPosition, y: -size, size, imgSrc });
  }

  function drawPlane() {
    ctx.drawImage(plane.image, plane.x - plane.size / 2, plane.y - plane.size / 2, plane.size, plane.size);
  }

  function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach((bullet) => {
      ctx.fillRect(bullet.x - 2, bullet.y - 10, 4, 10);
    });
  }

  function drawObjects() {
    objects.forEach((obj) => {
      drawImage(obj.x, obj.y, obj.size, obj.imgSrc);
    });
  }

  function update() {
    bullets.forEach((bullet) => {
      bullet.y -= 5;
    });

    bullets = bullets.filter(bullet => bullet.y > 0);

    objects.forEach((obj) => {
      obj.y += 3;
      if (obj.y + obj.size / 2 >= canvas.height) {
        endGame();
      }
    });

    bullets.forEach((bullet, bulletIndex) => {
      objects.forEach((obj, objIndex) => {
        if (bullet.x > obj.x - obj.size / 2 && bullet.x < obj.x + obj.size / 2 &&
            bullet.y > obj.y - obj.size / 2 && bullet.y < obj.y + obj.size / 2) {
          objects.splice(objIndex, 1);
          bullets.splice(bulletIndex, 1);
          window.Telegram.WebApp.HapticFeedback.notificationOccurred("success")
          score++;
          if (score > highScore) {
            highScore = score;
            saveHighScore();
          }
        }
      });
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlane();
    drawBullets();
    drawObjects();

    ctx.fillStyle = 'red';
    ctx.font = '20px serif';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, canvas.width - 150, 30);
  }

  function gameLoop() {
    if (!gameOver) {
      update();
      render();
      requestAnimationFrame(gameLoop);
    }
  }

  function continuousFire() {
    setInterval(() => {
      if (!gameOver) {
        bullets.push({ x: plane.x, y: plane.y });
      }
    }, 200);
  }

  function startGame() {
    backgroundMusic.play().catch(() => console.error('Background music failed to play.'));
    gameLoop();

    setInterval(createRandomObject, 2000);
    continuousFire();
    loadHighScore();
    gameLoop();

    window.Telegram.WebApp.Accelerometer.start({ refresh_rate: 200 }, (success) => {
      if (success) {
        setInterval(() => {
          const { x } = window.Telegram.WebApp.Accelerometer;
          plane.x += x * 5;
          plane.x = Math.max(plane.size / 2, Math.min(canvas.width - plane.size / 2, plane.x));
        }, 50);
      } else {
        console.error("Failed to start accelerometer tracking.");
      }
    });
  }

  function endGame() {
    gameOver = true;
    finalScoreEl.textContent = score;
    highScorePopupEl.textContent = highScore;
    popup.style.display = 'block';
  }

  function saveHighScore() {
    cloudStorage.setItem(userId, highScore.toString(), (error) => {
      if (error) {
        console.error("Error saving high score:", error);
      }
    });
  }

  function loadHighScore() {
    cloudStorage.getItem(userId, (error, value) => {
      if (!error && value) {
        highScore = parseInt(value, 10) || 0;
      } else {
        highScore = 0;
      }
    });
  }

  restartButton.addEventListener('click', () => {
    popup.style.display = 'none';
    score = 0;
    objects = [];
    bullets = [];
    gameOver = false;
    startGame();
  });

  startGame();
</script>
</body>
</html>
