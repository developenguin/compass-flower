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

}

function getCanvasCenter() {
  return { x: canvas.width / 2, y: canvas.height / 2 };
}

window.onload = () => init();
