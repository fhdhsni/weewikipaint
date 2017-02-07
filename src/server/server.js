"use strict";
const http = require("http");
function start(portNumber) {
    const server = http.createServer();
    server.on('request', (req, res) => {
        res.write('Hello World');
    });
    server.listen(portNumber);
}
exports.start = start;
