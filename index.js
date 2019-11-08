const canvas = document.getElementById('app'),
      ctx = canvas.getContext('2d'),
      pointsInput = document.getElementById('points');

class Circle {

  constructor(props) {
    this.x = props.x;
    this.y = props.y;
    this.r = props.r;
  }

  isSameAs(circle = {}) {

    const thisX = parseFloat(this.x.toFixed(6)),
          thisY = parseFloat(this.y.toFixed(6)),
          otherX = parseFloat(circle.x.toFixed(6)),
          otherY = parseFloat(circle.y.toFixed(6));

    return thisX === otherX && thisY === otherY && this.r === circle.r

  }

  getCenter() {
    return {
      x: this.x,
      y: this.y
    }
  }

}

function init() {

  redrawCanvas();
  registerEventListeners();

}

function registerEventListeners() {

  pointsInput.addEventListener('input', () => redrawCanvas());

  onresize = () => resetCanvas();

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

  const n = getNValue();
  const layer1 = getCirclesForN(n, center);
  const layer2 = layer1
    .map(circle => getCirclesForN(n, circle.getCenter()))
    .flat();

  const flattened = [...layer1, ...layer2];

  const filtered = flattened.reduce((acc, nextCircle) => {

    const matches = acc.filter(circle => circle.isSameAs(nextCircle));

    if (!matches.length) {
      acc = [...acc, nextCircle];
    }

    return acc;

  }, []);

  filtered.forEach(circle => {
    drawCircle(circle);
  });

}

function getCirclesForN(n, center) {

  const circles = [],
    segmentAngleRadian = 2 * Math.PI / n,
    circleRadius = getCircleRadius();

  for (let i = 1; i <= n; i++) {
    circles.push(new Circle({
      x: center.x + circleRadius * Math.cos(i * segmentAngleRadian),
      y: center.y + circleRadius * Math.sin(i * segmentAngleRadian),
      r: circleRadius
    }));
  }

  return circles;

}

function drawCircle(circle) {

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
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
