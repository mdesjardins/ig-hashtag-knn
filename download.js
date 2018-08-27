const utils = require("./utils.js");

async function download(argv) {
  const tag = argv[2] || "catsofinstagram";
  const datadir = argv[3] || "data";
  const size = argv[4] || 50;

  await utils.downloadAndConvert(tag, datadir, size);
  utils.convertDirectoryToBitmapVectors(tag, datadir);
}

download(process.argv);
