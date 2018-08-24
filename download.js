var ig = require("instagram-scraping");
var request = require("request");
var fs = require("fs");
var url = require("url");
var path = require("path");
var jimp = require("jimp");

const tag = process.argv[2] || "igers";
console.log(`Downloading tag ${tag}`);

if (!fs.existsSync(tag)) {
  fs.mkdirSync(tag);
}

ig.scrapeTag(tag).then(function(result) {
  result.medias.forEach(function(post) {
    const hashtags = post.text.match(/(\#[a-zA-Z0-9\-\_]+)/g);
    if (hashtags) {
      // const downloadUrl = post.display_url;  // original files are too large. use the thumbnails.
      const downloadUrl = post.thumbnail_resource[0].src;
      console.log(`Downloading ${downloadUrl}...`);

      const parsed = url.parse(downloadUrl);
      const sourceFilename = path.basename(parsed.pathname);

      const bmpFilename = `./${tag}/${sourceFilename.replace(
        /\.jpg$/,
        ".bmp"
      )}`;
      jimp.read(downloadUrl, function(err, jaypeg) {
        if (err) throw err;
        console.log("Converting file", bmpFilename);
        jaypeg
          .resize(50, 50)
          .grayscale()
          .write(bmpFilename);
      });
    }
  });
});
