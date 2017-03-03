import * as fs from 'fs';
import * as http from 'http';
let server: http.Server;

export function start(dir: string, port: number, cb?: () => void) {
    const files = ['/', '/index.html', '/app.js', '/styles.css'];

    server = http.createServer();
    server.on('request', (req: http.ServerRequest, res: http.ServerResponse): void => {
        const url = req.url;

        if (files.indexOf(url) !== -1) {
            res.statusCode = 200;
            if (url === '/') {
                serveFile(res, `${dir}/index.html`);
            } else {
                serveFile(res, `${dir}${url}`);
            }
        } else {
            res.statusCode = 404;
            serveFile(res, `${dir}/404.html`);
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

function serveFile(res: http.ServerResponse, file: string): void {
    fs.readFile(file, 'utf8', (error, data) => {
        if (error) {
            throw error;
        }
        res.write(data);
        res.end();
    });
}
