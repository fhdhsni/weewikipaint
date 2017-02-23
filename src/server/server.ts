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

export function start(htmlFileToSever: string, notFoundpage: string, JSFile: string, port: number, cb?: () => void) {
    server = http.createServer();
    server.on('request', (req: http.ServerRequest, res: http.ServerResponse): void => {
        if (req.url === '/' || req.url === '/index.html') {
            res.statusCode = 200;
            serveFile(res, htmlFileToSever);
        } else if (req.url === '/app.js') {
            res.statusCode = 200;
            serveFile(res, JSFile);
        } else {
            res.statusCode = 404;
            serveFile(res, notFoundpage);
        }
    });
    server.listen(port, cb);
}

export function stop(cb?: () => void) {
    server.close();
    if (cb) {
        cb();
    }
}
