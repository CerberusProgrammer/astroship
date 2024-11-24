import { createStar, moveStars } from "./stars.js";

document.addEventListener("DOMContentLoaded", () => {
  const spaceship = document.getElementById("spaceship");
  const gameContainer = document.getElementById("game-container");
  let spaceshipX = gameContainer.clientWidth / 2;
  const spaceshipSpeed = 5;
  const bulletSpeed = 5;
  const bullets = [];
  const bulletPool = [];
  const enemies = [];
  const enemyBullets = [];
  let keys = {};
  let lastShotTime = 0;
  const shotCooldown = 500;
  const maxEnemies = 5;
  let lastEnemySpawnTime = 0;
  const enemySpawnCooldown = 6000;

  function moveSpaceship() {
    spaceship.style.left = `${spaceshipX}px`;
  }

  function shootBullet() {
    const currentTime = Date.now();
    if (currentTime - lastShotTime < shotCooldown) return;
    lastShotTime = currentTime;

    let bullet;
    if (bulletPool.length > 0) {
      bullet = bulletPool.pop();
      bullet.style.display = "block";
    } else {
      bullet = document.createElement("div");
      bullet.classList.add("bullet");
      gameContainer.appendChild(bullet);
    }

    bullet.style.left = `${spaceshipX - 5}px`;
    bullet.style.bottom = "150px";
    bullets.push(bullet);
  }

  function updateBullets() {
    bullets.forEach((bullet, index) => {
      const bulletBottom = parseInt(bullet.style.bottom);
      if (bulletBottom > gameContainer.clientHeight) {
        bullet.style.display = "none";
        bullets.splice(index, 1);
        bulletPool.push(bullet);
      } else {
        bullet.style.bottom = `${bulletBottom + bulletSpeed}px`;
      }
    });
  }

  function createEnemy() {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    const size = Math.random() * 30 + 20;
    enemy.style.width = `${size}px`;
    enemy.style.height = `${size}px`;
    enemy.style.left = `${Math.random() * (gameContainer.clientWidth - size)}px`;
    enemy.style.top = "0px";
    enemy.health = Math.ceil(size / 10);
    enemy.dataset.direction = Math.random() < 0.5 ? "left" : "right";
    gameContainer.appendChild(enemy);
    enemies.push(enemy);
  }

  function moveEnemies() {
    enemies.forEach((enemy) => {
      const enemyLeft = parseInt(enemy.style.left);
      const direction = enemy.dataset.direction === "left" ? -1 : 1;
      const newLeft = enemyLeft + direction * 2;
      if (newLeft <= 0) {
        enemy.dataset.direction = "right";
      } else if (
        newLeft >=
        gameContainer.clientWidth - parseInt(enemy.style.width)
      ) {
        enemy.dataset.direction = "left";
      }
      enemy.style.left = `${newLeft}px`;
    });
  }

  function enemyShoot() {
    enemies.forEach((enemy) => {
      if (Math.random() < 0.01) {
        const bullet = document.createElement("div");
        bullet.classList.add("enemy-bullet");
        bullet.style.left = `${parseInt(enemy.style.left) + parseInt(enemy.style.width) / 2 - 2}px`;
        bullet.style.top = `${parseInt(enemy.style.top) + parseInt(enemy.style.height)}px`;
        gameContainer.appendChild(bullet);
        enemyBullets.push(bullet);
      }
    });
  }

  function updateEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
      const bulletTop = parseInt(bullet.style.top);
      if (bulletTop > gameContainer.clientHeight) {
        bullet.remove();
        enemyBullets.splice(index, 1);
      } else {
        bullet.style.top = `${bulletTop + bulletSpeed}px`;
      }
    });
  }

  function detectCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
      enemies.forEach((enemy, enemyIndex) => {
        const bulletRect = bullet.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();
        if (
          bulletRect.left < enemyRect.right &&
          bulletRect.right > enemyRect.left &&
          bulletRect.top < enemyRect.bottom &&
          bulletRect.bottom > enemyRect.top
        ) {
          bullet.style.display = "none";
          bullets.splice(bulletIndex, 1);
          bulletPool.push(bullet);
          enemy.health -= 1;
          if (enemy.health <= 0) {
            enemy.remove();
            enemies.splice(enemyIndex, 1);
            createEnemy();
          }
        }
      });
    });

    enemyBullets.forEach((bullet, bulletIndex) => {
      const bulletRect = bullet.getBoundingClientRect();
      const spaceshipRect = spaceship.getBoundingClientRect();
      if (
        bulletRect.left < spaceshipRect.right &&
        bulletRect.right > spaceshipRect.left &&
        bulletRect.top < spaceshipRect.bottom &&
        bulletRect.bottom > spaceshipRect.top
      ) {
        resetGame();
      }
    });

    enemies.forEach((enemy) => {
      const enemyRect = enemy.getBoundingClientRect();
      const spaceshipRect = spaceship.getBoundingClientRect();
      if (
        enemyRect.left < spaceshipRect.right &&
        enemyRect.right > spaceshipRect.left &&
        enemyRect.top < spaceshipRect.bottom &&
        enemyRect.bottom > spaceshipRect.top
      ) {
        resetGame();
      }
    });
  }

  function resetGame() {
    bullets.forEach((bullet) => bullet.remove());
    bullets.length = 0;
    bulletPool.length = 0;
    enemies.forEach((enemy) => enemy.remove());
    enemies.length = 0;
    enemyBullets.forEach((bullet) => bullet.remove());
    enemyBullets.length = 0;
    spaceshipX = gameContainer.clientWidth / 2;
    moveSpaceship();
  }

  function updateSpaceshipPosition() {
    let isMoving = false;
    if (keys["a"] || keys["A"]) {
      spaceshipX = Math.max(0, spaceshipX - spaceshipSpeed);
      spaceship.style.transform = `translate(-50%, -50%) rotate(-10deg)`;
      isMoving = true;
    }
    if (keys["d"] || keys["D"]) {
      spaceshipX = Math.min(
        gameContainer.clientWidth - 40,
        spaceshipX + spaceshipSpeed
      );
      spaceship.style.transform = `translate(-50%, -50%) rotate(10deg)`;
      isMoving = true;
    }
    if (!keys["a"] && !keys["A"] && !keys["d"] && !keys["D"]) {
      spaceship.style.transform = `translate(-50%, -50%) rotate(0deg)`;
    }
    if (isMoving) {
      spaceship.classList.add("moving");
    } else {
      spaceship.classList.remove("moving");
    }
    moveSpaceship();
  }

  document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
    if (event.key === " ") {
      shootBullet();
    }
  });

  document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
  });

  function gameLoop() {
    updateSpaceshipPosition();
    updateBullets();
    moveEnemies();
    enemyShoot();
    updateEnemyBullets();
    detectCollisions();
    moveStars();

    const currentTime = Date.now();
    if (
      enemies.length < maxEnemies &&
      currentTime - lastEnemySpawnTime >= enemySpawnCooldown
    ) {
      createEnemy();
      lastEnemySpawnTime = currentTime;
    }

    if (Math.random() < 0.05) {
      createStar();
    }

    requestAnimationFrame(gameLoop);
  }

  moveSpaceship();
  gameLoop();
});
