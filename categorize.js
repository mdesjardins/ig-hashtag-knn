const utils = require("./utils.js");
const fs = require("fs");
const distance = require("euclidean-distance");
const bmp = require("bmp-js");
const { exec } = require("child_process");

const K = 5;

const categories = [
  {
    tag: process.argv[2] || "catsofinstagram"
  },
  {
    tag: process.argv[3] || "dogsofinstagram"
  }
];
const datadir = process.argv[5] || "data";

let scores = [];

// read the file we're testing.
const fileToCheck = process.argv[4] || "oops";
const bmpBuffer = fs.readFileSync(fileToCheck);

// get its bitmap vector.
const pixels = utils.convertToBitmapVector(bmpBuffer);

// main scoring loop. go through each image in each category
// and calculate the distance between the vector of the tested
// image and the iteree.
categories.forEach((category, index) => {
  const raw = fs.readFileSync(`${datadir}/${category.tag}.json`);
  category.vectors = JSON.parse(raw);
  category.vectors.forEach(vector => {
    scores.push([category.tag, distance(pixels, vector)]);
  });
});

// Sort the scores
scores.sort((a, b) => (a[1] == b[1] ? 0 : +(a[1] > b[1]) || -1));

// Top K scores.
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
