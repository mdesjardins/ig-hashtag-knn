var fs = require("fs");
var distance = require("euclidean-distance");
var bmp = require("bmp-js");

const categories = [
  {
    tag: process.argv[2] || "catsofinstagram"
  },
  {
    tag: process.argv[3] || "dogsofinstagram"
  }
];
let scores = [];

const fileToCheck = process.argv[4] || "oops";
const bmpBuffer = fs.readFileSync(fileToCheck);
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

categories.forEach((category, index) => {
  const raw = fs.readFileSync(`${category.tag}.json`);
  category.vectors = JSON.parse(raw);
  category.vectors.forEach(vector => {
    scores.push([category.tag, distance(vector, pixels)]);
  });
});

//console.log(scores);

// Sort the scores
scores.sort((a, b) => (a[1] == b[1] ? 0 : +(a[1] > b[1]) || -1));
//console.log(scores);

// Top 10
console.log("TOP", scores.slice(0, 5));

// Bottom 10
console.log("BOTTOM", scores.slice(-5));

// Load up Category 1 and Category 2
//category1Csv = fs.open(`${category1}.csv`)
//category2Csv = fs.open(`${category2}.csv`)

//const tag = process.argv[2];
//const fileToCheck = process.argv[3];
// const jsonFile = fs.openSync(`${tag}.json`, "r");
// const data = fs.readSync(jsonFile);
// const model = JSON.parse(data);

//fs.readFile(`${tag}.json`, "utf8", function(err, data) {
//  if (err) throw err; // we'll not consider error handling for now
//  var obj = JSON.parse(data);
//  console.log(obj);
//});

// const data = fs.readFileSync(`${tag}.json`);
// var obj = JSON.parse(data);

// // TODO need to make this general purpose
// const bmpBuffer = fs.readFileSync(fileToCheck);
// const bmpData = bmp.decode(bmpBuffer);
// const pixels = new Array(); // Vector representing one image

// for (
//   let offset = 0, index = 0, len = bmpData.data.length;
//   offset < len;
//   offset += 4, index++
// ) {
//   // We can ignore the lowest byte of each word because that's
//   // where it stores the alpha channel, which is always zero
//   // on our bitmaps.
//   pixels.push(bmpData.data.readUInt8(offset + 1)); // red
//   pixels.push(bmpData.data.readUInt8(offset + 2)); // green
//   pixels.push(bmpData.data.readUInt8(offset + 3)); // blue
// }

// // Scores
// const score = distance(obj[0], pixels);
// console.log("Score is", score);
