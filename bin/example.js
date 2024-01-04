const Color = require("../lib/color");
const filter = require("../lib/filter");
const Image = require("../lib/image");

async function main() {
  const image = await Image.open("./var/water-lily.png");
  filter.tint(image, new Color(255, 0, 255));

  image.save("./test.png");
}

main();
