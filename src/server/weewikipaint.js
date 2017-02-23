"use strict";
const server = require("./server");
const PORT = process.argv[2];
const contentDir = './dist/';
server.start(`${contentDir}index.html`, `${contentDir}404.html`, `${contentDir}app.js`, parseInt(PORT, 10), () => console.log('Server started'));
