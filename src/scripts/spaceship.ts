import type { Bullet } from "./bullet";

export class Spaceship {
  element: HTMLDivElement;
  x: number;
  speed: number;
  bulletSpeed: number;
  bullets: Bullet[] = [];
  bulletPool: Bullet[] = [];
  keys: { [key: string]: boolean } = {};

  constructor(private gameContainer: HTMLDivElement) {
    this.element = document.getElementById("spaceship") as HTMLDivElement;
    this.x = gameContainer.clientWidth / 2;
    this.speed = 5;
    this.bulletSpeed = 15;

    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
    document.addEventListener("keyup", (event) => this.handleKeyUp(event));
    document.addEventListener("touchstart", (event) =>
      this.handleTouchStart(event)
    );
  }

  move() {
    this.element.style.left = `${this.x}px`;
  }

  shoot() {
    const bullet = this.getBullet();
    bullet.style.left = `${this.x - 5}px`;
    bullet.style.bottom = "150px";
    this.bullets.push(bullet);
  }

  updateBullets() {
    this.bullets.forEach((bullet, index) => {
      const bulletBottom = parseInt(bullet.style.bottom);
      if (bulletBottom > this.gameContainer.clientHeight) {
        bullet.style.display = "none";
        this.bullets.splice(index, 1);
        this.bulletPool.push(bullet);
      } else {
        bullet.style.bottom = `${bulletBottom + this.bulletSpeed}px`;
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
      bullet.classList.add("bullet");
      this.gameContainer.appendChild(bullet);
    }
    return bullet;
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.keys[event.key] = true;
    if (event.key === " ") {
      this.shoot();
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    this.keys[event.key] = false;
  }

  private handleTouchStart(event: TouchEvent) {
    const touchX = event.touches[0].clientX;
    const screenWidth = window.innerWidth;

    if (touchX < screenWidth / 2) {
      this.x = Math.max(0, this.x - this.speed - 20);
      this.element.style.transform = `translate(-50%, -50%) rotate(-10deg)`;
    } else {
      this.x = Math.min(
        this.gameContainer.clientWidth - 40,
        this.x + this.speed + 20
      );
      this.element.style.transform = `translate(-50%, -50%) rotate(10deg)`;
    }

    this.shoot();
    this.move();
  }

  updatePosition() {
    let isMoving = false;
    if (this.keys["a"] || this.keys["A"]) {
      this.x = Math.max(0, this.x - this.speed);
      this.element.style.transform = `translate(-50%, -50%) rotate(-10deg)`;
      isMoving = true;
    }
    if (this.keys["d"] || this.keys["D"]) {
      this.x = Math.min(
        this.gameContainer.clientWidth - 40,
        this.x + this.speed
      );
      this.element.style.transform = `translate(-50%, -50%) rotate(10deg)`;
      isMoving = true;
    }
    if (
      !this.keys["a"] &&
      !this.keys["A"] &&
      !this.keys["d"] &&
      !this.keys["D"]
    ) {
      this.element.style.transform = `translate(-50%, -50%) rotate(0deg)`;
    }
    if (isMoving) {
      this.element.classList.add("moving");
    } else {
      this.element.classList.remove("moving");
    }
    this.move();
  }
}
