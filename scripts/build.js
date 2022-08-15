const fs = require('fs');
const fse = require('fs-extra');

fs.copyFileSync("./src/dev/html/index.html", "./dist/index.html", fs.constants.COPYFILE_FICLONE);
fs.copyFileSync("./bin/server.js", "./dist/server.js", fs.constants.COPYFILE_FICLONE);
fse.copySync("./resources/", "./dist/resources/", {overwrite: true});