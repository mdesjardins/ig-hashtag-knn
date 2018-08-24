const fs = require("fs");
const distance = require("euclidean-distance");
const bmp = require("bmp-js");
const { exec } = require("child_process");

const K = 10;

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
    scores.push([category.tag, distance(pixels, vector)]);
  });
});

// Sort the scores
scores.sort((a, b) => (a[1] == b[1] ? 0 : +(a[1] > b[1]) || -1));

// Top 5
const closest = scores.slice(0, K);

console.log("TOP (Nearest)", closest);
const category1Total = closest.reduce((accum, current) => {
  if (current[0] == categories[0].tag) accum++;
  return accum;
}, 0);
const category2Total = closest.reduce((accum, current) => {
  if (current[0] == categories[1].tag) accum++;
  return accum;
}, 0);

console.log("category 1 score:", category1Total);
console.log("category 2 score:", category2Total);
console.log(
  `the supplied photo is a ${
    category1Total > category2Total ? categories[0].tag : categories[1].tag
  }`
);

// Bottom 10
//console.log("BOTTOM (Furthest)", scores.slice(-5));
