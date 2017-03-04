import { assert } from 'chai';
import * as fs from 'fs';
import * as http from 'http';
import * as server from '../../src/server/server';

const portNumber = 1337;
const tempDir = 'generated';
const generatedIndexHtml = `${tempDir}/index.html`; // TODO: maybe use path module?
const generated404Html = `${tempDir}/404.html`;
const sampleDataForIndexHtml = 'This is a sample data';
const sampleDataFor404Html = 'Server responded with 404, page doesn\'t exest';
const URL = 'http://localhost';

interface ResolveArg {
    response: http.IncomingMessage;
    responseData: string;
}

interface HttpResolveInterface {
    (arg: ResolveArg): void;
}

/**
 * makes a get request to a given url and returns a promise
 */
export function httpGet(url: string): Promise<ResolveArg> {
    return new Promise((resolve: HttpResolveInterface, reject: (e: Error) => void) => {
        http.get(url, response => {
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
}

describe('server', function () {

    beforeEach(() => {
        fs.mkdirSync(tempDir);
        fs.writeFileSync(generatedIndexHtml, sampleDataForIndexHtml);
        fs.writeFileSync(generated404Html, sampleDataFor404Html);
    });

    afterEach(() => {
        if (fs.existsSync(tempDir)) {
            fs.unlinkSync(generatedIndexHtml);
            fs.unlinkSync(generated404Html);
            fs.rmdirSync(tempDir);
        }
    });

    it('should serve index.html for URL=/', function (done) {
        server.start(tempDir, portNumber, function () {
            httpGet(`${URL}:${portNumber}`)
                .then(data => {
                    assert.equal(data.response.statusCode, 200, 'server didn\'t responed with 200');
                    assert.equal(data.responseData, sampleDataForIndexHtml, 'server response doesn\'t match');
                    server.stop();
                    done();
                }).catch(e => {
                    assert.Throw(e);
                });
        });
    });

    it('should return 404 for non-existent files', function (done) {
        server.start(tempDir, portNumber, function () {
            httpGet(`${URL}:${portNumber}/foobar`)
                .then(data => {
                    assert.equal(data.response.statusCode, 404, 'server didn\'t responed with 404');
                    assert.equal(data.responseData, sampleDataFor404Html,
                        'For 404 pages server doesn\'t respond as expected');
                    server.stop();
                    done();
                }).catch(e => assert.throw(e));
        });
    });
    it('should serve index.html for URL=/index.html', function (done) {
        server.start(tempDir, portNumber, function () {
            httpGet(`${URL}:${portNumber}/index.html`)
                .then(data => {
                    assert.equal(data.response.statusCode, 200, 'server didn\'t responed with 200');
                    assert.equal(data.responseData, sampleDataForIndexHtml, 'server response doesn\'t match');
                    server.stop();
                    done();
                }).catch(e => assert.throw(e));
        });
    });
});
