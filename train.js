var brain = require("brain.js");
var fs = require("fs");
var bmp = require("bmp-js");

const dirContents = fs.readdirSync(".");
const bitmaps = dirContents.filter(file => file.match(/\.bmp$/));
let trainingData = new Array();

bitmaps.slice(0, 25).forEach(bitmap => {
  console.log(`Reading ${bitmap}`);
  const bmpBuffer = fs.readFileSync(bitmap);
  const bmpData = bmp.decode(bmpBuffer);

  // the raw data is a series of 4 byte 32 bit words: (alpha, red, green, blue),
  // which represent a single pixel. We are going to read these each into an array
  // of unsinged ints
  const pixels = new Array();
  for (let offset = 0, len = bmpData.data.length; offset < len; offset += 4) {
    pixels.push(bmpData.data.readUInt32BE(offset));
  }

  const txtFilename = bitmap.replace(/\.bmp$/, ".txt");
  console.log(`Reading hashtags ${txtFilename}`);
  data = fs.readFileSync(txtFilename); //, (err, data) => {

  const hashtags = data.toString().split(",");
  const train = { input: pixels, output: hashtags };
  trainingData.push(train);
});

// console.log("About to train...", trainingData);
var net = new brain.recurrent.RNN();
net.train(trainingData, { log: true });
