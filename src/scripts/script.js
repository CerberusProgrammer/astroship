import { createStar, moveStars } from "./stars.js";

document.addEventListener("DOMContentLoaded", () => {
  const spaceship = document.getElementById("spaceship");
  const gameContainer = document.getElementById("game-container");
  let spaceshipX = gameContainer.clientWidth / 2;
  const spaceshipSpeed = 5;
  const bulletSpeed = 5;
  const bullets = [];
  let keys = {};

  function moveSpaceship() {
    spaceship.style.left = `${spaceshipX}px`;
  }

  function shootBullet() {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = `${spaceshipX - 5}px`;
    bullet.style.bottom = "150px";
    gameContainer.appendChild(bullet);
    bullets.push(bullet);
  }

  function updateBullets() {
    bullets.forEach((bullet, index) => {
      const bulletBottom = parseInt(bullet.style.bottom);
      if (bulletBottom > gameContainer.clientHeight) {
        bullet.remove();
        bullets.splice(index, 1);
      } else {
        bullet.style.bottom = `${bulletBottom + bulletSpeed}px`;
      }
    });
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
    moveStars();
    if (Math.random() < 0.05) {
      createStar();
    }
    requestAnimationFrame(gameLoop);
  }

  moveSpaceship();
  gameLoop();
});
