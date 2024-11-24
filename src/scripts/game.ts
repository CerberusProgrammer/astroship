import { Spaceship } from "./spaceship";
import { PolygonEnemy } from "./enemy";
import { createStar, moveStars } from "./stars";
import { isPointInTriangle } from "../utils/isPointInTriangle";

document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById(
    "game-container"
  ) as HTMLDivElement;
  const spaceship = new Spaceship(gameContainer);
  const enemies: PolygonEnemy[] = [];
  const maxEnemies = 4;
  const enemySpawnCooldown = 8000;
  let lastEnemySpawnTime = 0;
  const trianglePoints = [
    { x: 0, y: -20 },
    { x: -20, y: 20 },
    { x: 20, y: 20 },
  ];

  function detectCollisions() {
    spaceship.bullets.forEach((bullet, bulletIndex) => {
      enemies.forEach((enemy, enemyIndex) => {
        const bulletRect = bullet.getBoundingClientRect();
        const enemyRect = enemy.element.getBoundingClientRect();
        if (
          bulletRect.left < enemyRect.right &&
          bulletRect.right > enemyRect.left &&
          bulletRect.top < enemyRect.bottom &&
          bulletRect.bottom > enemyRect.top
        ) {
          bullet.style.display = "none";
          spaceship.bullets.splice(bulletIndex, 1);
          spaceship.bulletPool.push(bullet);
          enemy.takeDamage();
          enemy.health -= 1;
          if (enemy.health <= 0) {
            enemy.remove();
            enemies.splice(enemyIndex, 1);
            createEnemy();
          }
        }
      });
    });

    enemies.forEach((enemy) => {
      enemy.bullets.forEach((bullet, bulletIndex) => {
        const bulletRect = bullet.getBoundingClientRect();
        const spaceshipRect = spaceship.element.getBoundingClientRect();
        const bulletX = bulletRect.left + bulletRect.width / 2;
        const bulletY = bulletRect.top + bulletRect.height / 2;

        const shipCenterX = spaceshipRect.left + spaceshipRect.width / 2;
        const shipCenterY = spaceshipRect.top + spaceshipRect.height / 2;

        const absolutePoints = trianglePoints.map((point) => ({
          x: point.x + shipCenterX,
          y: point.y + shipCenterY,
        }));

        if (
          isPointInTriangle(
            bulletX,
            bulletY,
            absolutePoints[0].x,
            absolutePoints[0].y,
            absolutePoints[1].x,
            absolutePoints[1].y,
            absolutePoints[2].x,
            absolutePoints[2].y
          )
        ) {
          bullet.remove();
          enemy.bullets.splice(bulletIndex, 1);
          resetGame();
        }
      });
    });

    enemies.forEach((enemy) => {
      const enemyRect = enemy.element.getBoundingClientRect();
      const spaceshipRect = spaceship.element.getBoundingClientRect();
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
    spaceship.bullets.forEach((bullet) => bullet.remove());
    spaceship.bullets.length = 0;
    spaceship.bulletPool.length = 0;
    enemies.forEach((enemy) => enemy.remove());
    enemies.length = 0;
    spaceship.x = gameContainer.clientWidth / 2;
    spaceship.move();
  }

  function createEnemy() {
    const sides = Math.floor(Math.random() * 13) + 3; // Random number of sides between 3 and 15
    const enemy = new PolygonEnemy(gameContainer, sides);
    enemies.push(enemy);
  }

  function gameLoop() {
    spaceship.updatePosition();
    spaceship.updateBullets();
    enemies.forEach((enemy) => {
      enemy.move();
      enemy.shoot();
      enemy.updateBullets();
    });
    detectCollisions();
    moveStars();

    const currentTime = Date.now();
    if (
      enemies.length < maxEnemies &&
      currentTime - lastEnemySpawnTime >= enemySpawnCooldown * enemies.length
    ) {
      createEnemy();
      lastEnemySpawnTime = currentTime;
    }

    if (Math.random() < 0.05) {
      createStar();
    }

    requestAnimationFrame(gameLoop);
  }

  spaceship.move();
  gameLoop();
});
