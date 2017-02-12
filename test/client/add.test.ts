/* tslint:disable only-arrow-functions */
import { assert } from 'chai';
import { add } from '../../src/scripts/fooModule';
describe('add', function () {
    it('should add two numbers', function () {
        assert.deepEqual(add(2, 5), 7, '2+7 should be 7');
    });
    it('should add two numbers', function () {
        assert.deepEqual(add(5, 5), 10, '2+7 should be 7');
    });
});
