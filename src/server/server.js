"use strict";
const fs = require("fs");
const http = require("http");
let server;
function start(htmlFileToSever, portNumber) {
    server = http.createServer();
    server.on('request', (req, res) => {
        fs.readFile(htmlFileToSever, 'utf8', (error, data) => {
            res.statusCode = 200;
            res.write(data);
            res.end();
        });
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
