import * as fs from 'fs';
import * as http from 'http';
let server: http.Server;

export function start(htmlFileToSever: string, portNumber: number) {
    server = http.createServer();
    server.on('request', (req: http.ServerRequest, res: http.ServerResponse): void => {
        if (req.url === '/' || req.url === '/index.html') {
            fs.readFile(htmlFileToSever, 'utf8', (error, data) => {
                res.statusCode = 200;
                res.write(data);
                res.end();
            });
        } else {
            res.statusCode = 404;
            res.end();
        }
    });
    server.listen(portNumber);
}

export function stop(cb?: () => void) {
    server.close();
    if (cb) {
        cb();
    }
}
