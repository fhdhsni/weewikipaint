/* tslint:disable only-arrow-functions */
import { assert } from 'chai';
import * as http from 'http';
import * as server from '../src/server/server';

describe('server', function () {
    it('should create a simple server', function (done) {
        this.timeout(5000);
        server.start();
        http.get('http://localhost:8080', (response) => {
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
                assert.equal(response.statusCode, 200, 'server didn\'t responed with 200');
                assert.equal(chunk, 'Hello World', 'server response doesn\'t match');
                done();
            });
        });
    });
});
