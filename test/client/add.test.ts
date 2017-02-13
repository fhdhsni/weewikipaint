/* tslint:disable only-arrow-functions */
declare var dump: any;
import { assert } from 'chai';
import { add } from '../../src/scripts/fooModule';
describe('add', function () {
    it('should add two numbers', function () {
        assert.deepEqual(add(10, 5), 15, 'should be 15');
    });
    it('playing', function () {
        const div = document.createElement('div') as HTMLDivElement;

        div.classList.add('baby');
        document.body.appendChild(div);
        dump(document.body);
    });
});
