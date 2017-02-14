import { initializeDrawingArea, drawLine } from '../../src/scripts/drawingArea';
import { assert } from 'chai';

describe('Drawing area', function () {
    const width = 600;
    const height = 400;
    const drawingArea = document.createElement('div');
    drawingArea.setAttribute('id', 'wwp-drawingArea');
    drawingArea.style.width = `${width}px`;
    drawingArea.style.height = `${height}px`;
    let paper: RaphaelPaper;

    beforeEach(function () {
        const clonedDrawingArea = drawingArea.cloneNode(true) as HTMLDivElement;

        document.body.appendChild(clonedDrawingArea);
        paper = initializeDrawingArea(clonedDrawingArea);
    });

    afterEach('cleaning the DOM after assertion', function () {
        const extractedDiv = document.getElementById('wwp-drawingArea');
        extractedDiv.parentNode.removeChild(extractedDiv);
    });

    it('should be initialized with Raphael', function () {
        const fetchedDrawingArea = document.getElementById('wwp-drawingArea') as HTMLDivElement;
        const tagName = fetchedDrawingArea.children[0].tagName.toLowerCase();

        assert.equal(tagName, 'svg', '#wwp-drawingArea should have a SVG child');
    });

    it('should have the same dimension as the width and height of its parent', function () {
        // tslint:disable-next-line
        debugger;
        assert.equal(paper.width, width, 'Drawing area doesn\'t have the expected width');
        assert.equal(paper.height, height, 'Drawing area doesn\'t have the expected height');
    });

    it('should draw a line', function () {
        let elements: RaphaelElement[] = [];
        const coordinate = {
            endX: 300,
            endY: 300,
            startX: 100,
            startY: 100,
            paper,
        };

        drawLine(coordinate);
        paper.forEach(function (el) {
            elements.push(el);

            return true;
        });
        assert.equal(elements.length, 1, 'should be one');
        const path = elements[0].node;
        const d = path.getAttribute('d');

        if (d.indexOf(',') !== -1) {
            assert.equal(d,
                `M${coordinate.startX},${coordinate.startY}L${coordinate.endX},${coordinate.endY}`);
        } else {
            // We are in IE which uses different formating for its d attribute in paths
            assert.equal(d,
                `M ${coordinate.startX} ${coordinate.startY} L ${coordinate.endX} ${coordinate.endY}`);
        }

    });
});
