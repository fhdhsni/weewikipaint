// launch the server in the same way it happens in production
// get a page
// confirm we got something
import { assert } from 'chai';
import * as process from 'child_process';
import * as http from 'http';
import { httpGet } from './server.test';
const command = {
    args: ['./src/server/weewikipaint.js', '8081'],
    command: 'node',
};

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

describe('smoke testing server', function () {
    it('should get homepage', function (done) {
        runServer(command)
            .then(serverProcess => {
                httpGet('http://localhost:8081')
                    .then(data => {
                        serverProcess.kill();
                        assert.notEqual(data.responseData.indexOf('WeeWikiPaint home page'), -1,
                                        'home page should contain WeeWikiPaint home page');
                        done();
                    }).catch(e => {
                        serverProcess.kill();
                        throw e;
                    });
            }).catch(e => {
                throw e;
            });
    });

    it('should get 404 page', function (done) {
        runServer(command)
            .then(serverProcess => {
                httpGet('http://localhost:8081/foobar')
                    .then(data => {
                        serverProcess.kill();
                        assert.notEqual(data.responseData.indexOf('WeeWikiPaint 404 page'), -1,
                                        '404 page should contain WeeWikiPaint 404 page');
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
