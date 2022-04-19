const fs = require('fs');
const fse = require('fs-extra');

fs.copyFileSync("./html/index.html", "./dist/index.html", fs.constants.COPYFILE_FICLONE);
fs.copyFileSync("./bin/server.js", "./dist/server.js", fs.constants.COPYFILE_FICLONE);
// fse.copySync("./resources/", "./bin/resources/", {overwrite: true});