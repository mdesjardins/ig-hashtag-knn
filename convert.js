var fs = require("fs");
var bmp = require("bmp-js");

const tag = process.argv[2] || "igers";

const dirContents = fs.readdirSync(`./${tag}`);
const bitmaps = dirContents.filter(file => file.match(/\.bmp$/));

const images = new Array(); // Array of image vectors

const jsonOutput = fs.openSync(`${tag}.json`, "w");

bitmaps.forEach(bitmap => {
  const bmpBuffer = fs.readFileSync(`./${tag}/${bitmap}`);
  const bmpData = bmp.decode(bmpBuffer);
  const red = new Array();
  const green = new Array();
  const blue = new Array();
  let pixels = new Array(); // Vector representing one image

  for (
    let offset = 0, index = 0, len = bmpData.data.length;
    offset < len;
    offset += 4, index++
  ) {
    // We can ignore the lowest byte of each word because that's
    // where it stores the alpha channel, which is always zero
    // on our bitmaps.
    red.push(bmpData.data.readUInt8(offset + 1)); // red
    green.push(bmpData.data.readUInt8(offset + 2)); // green
    blue.push(bmpData.data.readUInt8(offset + 3)); // blue
  }
  pixels = red.concat(green).concat(blue);
  images.push(pixels);
});

fs.writeSync(jsonOutput, JSON.stringify(images));

console.log(images.length);
//console.log(images);
//fs.writeFileSync(tag.csv, pixels);
