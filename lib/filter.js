const colors = require("./colors");

function apply(image, transform) {
  for(let y = 0; y < image.height; y++) {
    for(let x = 0; x < image.width; x++) {
      const source = image.get_color(x, y);
      const target = transform(source)
      image.set_color(x, y, target);
    }
  }
}

function invert(image) {
  apply(image, colors.invert);
}

function tint(image, color) {
  const transform = (source) => colors.blend(source, color, 0.5);
  apply(image, transform);
}

function lighten(image, pct) {

}

function darken(image, pct) {

}

function threshold() {}

function posterize() {}

function blur() {}
// https://lodev.org/cgtutor/filtering.html
function motion_blur() {}

function dither() {}

function emboss() {}
// https://ai.stanford.edu/~syyeung/cvweb/tutorial1.html
// https://www.codingame.com/playgrounds/2524/basic-image-manipulation/filtering
function sharpen() {}

function outline() {}

exports.blur = blur;
exports.emboss = emboss;
exports.dither = dither;
exports.invert = invert;
exports.motion_blur = motion_blur;
exports.posterize = posterize;
exports.outline = outline;
exports.sharpen = sharpen;
exports.tint = tint;
