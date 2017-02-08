"use strict";
const fs = require("fs");
const http = require("http");
let server;
function start(htmlFileToSever, portNumber) {
    server = http.createServer();
    server.on('request', (req, res) => {
        if (req.url === '/' || req.url === '/index.html') {
            fs.readFile(htmlFileToSever, 'utf8', (error, data) => {
                res.statusCode = 200;
                res.write(data);
                res.end();
            });
        }
        else {
            res.statusCode = 404;
            res.end();
        }
    });
    server.listen(portNumber);
}
exports.start = start;
function stop(cb) {
    server.close();
    if (cb) {
        cb();
    }
}
exports.stop = stop;
