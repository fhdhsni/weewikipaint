// launch the server in the same way it happens in production
// get a page
// confirm we got something

declare var require: (moduleId: string) => any;

import { assert } from 'chai';
import * as ps from 'child_process';
import * as http from 'http';
import * as fs from 'fs';
import { httpGet } from './server.test';
const procfile = require('procfile');

let PORT = '';
const command = readProcfile();

describe('Server (Smoke Test)', function () {
    it('Should return homepage', function (done) {
        runServer(command)
            .then(serverProcess => {
                httpGet(`http://localhost:${PORT}`)
                    .then(data => {
                        serverProcess.kill();
                        assert.notEqual(data.responseData.indexOf('WeeWikiPaint'), -1,
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

    it('Should return 404 page', function (done) {
        runServer(command)
            .then(serverProcess => {
                httpGet(`http://localhost:${PORT}/foobar`)
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

function readProcfile() {
    let i: number;
    const file = fs.readFileSync('Procfile').toString();
    const web: {
        command: string;
        options: string[];
    } = procfile.parse(file).web;

    if (!process.env.PORT) {
        web.options = web.options.map((element) => {
            if (element === '$PORT') {
                PORT = '5000';
                return PORT;
            }
            return element;
        });
    }

    return web;
}

function runServer(task: { command: string, options: string[] }): Promise<ps.ChildProcess> {
    return new Promise((resolve, reject) => {
        const proc = ps.spawn(task.command, task.options);
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
