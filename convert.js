var fs = require("fs");
var bmp = require("bmp-js");

const tag = process.argv[2] || "igers";

const dirContents = fs.readdirSync(`./${tag}`);
const bitmaps = dirContents.filter(file => file.match(/\.bmp$/));

const pixels = new Array();
bitmaps.forEach(bitmap => {
  const bmpBuffer = fs.readFileSync(`./${tag}/${bitmap}`);
  const bmpData = bmp.decode(bmpBuffer);

  for (let offset = 0, len = bmpData.data.length; offset < len; offset += 4) {
    // We can ignore the lowest byte of each word because that's
    // where it stores the alpha channel, which is always zero
    // on our bitmaps.
    pixels.push([
      bmpData.data.readUInt8(offset + 1),
      bmpData.data.readUInt8(offset + 2),
      bmpData.data.readUInt8(offset + 3)
    ]);
  }
});

fs.writeFileSync(tag.csv, pixels);
