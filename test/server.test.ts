/* tslint:disable only-arrow-functions */
import { assert } from 'chai';
import * as fs from 'fs';
import * as http from 'http';
import * as server from '../src/server/server';

const portNumber = 8080;
const tempDir = 'generated';
const tempFile = `${tempDir}/generatedFile.html`; // TODO: maybe use path module?

after(() => {
    if (fs.existsSync(tempDir)) {
        fs.unlinkSync(tempFile);
        fs.rmdirSync(tempDir);
    }
});

describe('serving files', function () {
    it('should serve a file', function (done) {
        this.timeout(5000);
        const sampleData = 'This is a sample data';

        fs.mkdirSync(tempDir);
        fs.writeFileSync(tempFile, sampleData);

        server.start(tempFile, portNumber);

        http.get(`http://localhost:${portNumber}`, (response) => {
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
                assert.equal(response.statusCode, 200, 'server didn\'t responed with 200');
                assert.equal(chunk, sampleData, 'server response doesn\'t match');
                server.stop();
                done();
            });
        });
    });
});
