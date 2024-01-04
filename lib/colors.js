const Color = require("./color");
const interpolate = require("./interpolate");

const BLACK = new Color(0, 0, 0);
const WHITE = new Color(255, 255, 255);

function add(color1, color2) {
  const red = Math.min(color1.red + color2.red, 255);
  const green = Math.min(color1.green + color2.green, 255);
  const blue = Math.min(color1.blue + color2.blue, 255);
  return new Color(red, green, blue);
}

function blend(start, end, t) {
  const red = interpolate.lerp(start.red, end.red, t);
  const green = interpolate.lerp(start.green, end.green, t);
  const blue = interpolate.lerp(start.blue, end.blue, t);

  return new Color(red, green, blue);
}

function darken(color, pct) {
  return blend(color, BLACK, pct);
}

function lighten(color, pct) {
  return blend(color, WHITE, pct);
}

function grayscale(color) {
  const gray = 0.2126 * color.red + 0.7152 * color.green + 0.0722 * color.blue;
  return new Color(gray, gray, gray);
}

function complement(color) {
  const red = 255 - color.red;
  const green = 255 - color.green;
  const blue = 255 - color.blue;
  return new Color(red, green, blue);
}

exports.add = add;
exports.blend = blend;
exports.complement = complement;
exports.lighten = lighten;
exports.grayscale = grayscale
exports.darken = darken;
