const canvas = document.getElementById('app'),
      ctx = canvas.getContext('2d'),
      pointsInput = document.getElementById('points'),
      toggleControlsButton = document.getElementById('toggle-controls'),
      controlsContainer = document.getElementById('controls'),
      baseColor = document.getElementById('base-color');

function init() {

  resetCanvas();
  registerEventListeners();

}

function registerEventListeners() {

  pointsInput.addEventListener('input', () => resetCanvas());

  onresize = () => resetCanvas();

  toggleControlsButton.addEventListener('click', () => {

    const classList = controlsContainer.classList;

    if (classList.contains('hidden')) {
      classList.remove('hidden');
      toggleControlsButton.innerText = 'Hide controls';
    } else {
      classList.add('hidden');
      toggleControlsButton.innerText = 'Show controls';
    }

  });

  baseColor.addEventListener('change', evt => {

    const color = hexToHSL(evt.target.value);
    const palette = generateMonochromaticScaleFromColor(color);
    console.log(palette);

  });

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

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawFigure(getCanvasCenter());

}

function drawFigure(center) {

  const n = getNValue();
  const layer1 = getCirclesForN(n, center);
  const layer2 = layer1
    .map(circle => getCirclesForN(n, circle.getCenter()))
    .flat();

  const filtered = [...layer1, ...layer2].reduce(
    (acc, nextCircle) => {

      const matches = acc.filter(circle => circle.isSameAs(nextCircle));

      if (!matches.length) {
        acc = [...acc, nextCircle];
      }

      return acc;

    }, []
  );

  colorizeForCircles(filtered);

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

  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
  ctx.stroke();

}

function colorizeForCircles(circles) {

  const canvasCenter = getCanvasCenter();

  const centerCircle = new Circle({
    x: canvasCenter.x,
    y: canvasCenter.y,
    r: getCircleRadius() * 3 // center + static 2 layers for now
  });

  const colors = [
    { r: 255, g: 255, b: 0 },
    { r: 128, g: 128, b: 0 },
    { r: 255, g: 255, b: 255 },
    { r: 255, g: 0, b: 0 }
  ];

  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {

      const point = { x: i, y: j };

      // Skip all points that are guaranteed to be outside of the figure
      if (centerCircle.hasPointInside(point)) {

        const amountOfCirclesAroundPoint = circles
          .filter(circle => circle.hasPointInside(point))
          .length;

        const color = colors[(amountOfCirclesAroundPoint - 1) % colors.length];

        ctx.fillStyle = amountOfCirclesAroundPoint > 0
          ? `rgb(${color.r}, ${color.g}, ${color.b})`
          : 'white';

        ctx.fillRect(i, j, 1, 1);

      }

    }
  }

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
