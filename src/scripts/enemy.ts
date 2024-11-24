import type { Bullet } from "./bullet";

export class Enemy {
  element: HTMLDivElement;
  health: number;
  speed: number;
  bulletSpeed: number;
  bullets: Bullet[] = [];
  bulletPool: Bullet[] = [];
  direction: string;

  constructor(private gameContainer: HTMLDivElement) {
    this.element = document.createElement("div");
    this.element.classList.add("enemy");
    const size = Math.random() * 30 + 20;
    this.element.style.width = `${size}px`;
    this.element.style.height = `${size}px`;
    this.element.style.left = `${Math.random() * (gameContainer.clientWidth - size)}px`;
    this.element.style.top = "0px";
    this.health = Math.ceil(size / 10);
    this.direction = Math.random() < 0.5 ? "left" : "right";
    this.speed = 2;
    this.bulletSpeed = 5;
    gameContainer.appendChild(this.element);
  }

  move() {
    const enemyLeft = parseInt(this.element.style.left);
    const direction = this.direction === "left" ? -1 : 1;
    const newLeft = enemyLeft + direction * this.speed;
    if (newLeft <= 0) {
      this.direction = "right";
    } else if (
      newLeft >=
      this.gameContainer.clientWidth - parseInt(this.element.style.width)
    ) {
      this.direction = "left";
    }
    this.element.style.left = `${newLeft}px`;
  }

  shoot() {
    if (Math.random() < 0.01) {
      const bullet = this.getBullet();
      bullet.style.left = `${parseInt(this.element.style.left) + parseInt(this.element.style.width) / 2 - 2}px`;
      bullet.style.top = `${parseInt(this.element.style.top) + parseInt(this.element.style.height)}px`;
      this.gameContainer.appendChild(bullet);
      this.bullets.push(bullet);
    }
  }

  updateBullets() {
    this.bullets.forEach((bullet, index) => {
      const bulletTop = parseInt(bullet.style.top);
      if (bulletTop > this.gameContainer.clientHeight) {
        bullet.remove();
        this.bullets.splice(index, 1);
      } else {
        bullet.style.top = `${bulletTop + this.bulletSpeed}px`;
      }
    });
  }

  private getBullet(): Bullet {
    let bullet: Bullet;
    if (this.bulletPool.length > 0) {
      bullet = this.bulletPool.pop()!;
      bullet.style.display = "block";
    } else {
      bullet = document.createElement("div") as Bullet;
      bullet.classList.add("enemy-bullet");
      this.gameContainer.appendChild(bullet);
    }
    return bullet;
  }
}
