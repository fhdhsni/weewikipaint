import * as http from 'http';

export function start(portNumber: number): void {
    const server = http.createServer();
    server.on('request', (req: http.ServerRequest, res: http.ServerResponse): void => {
        res.write('Hello World');
    });
    server.listen(portNumber);
}
