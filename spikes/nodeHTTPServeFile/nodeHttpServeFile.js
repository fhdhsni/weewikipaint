"use strict";
const fs = require("fs");
const http = require("http");
const server = http.createServer();
server.on('request', (req, res) => {
    fs.readFile('./file.html', 'utf8', (error, data) => {
        res.statusCode = 200;
        res.write(data);
        res.end();
    });
});
console.log('listening on port 8080');
server.listen(8080);
