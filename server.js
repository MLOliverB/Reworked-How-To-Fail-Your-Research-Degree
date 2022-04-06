const express = require('express');
const app = express();

app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});

// const http = require('http');
// const fs = require('fs');

// const requestListener = function (req, res) {
//     if (req.url == "/" || req.url == "/index.html") {
//         fs.readFile('./index.html', function(err, data) {
//             res.writeHead(200);
//             res.end(data);
//         });
//     } else {
//         fs.readFile(__dirname + req.url, function(err, data) {
//             console.log(__dirname + req.url);
//             res.writeHead(200);
//             res.end(data);
//         });
//     }
//     // console.log(__dirname);
//     // console.log(typeof req);
//     // console.log(req.url);
//     // res.writeHead(200);
//     // res.end('Hello, World!');
// }

// const server = http.createServer(requestListener);
// server.listen(8080);