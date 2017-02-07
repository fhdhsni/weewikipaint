"use strict";
/* tslint:disable only-arrow-functions */
var chai_1 = require("chai");
var fooModule_1 = require("../src/scripts/fooModule");
describe('add', function () {
    it('should add two numbers', function () {
        chai_1.assert.deepEqual(fooModule_1.add(2, 5), 7, '2+7 should be 7');
    });
});
