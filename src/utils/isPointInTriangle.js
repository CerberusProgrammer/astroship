export function isPointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
  const area = Math.abs(
    (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0
  );
  const area1 = Math.abs(
    (px * (y2 - y3) + x2 * (y3 - py) + x3 * (py - y2)) / 2.0
  );
  const area2 = Math.abs(
    (x1 * (py - y3) + px * (y3 - y1) + x3 * (y1 - py)) / 2.0
  );
  const area3 = Math.abs(
    (x1 * (y2 - py) + x2 * (py - y1) + px * (y1 - y2)) / 2.0
  );

  return Math.abs(area - (area1 + area2 + area3)) < 0.1;
}
