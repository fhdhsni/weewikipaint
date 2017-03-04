import * as fs from 'fs';
import * as http from 'http';
import * as send from 'send';
let server: http.Server;

export function start(dir: string, port: number, cb?: () => void) {

    server = http.createServer();
    server.on('request', (request: http.ServerRequest, response: http.ServerResponse): void => {
        send(request, request.url, { root: dir })
            .on('error', (error: any) => {
                response.statusCode = error.status || 500;
                serveFile(response, `${dir}/404.html`);
            })
            .pipe(response);
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
