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

  drawFigure(getCanvasCenter());

}

function drawFigure(center) {

  const points = getPointsForN(getNValue(), center);

  points.forEach(point => {
    drawFlower(point);
  });

}

function drawFlower(center) {

  const points = getPointsForN(getNValue(), center);

  points.forEach(point => {
    drawCircle(point);
  });

}

function getPointsForN(n, center) {

  const points = [],
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
    ? canvas.height / 6.25
    : canvas.width / 6.25;
}

window.onload = () => init();
