import { initializeDrawingArea, drawLine } from '../../src/scripts/drawingArea';
import { userInteraction } from '../../src/scripts/userInteraction';
import { assert } from 'chai';

describe('userinteraction', function () {
    const width = 600;
    const height = 400;
    const drawingArea = document.createElement('div');
    let paper: RaphaelPaper;

    drawingArea.setAttribute('id', 'wwp-drawingArea');
    drawingArea.style.border = '2px pink solid';

    beforeEach(function () {
        const clonedDrawingArea = drawingArea.cloneNode(true) as HTMLDivElement;

        document.body.appendChild(clonedDrawingArea); // so each time we have a clean slate
        paper = initializeDrawingArea(clonedDrawingArea);
    });

    afterEach('cleaning the DOM after assertion', function () {
        const extractedDiv = document.getElementById('wwp-drawingArea');

        extractedDiv.parentNode.removeChild(extractedDiv);
    });

    it('should draw a line in response to mouse events', () => {
        const drawingDiv = document.getElementById('wwp-drawingArea') as HTMLDivElement;

        userInteraction(paper, drawingDiv, drawLine);
        sendMouseEvent(100, 0, drawingDiv, 'mousedown');
        sendMouseEvent(100, 100, drawingDiv, 'mousemove');

        paper.forEach((el) => {
            const boundingBox = el.getBBox();

            assert.equal(boundingBox.height, 100, 'height of drawed line should be 100');

            return true;
        });
    });
    it('should not draw a line after mouseup', () => {
        const drawingDiv = document.getElementById('wwp-drawingArea') as HTMLDivElement;
        const raphaelElements: RaphaelElement[] = [];

        userInteraction(paper, drawingDiv, drawLine);
        sendMouseEvent(100, 0, drawingDiv, 'mousedown');
        sendMouseEvent(100, 100, drawingDiv, 'mousemove');
        sendMouseEvent(100, 100, drawingDiv, 'mouseup');
        sendMouseEvent(200, 200, drawingDiv, 'mousemove');

        paper.forEach((el) => {
            raphaelElements.push(el);
            return true;
        });

        assert.equal(raphaelElements.length, 1, 'mousemove following a mouseup shouldn\'t draw a line');
    });

    it('should draw two lines.', () => {
        const drawingDiv = document.getElementById('wwp-drawingArea') as HTMLDivElement;
        const raphaelElements: RaphaelElement[] = [];

        userInteraction(paper, drawingDiv, drawLine);
        sendMouseEvent(100, 0, drawingDiv, 'mousedown');
        sendMouseEvent(100, 100, drawingDiv, 'mousemove');
        sendMouseEvent(200, 100, drawingDiv, 'mousemove');
        paper.forEach((el) => {
            raphaelElements.push(el);

            return true;
        });

        assert.equal(raphaelElements.length, 2, 'should have drawn 2 paths');
        assert.equal(raphaelElements[0].getBBox().height, 100, 'boundingBox height of first path should be 100');
        assert.equal(raphaelElements[1].getBBox().width, 100, 'boundingBox width of second path should be 100');
    });

    it('should not draw a line when only mouse moves (i.e. without mouse down)', () => {
        const drawingDiv = document.getElementById('wwp-drawingArea') as HTMLDivElement;
        let raphaelElements: RaphaelElement[] = [];

        userInteraction(paper, drawingDiv, drawLine);
        sendMouseEvent(100, 100, drawingDiv, 'mousemove');

        paper.forEach((el) => {
            raphaelElements.push(el);

            return true;
        });
        assert.equal(raphaelElements.length, 0, 'Nothing should be drawn while mouse moves without mousedown');
    });
});

function sendMouseEvent(x: number, y: number, el: HTMLDivElement, type: string) {
    const relativeX = findRelativePosition(x, el);
    const relativeY = findRelativePosition(y, el);
    const ev = document.createEvent('MouseEvent');

    ev.initMouseEvent(
        type,
        true /* bubble */,
        true /* cancelable */,
        window, null,
        null,
        null,
        relativeX,
        relativeY, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null,
    );

    el.dispatchEvent(ev);
}

function findRelativePosition(position: number, el: HTMLElement): number {
    const borderWidth = window.getComputedStyle(el).borderLeftWidth;
    const paddingWidth = window.getComputedStyle(el).paddingLeft;

    return position + parseInt(borderWidth, 10) + parseInt(paddingWidth, 10);
}
