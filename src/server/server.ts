import * as fs from 'fs';
import * as http from 'http';
let server: http.Server;

function serveFile(res: http.ServerResponse, file: string): void {
    fs.readFile(file, 'utf8', (error, data) => {
        if (error) {
            throw error;
        }
        res.write(data);
        res.end();
    });
}

export function start(htmlFileToSever: string, for404page: string, portNumber: number) {
    server = http.createServer();
    server.on('request', (req: http.ServerRequest, res: http.ServerResponse): void => {
        if (req.url === '/' || req.url === '/index.html') {
            res.statusCode = 200;
            serveFile(res, htmlFileToSever);
        } else {
            res.statusCode = 404;
            serveFile(res, for404page);
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
