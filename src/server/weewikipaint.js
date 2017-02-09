"use strict";
const server = require("./server");
server.start('./src/server/homepage.html', './src/server/404.html', 8081);
