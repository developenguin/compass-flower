const canvas = document.getElementById('app'),
      ctx = canvas.getContext('2d'),
      pointsInput = document.getElementById('points');

function init() {

  redrawCanvas();
  registerEventListeners();

}

function registerEventListeners() {

  pointsInput.addEventListener('input', () => redrawCanvas());

  onresize = () => redrawCanvas();

}

function redrawCanvas() {

  const n = getNValue();

  resetCanvas();

}

function getNValue() {

  const n = parseInt(pointsInput.value, 10);

  document.getElementById('points-label').innerText = `${n}`;

  return n;

}

function resetCanvas() {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawFlower();

}

function drawFlower() {

  const points = getPointsForN(getNValue());

  drawCenterCircle();

  points.forEach(point => {
    drawCircle(point);
  });

}

function getPointsForN(n) {

  const points = [],
    center = getCanvasCenter(),
    segmentAngleRadian = 2 * Math.PI / n,
    circleRadius = getCircleRadius();

  for (let i = 1; i <= n; i++) {
    points.push({
      x: center.x + circleRadius * Math.cos(i * segmentAngleRadian),
      y: center.y + circleRadius * Math.sin(i * segmentAngleRadian)
    });
  }

  return points;

}

function drawCenterCircle() {

  const center = getCanvasCenter();

  drawCircle(center);

}

function drawCircle(center) {

  const radius = getCircleRadius();

  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  ctx.stroke();

}

function getCanvasCenter() {
  return { x: canvas.width / 2, y: canvas.height / 2 };
}

function getCircleRadius() {
  return canvas.width > canvas.height
    ? canvas.height / 5
    : canvas.width / 5;
}

window.onload = () => init();
