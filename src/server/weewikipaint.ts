import * as server from './server';
const port = process.argv[2];

server.start('./src/server/homepage.html',
    './src/server/404.html',
    parseInt(port, 10),
    () => console.log('Server started'));
