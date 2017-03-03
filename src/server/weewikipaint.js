"use strict";
const server = require("./server");
const PORT = process.argv[2];
const contentDir = './dist/';
server.start(contentDir, parseInt(PORT, 10), () => console.log('Server started'));
