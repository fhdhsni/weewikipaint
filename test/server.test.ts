/* tslint:disable only-arrow-functions arrow-parens */

import { assert } from 'chai';
import * as fs from 'fs';
import * as http from 'http';
import * as server from '../src/server/server';

const portNumber = 8080;
const tempDir = 'generated';
const tempFile = `${tempDir}/generatedFile.html`; // TODO: maybe use path module?
const sampleData = 'This is a sample data';
const URL = 'http://localhost';

interface ResolveArg {
    response: http.IncomingMessage;
    responseData: string;
}

interface HttpResolveInterface {
    (arg: ResolveArg): void;
}

function httpGet(url: string): Promise<ResolveArg> {
    return new Promise((resolve: HttpResolveInterface, reject: (e: Error) => void) => {
        http.get(`${url}`, response => {
            let responseData = '';

            response.setEncoding('utf8');
            response.on('data', (chunk) => {
                responseData += chunk;
            });
            response.on('end', () => {
                resolve({
                    response,
                    responseData,
                });
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
};

beforeEach(() => {
    fs.mkdirSync(tempDir);
    fs.writeFileSync(tempFile, sampleData);
    server.start(tempFile, portNumber);
});

afterEach(() => {
    server.stop();
    if (fs.existsSync(tempDir)) {
        fs.unlinkSync(tempFile);
        fs.rmdirSync(tempDir);
    }
});

describe('serving files', function () {
    it('should serve a file', function (done) {
        httpGet(`${URL}:${portNumber}`)
            .then(data => {
                assert.equal(data.response.statusCode, 200, 'server didn\'t responed with 200');
                assert.equal(data.responseData, sampleData, 'server response doesn\'t match');
                done();
            }).catch(e => {
                assert.Throw(e);
            });
    });
});

describe('404 page', function () {
    it('should return 404 for everything except homepage', function (done) {
        httpGet(`${URL}:${portNumber}/foobar`)
            .then(data => {
                assert.equal(data.response.statusCode, 404, 'server didn\'t responed with 404');
                done();
            }).catch(e => assert.throw(e));
    });
});

describe('asking for index.html ', function () {
    it('should server index.html', function (done) {
        httpGet(`${URL}:${portNumber}/index.html`)
            .then(data => {
                assert.equal(data.response.statusCode, 200, 'server didn\'t responed with 200');
                assert.equal(data.responseData, sampleData, 'server response doesn\'t match');
                done();
            }).catch(e => assert.throw(e));
    });
});
