const fs = require("node:fs");
const Color = require("./color");
const { PNG } = require("pngjs");

const CHANNELS = 4;
const CHANNEL_RED = 0;
const CHANNEL_GREEN = 1;
const CHANNEL_BLUE = 2;
const CHANNEL_ALPHA = 3;

function get_offset(width, px, py) {
  return (py * width + px) * CHANNELS;
}

function /* async */ open_png(filepath) {
  const read_stream = fs.createReadStream(filepath);
  const png = new PNG();

  // Read the file, parse it, and create an Image from it.
  // But wrap it in a Promise
  return new Promise((resolve, reject) => {
    read_stream.pipe(png).on("parsed", (data, err) => {
      if(err) { return reject(err); }
      const image = new Image(png.width, png.height, png.data);
      resolve(image);
    });
  });
}

function /* async */ write_png(filepath, image) {
  const write_stream = fs.createWriteStream(filepath);
  // Color image, no transparency
  const png = new PNG({
    colorType: 2,
    width: image.width,
    height: image.height,
  });

  // NOTE: Sort of evil. Also sort of part of the API.
  png.data = Buffer.from(image.buf);

  return new Promise((resolve, reject) => {
    write_stream.on("error", reject);
    write_stream.on("finish", resolve);

    png.pack().pipe(write_stream);
  });
}

class Image {
  constructor(width, height, buf) {
    this.width = width;
    this.height = height;
    this.buf = buf;

    if(buf === undefined) {
      this.buf = Buffer.alloc(width * height * CHANNELS, 0);
    }
  }

  get_color(px, py) {
    if(px >= this.width) {
      throw new RangeError(`Position exceeds image width (${this.width}): ${px}`);
    }
    if(py >= this.height) {
      throw new RangeError(`Position exceeds image height (${this.height}): ${py}`);
    }
    const offset = get_offset(this.width, px, py);
    const red = this.buf[offset + CHANNEL_RED];
    const green = this.buf[offset + CHANNEL_GREEN];
    const blue = this.buf[offset + CHANNEL_BLUE];
    // Ignore alpha channel

    const color = new Color(red, green, blue);
    return color;
  }

  set_color(px, py, color) {
    if(px >= this.width) {
      throw new RangeError(`Position exceeds image width (${this.width}): ${px}`);
    }
    if(py >= this.height) {
      throw new RangeError(`Position exceeds image height (${this.height}): ${py}`);
    }
    const offset = get_offset(this.width, px, py);
    this.buf[offset + CHANNEL_RED] = color.red;
    this.buf[offset + CHANNEL_GREEN] = color.green;
    this.buf[offset + CHANNEL_BLUE] = color.blue;
    // Ignore alpha channel. It is always set to full opacity.
  }

  within_bounds(x, y) {
    return (x > 0 && y > 0 && x < this.width && y < this.height);
  }

  /* async */ save(filepath) {
    return write_png(filepath, this);
  }

  static /* async */ open(filepath) {
    return open_png(filepath);
  }
}

module.exports = Image;
