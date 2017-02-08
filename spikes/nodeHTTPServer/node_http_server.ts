import * as http from 'http';

const server = http.createServer();

server.on('request', (req: http.ServerRequest, res: http.ServerResponse) => {
    console.log('request received');
    res.end('Hi ^_^');
});
console.log('listening on port 8080');
server.listen(8080);
