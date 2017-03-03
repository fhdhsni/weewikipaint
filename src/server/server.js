"use strict";
const fs = require("fs");
const http = require("http");
let server;
function start(dir, port, cb) {
    const files = ['/', '/index.html', '/app.js', '/styles.css'];
    server = http.createServer();
    server.on('request', (req, res) => {
        const url = req.url;
        if (files.indexOf(url) !== -1) {
            res.statusCode = 200;
            if (url === '/') {
                serveFile(res, `${dir}/index.html`);
            }
            else {
                serveFile(res, `${dir}${url}`);
            }
        }
        else {
            res.statusCode = 404;
            serveFile(res, `${dir}/404.html`);
        }
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
