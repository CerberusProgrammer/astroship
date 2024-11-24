import type { Bullet } from "./bullet";

export class Enemy {
  element: HTMLDivElement;
  health: number;
  speed: number;
  bulletSpeed: number;
  bullets: Bullet[] = [];
  bulletPool: Bullet[] = [];
  direction: string;

  constructor(protected gameContainer: HTMLDivElement) {
    this.element = document.createElement("div");
    this.element.classList.add("enemy");
    this.health = 1;
    this.speed = 2;
    this.bulletSpeed = 5;
    this.direction = Math.random() < 0.5 ? "left" : "right";
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

  protected getBullet(): Bullet {
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

  remove() {
    this.bullets.forEach((bullet) => bullet.remove());
    this.bullets.length = 0;
    this.element.remove();
  }
}

export class PolygonEnemy extends Enemy {
  isEntering: boolean;

  constructor(gameContainer: HTMLDivElement, sides: number) {
    super(gameContainer);
    this.element.classList.add("polygon-enemy");
    this.element.style.width = `${sides * 10}px`;
    this.element.style.height = `${sides * 10}px`;
    this.element.style.left = `${Math.random() * (gameContainer.clientWidth - sides * 10)}px`;
    this.element.style.top = `-${sides * 10}px`;
    this.health = sides;
    this.speed = 2;
    this.bulletSpeed = 5 * (sides / 3);
    this.element.style.backgroundColor = this.getRandomColor();
    this.createPolygon(sides);
    this.isEntering = true;
  }

  private createPolygon(sides: number) {
    const size = parseInt(this.element.style.width);
    const angle = (2 * Math.PI) / sides;
    const points = Array.from({ length: sides }, (_, i) => {
      const x = size / 2 + (size / 2) * Math.cos(i * angle - Math.PI / 2);
      const y = size / 2 + (size / 2) * Math.sin(i * angle - Math.PI / 2);
      return `${x}px ${y}px`;
    }).join(", ");
    this.element.style.clipPath = `polygon(${points})`;
  }

  private getRandomColor() {
    const colors = ["#ff4081", "#3f51b5", "#ffeb3b", "#ff5722", "#4caf50"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  move() {
    if (this.isEntering) {
      const currentTop = parseInt(this.element.style.top);
      const newTop = currentTop + this.speed;
      if (newTop >= 10) {
        this.element.style.top = "10px";
        this.isEntering = false;
      } else {
        this.element.style.top = `${newTop}px`;
      }
    } else {
      super.move();
    }
  }

  shoot() {
    if (!this.isEntering && Math.random() < 0.01 * (this.health / 3)) {
      const bullet = this.getBullet();
      bullet.style.left = `${parseInt(this.element.style.left) + parseInt(this.element.style.width) / 2 - 2}px`;
      bullet.style.top = `${parseInt(this.element.style.top) + parseInt(this.element.style.height)}px`;
      bullet.style.width = `${this.health * 2}px`;
      bullet.style.height = `${this.health * 2}px`;
      this.gameContainer.appendChild(bullet);
      this.bullets.push(bullet);
    }
  }

  takeDamage() {
    this.element.classList.add("damage-pulse");
    setTimeout(() => {
      this.element.classList.remove("damage-pulse");
    }, 200);
  }
}
