// launch the server in the same way it happens in production
// get a page
// confirm we got something
import { assert } from 'chai';
import * as process from 'child_process';
import * as http from 'http';
import { httpGet } from './server.test';

describe('smoke test', function () {
    it('should test the server end to end', function (done) {
        const command = {
            args: ['./src/server/weewikipaint.js'],
            command: 'node',
        };

        runServer(command)
            .then(serverProcess => {
                httpGet('http://localhost:8081')
                    .then(data => {
                        serverProcess.kill();
                        done();
                    }).catch(e => {
                        serverProcess.kill();
                        throw e;
                    });
            }).catch(e => {
                throw e;
            });
    });
});

function runServer(task: { command: string, args: string[] }): Promise<process.ChildProcess> {
    return new Promise((resolve, reject) => {
        const proc = process.spawn(task.command, task.args);
        proc.stdout.setEncoding('utf8');
        proc.stdout.on('data', (data) => {
            if (data.toString().trim() === 'Server started') {
                resolve(proc);
            } else {
                console.log('no match');
            }
        });
    });
}
