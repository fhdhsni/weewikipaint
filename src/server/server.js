"use strict";
const fs = require("fs");
const http = require("http");
let server;
function serveFile(res, file) {
    fs.readFile(file, 'utf8', (error, data) => {
        if (error) {
            throw error;
        }
        res.write(data);
        res.end();
    });
}
function start(htmlFileToSever, notFoundpage, portNumber, cb) {
    server = http.createServer();
    server.on('request', (req, res) => {
        if (req.url === '/' || req.url === '/index.html') {
            res.statusCode = 200;
            serveFile(res, htmlFileToSever);
        }
        else {
            res.statusCode = 404;
            serveFile(res, notFoundpage);
        }
    });
    server.listen(portNumber, cb);
}
exports.start = start;
function stop(cb) {
    server.close();
    if (cb) {
        cb();
    }
}
exports.stop = stop;
