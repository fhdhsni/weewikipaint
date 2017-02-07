/* tslint:disable only-arrow-functions */
import { assert } from 'chai';
import * as http from 'http';
import * as server from '../src/server/server';

describe('server', function () {
    it('should create a simple server', function (done) {
        server.start();
        http.get('http://localhost:8080', function (response) {
            assert.equal(true, true);
            done();
        });
    });
});
