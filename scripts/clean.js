const fs = require('fs');

fs.rmSync("./bin", {recursive: true, force: true});
fs.rmSync("./dist", {recursive: true, force: true});
fs.rmSync("./doc", {recursive: true, force: true});