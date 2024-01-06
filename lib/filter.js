const Color = require("./color");
const colors = require("./colors");

function apply(transform, image) {
  for(let y = 0; y < image.height; y++) {
    for(let x = 0; x < image.width; x++) {
      const source = image.get_color(x, y);
      const target = transform(source)
      image.set_color(x, y, target);
    }
  }
}

function grayscale(image) {
  apply(colors.gray, image);
}

function invert(image) {
  apply(colors.complement, image);
}

function tint(image, color) {
  const transform = (source) => colors.blend(source, color, 0.5);
  apply(transform, image);
}

function lighten(image, pct) {
  const transform = (source) => colors.lighten(source, pct);
  apply(transform, image);
}

function darken(image, pct) {
  const transform = (source) => colors.darken(source, pct);
  apply(transform, image);
}

function threshold(image, color, max) {
  const transform = (source) => {
    const luminance = colors.luminance(source);
    return luminance.red > max? color : source;
  }
  apply(transform, image);
}

function posterize() {}

function blur(image) {

}

// https://lodev.org/cgtutor/filtering.html
function motion_blur() {}

function get_closest(gray) {
  const level = gray.red;
  const match = level > 127? Color.WHITE : Color.BLACK;
  const error = level - match.red;
  return [match, error];
}

function propagate_error(image, x, y, w, error) {
  if(!image.within_bounds(x, y)) {
    return;
  }
  const color = image.get_color(x, y);
  const level = color.red + w * error;
  const gray = new Color(level, level, level);
  image.set_color(x, y, gray);
}

function dither(image) {
  // Convert to grayscale
  grayscale(image);

  // Distribute quantization error
  for(let y = 0; y < image.height; y++) {
    for(let x = 0; x < image.width; x++) {
      const source = image.get_color(x, y);
      const [match, error] = get_closest(source);
      image.set_color(x, y, match);

      propagate_error(image, x+1, y,   7/16, error);
      propagate_error(image, x-1, y+1, 3/16, error);
      propagate_error(image, x,   y+1, 5/16, error);
      propagate_error(image, x+1, y+1, 1/16, error);
    }
  }
}

function emboss() {}
// https://ai.stanford.edu/~syyeung/cvweb/tutorial1.html
// https://www.codingame.com/playgrounds/2524/basic-image-manipulation/filtering
function sharpen() {}

function outline() {}


exports.blur = blur;
exports.emboss = emboss;
exports.darken = darken;
exports.dither = dither;
exports.grayscale = grayscale;
exports.invert = invert;
exports.lighten = lighten;
exports.motion_blur = motion_blur;
exports.posterize = posterize;
exports.outline = outline;
exports.sharpen = sharpen;
exports.threshold = threshold;
exports.tint = tint;
