// launch the server in the same way it happens in production
// get a page
// confirm we got something
import { assert } from 'chai';
import * as process from 'child_process';
import * as http from 'http';
import { httpGet } from './server.test';

describe('smoke test', function () {
    it('should test the server end to end', function (done) {
        this.timeout(5000);
        const command = `node ./src/server/weewikipaint.js`;
        runCommand(command)
            .then(pid => {
                setTimeout(function () {
                    httpGet('http://localhost:8081')
                        .then(data => {
                            runCommand(`kill -15 ${pid}`);
                            done();
                        }).catch(e => {
                            runCommand(`kill -15 ${pid}`);
                            throw e;
                        });
                }, 1000);
            }).catch(pid => {
                throw new Error('run command throwed an error');
            });
    });
});

/**
 * run a given shell command, returns a promise resolved by pid of the process
 */
function runCommand(command: string): Promise<number> {
    return new Promise((resolve, reject) => {
        const procObject = process.exec(command);
        resolve(procObject.pid);
    });
}
