import * as server from './server';
const port = process.argv[2];
const contentDir = './src/server/';

server.start(`${contentDir}homepage.html`, `${contentDir}404.html`,
    parseInt(port, 10),
    () => console.log('Server started'));
