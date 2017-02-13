import { initializeDrawingArea } from '../../src/scripts/init';
import { assert } from 'chai';

describe('Drawing area', function () {
    describe('', function () {
        const drawingArea = document.createElement('div');

        after('cleaning the DOM after assertion', function () {
            drawingArea.parentNode.removeChild(drawingArea);
        });

        it('should be initialized with Raphael', function () {
            drawingArea.setAttribute('id', 'wwp-drawingArea');
            document.body.appendChild(drawingArea);
            initializeDrawingArea(drawingArea, 500, 500);
            const extractedDiv = document.getElementById('wwp-drawingArea');
            const tagName = extractedDiv.children[0].tagName.toLowerCase();

            assert.equal(tagName, 'svg', '#wwp-drawingArea should have a SVG child');
        });
    });

    it('should have the same dimension as the given width and height', function () {
        const drawingArea = document.createElement('div');
        const width = 400;
        const height = 200;
        const paper = initializeDrawingArea(drawingArea, width, height);

        assert.equal(paper.width, width, 'Drawing area doesn\'t have the expected width');
        assert.equal(paper.height, height, 'Drawing area doesn\'t have the expected height');
    });
});
