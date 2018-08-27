//
// Todo async and promises like a real node developer.
//
const ig = require("instagram-scraping");
const request = require("request");
const fs = require("fs");
const url = require("url");
const path = require("path");
const jimp = require("jimp");
const bmp = require("bmp-js");

exports.downloadAndConvert = async function(tag, datadir, size) {
  if (!fs.existsSync(datadir)) {
    fs.mkdirSync(datadir);
  }

  if (!fs.existsSync(`${datadir}/${tag}`)) {
    fs.mkdirSync(`${datadir}/${tag}`);
  }

  ig.scrapeTag(tag).then(result => {
    result.medias.forEach(post => {
      const hashtags = post.text.match(/(\#[a-zA-Z0-9\-\_]+)/g);
      if (hashtags) {
        // original files are too large. use the thumbnails.
        // const downloadUrl = post.display_url;
        const downloadUrl = post.thumbnail_resource[0].src;
        console.log(`Downloading ${downloadUrl}...`);

        const parsed = url.parse(downloadUrl);
        const sourceFilename = path.basename(parsed.pathname);

        const bmpFilename = `${datadir}/${tag}/${sourceFilename.replace(
          /\.jpg$/,
          ".bmp"
        )}`;
        jimp.read(downloadUrl, function(err, jaypeg) {
          if (err) throw err;
          console.log("Converting file", bmpFilename);
          jaypeg
            .resize(size, size)
            .grayscale()
            .write(bmpFilename);
        });
      }
    });
  });
};

exports.convertToBitmapVector = bmpBuffer => {
  const bmpData = bmp.decode(bmpBuffer);
  const red = new Array();
  const green = new Array();
  const blue = new Array();

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
  return red.concat(green).concat(blue);
};

exports.convertDirectoryToBitmapVectors = (tag, datadir) => {
  const dirContents = fs.readdirSync(`${datadir}/${tag}`);
  const bitmaps = dirContents.filter(file => file.match(/\.bmp$/));

  const images = new Array(); // Array of image vectors

  const jsonOutput = fs.openSync(`${datadir}/${tag}.json`, "w");

  bitmaps.forEach(bitmap => {
    const bmpBuffer = fs.readFileSync(`${datadir}/${tag}/${bitmap}`);
    images.push(exports.convertToBitmapVector(bmpBuffer));
  });

  fs.writeSync(jsonOutput, JSON.stringify(images));
  return images;
  console.log(images.length);
};
