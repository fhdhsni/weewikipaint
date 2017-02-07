import * as http from 'http';

export function start(): void {
    const server = http.createServer();
    server.on('request', (req: http.ServerRequest, res: http.ServerResponse): void => {
        res.end();
    });
    server.listen(8080);
}
