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

  baseColor.addEventListener('change', () => resetCanvas());

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

  const color = hexToHSL(baseColor.value);
  const palette = generateMonochromaticScaleFromColor(color);

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

  colorizeForCircles(filtered, palette);

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

function colorizeForCircles(circles, palette) {

  const canvasCenter = getCanvasCenter();

  const centerCircle = new Circle({
    x: canvasCenter.x,
    y: canvasCenter.y,
    r: getCircleRadius() * 3 // center + static 2 layers for now
  });

  for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {

      const point = { x: i, y: j };

      // Skip all points that are guaranteed to be outside of the figure
      if (centerCircle.hasPointInside(point)) {

        const amountOfCirclesAroundPoint = circles
          .filter(circle => circle.hasPointInside(point))
          .length;

        const color = amountOfCirclesAroundPoint % 2
          ? palette[amountOfCirclesAroundPoint % palette.length]
          : palette[palette.length - (amountOfCirclesAroundPoint % palette.length) - 1];

        ctx.fillStyle = amountOfCirclesAroundPoint > 0
          ? `hsl(${color.h}, ${color.s}%, ${color.l}%)`
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
