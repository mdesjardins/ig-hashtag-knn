var fs = require("fs");
var bmp = require("bmp-js");

const tag = process.argv[2] || "igers";

const dirContents = fs.readdirSync(`./${tag}`);
const bitmaps = dirContents.filter(file => file.match(/\.bmp$/));

const images = new Array(); // Array of image vectors

const csvOutput = fs.openSync(`${tag}.csv`, "w");
const jsonOutput = fs.openSync(`${tag}.json`, "w");

bitmaps.forEach(bitmap => {
  const bmpBuffer = fs.readFileSync(`./${tag}/${bitmap}`);
  const bmpData = bmp.decode(bmpBuffer);
  const pixels = new Array(); // Vector representing one image

  for (
    let offset = 0, index = 0, len = bmpData.data.length;
    offset < len;
    offset += 4, index++
  ) {
    // We can ignore the lowest byte of each word because that's
    // where it stores the alpha channel, which is always zero
    // on our bitmaps.
    pixels.push(bmpData.data.readUInt8(offset + 1)); // red
    pixels.push(bmpData.data.readUInt8(offset + 2)); // green
    pixels.push(bmpData.data.readUInt8(offset + 3)); // blue
  }
  fs.writeSync(csvOutput, `${pixels.join(",")}\n`);

  images.push(pixels);
});

fs.writeSync(jsonOutput, JSON.stringify(images));

console.log(images);
//fs.writeFileSync(tag.csv, pixels);
