var ig = require("instagram-scraping");
var request = require("request");
var fs = require("fs");
var url = require("url");
var path = require("path");
var jimp = require("jimp");

const tag = process.argv[2] || "igers";
console.log(`Downloading tag ${tag}`);

ig.scrapeTag(tag).then(function(result) {
  result.medias.forEach(function(post) {
    const hashtags = post.text.match(/(\#[a-zA-Z0-9\-\_]+)/g);
    if (hashtags) {
      const displayUrl = post.display_url;
      console.log(`Downloading ${displayUrl}...`);

      const parsed = url.parse(displayUrl);
      const sourceFilename = path.basename(parsed.pathname);

      const txtFilename = sourceFilename.replace(/\.jpg$/, ".txt");
      fs.writeFile(txtFilename, hashtags.join(",").replace(/\#/g, ""), function(
        err
      ) {
        if (err) throw err;
      });

      const bmpFilename = sourceFilename.replace(/\.jpg$/, ".bmp");
      jimp.read(displayUrl, function(err, jaypeg) {
        if (err) throw err;
        console.log("Converting file", bmpFilename);
        jaypeg.write(bmpFilename);
      });
    }
  });
});
