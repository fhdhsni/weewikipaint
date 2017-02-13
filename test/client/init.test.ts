import { initializeDrawingArea } from '../../src/scripts/init';
import { assert } from 'chai';
describe('drawing Area', function () {
    it('should assert that drawing area exist', function () {
        const div = document.createElement('div') as HTMLDivElement;
        div.setAttribute('id', 'wwp-drawingArea');
        document.body.appendChild(div);

        initializeDrawingArea('wwp-drawingArea');

        const extractedDiv = document.getElementById('wwp-drawingArea');
        assert.equal(extractedDiv.children[0].tagName.toLowerCase(), 'svg', '#wwp-drawingArea should have a SVG child');
    });
});
