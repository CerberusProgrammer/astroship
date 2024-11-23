const starsContainer = document.getElementById("stars");
const stars = [];
const maxStars = 200;
const gameContainer = document.getElementById("game-container");

export function createStar() {
  if (stars.length >= maxStars) return;
  const star = document.createElement("div");
  star.classList.add("star");
  const sizeClass =
    Math.random() < 0.7 ? "small" : Math.random() < 0.9 ? "medium" : "large";
  star.classList.add(sizeClass);
  star.style.left = `${Math.random() * 100}vw`;
  star.style.top = `0px`;
  starsContainer.appendChild(star);
  stars.push(star);
}

export function moveStars() {
  stars.forEach((star, index) => {
    const starTop = parseInt(star.style.top);
    if (starTop > gameContainer.clientHeight) {
      star.remove();
      stars.splice(index, 1);
    } else {
      star.style.top = `${starTop + 1}px`;
    }
  });
}
