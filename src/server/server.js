"use strict";
const fs = require("fs");
const http = require("http");
const send = require("send");
let server;
function start(dir, port, cb) {
    server = http.createServer();
    server.on('request', (request, response) => {
        send(request, request.url, { root: dir })
            .on('error', (error) => {
            response.statusCode = error.status || 500;
            serveFile(response, `${dir}/404.html`);
        })
            .pipe(response);
    });
    server.listen(port, cb);
}
exports.start = start;
function stop(cb) {
    server.close();
    if (cb) {
        cb();
    }
}
exports.stop = stop;
function serveFile(res, file) {
    fs.readFile(file, 'utf8', (error, data) => {
        if (error) {
            throw error;
        }
        res.write(data);
        res.end();
    });
}
