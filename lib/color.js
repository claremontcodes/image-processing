const interpolate = require("./interpolate");

class Color {
  constructor(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;

    // A color isn't the _same_ color if its components change
    Object.freeze(this);
  }

  static create(red, green, blue) {
    return new Color(red, green, blue);
  }
}

Color.BLACK = new Color(0, 0, 0);
Color.WHITE = new Color(255, 255, 255);

module.exports = Color;
