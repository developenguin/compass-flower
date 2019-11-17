function hexToHSL(hex) {

  const colorValues = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  const r = parseInt(colorValues[1], 16) / 255,
    g = parseInt(colorValues[2], 16) / 255,
    b = parseInt(colorValues[3], 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);

  var h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {

    const delta = max - min;

    s = l > 0.5
      ? delta / (2 - max - min)
      : delta / (max + min);

    switch(max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }

    h /= 6;

  }

  s = Math.round(s * 100);
  l = Math.round(l * 100);
  h = Math.round(h * 360);

  return { h, s, l };

}


function generateMonochromaticScaleFromColor(hslColor) {

  const colors = [];
  let baseL = hslColor.l % 10;

  while (baseL <= 100) {

    colors.push({
      h: hslColor.h,
      s: hslColor.s,
      l: baseL
    });
    baseL += 10;

  }

  return colors;

}
