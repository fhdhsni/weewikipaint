import { initializeDrawingArea, drawLine } from '../../src/scripts/drawingArea';
import { userInteraction } from '../../src/scripts/userInteraction';
import { DOMElement } from '../../src/scripts/DOMElement';
import { sendMouseEvent } from './sendEvent';
import { postTest, preTest } from './userinteraction.BeforeAfterEach';
import { assert } from 'chai';

describe('mouse events', function () {
    let paper: RaphaelPaper;
    let drawingDOM: DOMElementI;
    let drawingDiv: HTMLDivElement;

    beforeEach('creating a clean slate before each test', function () {
        ({
            paper,
            drawingDOM,
            drawingDiv,
        } = preTest());
    });

    afterEach('cleaning the DOM after assertions', function () {
        postTest();
    });

    it('should draw a line in response to mouse events at specified positions', () => {
        userInteraction(paper, drawingDOM, drawLine);
        sendMouseEvent(100, 10, drawingDiv, 'mousedown');
        sendMouseEvent(100, 100, drawingDiv, 'mousemove');

        paper.forEach((el) => {
            const boundingBox = el.getBBox();
            // using toFixed because IE10 does wacky stuff like giving 10.0000006534 instead of 10
            const x = boundingBox.x.toFixed(1);
            const y = boundingBox.y.toFixed(1);
            const x2 = boundingBox.x2.toFixed(1);
            const y2 = boundingBox.y2.toFixed(1);

            assert.equal(boundingBox.height, 90,
                'height of drawed line should be 100');
            assert.equal(x, 100,
                'should start at x = 100');
            assert.equal(y, 10,
                'should start at y = 10');
            assert.equal(x2, 100,
                'should end at x2 = 100');
            assert.equal(y2, 100,
                'should end at y2 = 100');

            return true;
        });
    });
    it('should not draw a line after mouseup', () => {
        const raphaelElements: RaphaelElement[] = [];

        userInteraction(paper, drawingDOM, drawLine);
        sendMouseEvent(100, 0, drawingDiv, 'mousedown');
        sendMouseEvent(100, 100, drawingDiv, 'mousemove');
        sendMouseEvent(100, 100, drawingDiv, 'mouseup');
        sendMouseEvent(200, 200, drawingDiv, 'mousemove');

        paper.forEach((el) => {
            raphaelElements.push(el);
            return true;
        });

        assert.equal(raphaelElements.length, 1,
            'mousemove following a mouseup shouldn\'t draw a line');
    });

    it('should draw two line segments.', () => {
        const raphaelElements: RaphaelElement[] = [];

        userInteraction(paper, drawingDOM, drawLine);
        sendMouseEvent(100, 0, drawingDiv, 'mousedown');
        sendMouseEvent(100, 100, drawingDiv, 'mousemove');
        sendMouseEvent(200, 100, drawingDiv, 'mousemove');
        paper.forEach((el) => {
            raphaelElements.push(el);

            return true;
        });

        assert.equal(raphaelElements.length, 2, 'should have drawn 2 paths');
        assert.equal(raphaelElements[0].getBBox().height, 100,
            'boundingBox height of first path should be 100');
        assert.equal(raphaelElements[1].getBBox().width, 100,
            'boundingBox width of second path should be 100');
    });

    it('should not draw a line when only mouse moves (i.e. without mousedown)', () => {
        let raphaelElements: RaphaelElement[] = [];

        userInteraction(paper, drawingDOM, drawLine);
        sendMouseEvent(100, 100, drawingDiv, 'mousemove');

        paper.forEach((el) => {
            raphaelElements.push(el);

            return true;
        });

        assert.equal(raphaelElements.length, 0,
            'Nothing should be drawn while mouse moves without mousedown');
    });
    it('should not draw a line when mousemove starts outside of drawingDiv ', () => {
        let raphaelElements: RaphaelElement[] = [];

        userInteraction(paper, drawingDOM, drawLine);
        sendMouseEvent(700, 100, document, 'mousedown');
        sendMouseEvent(100, 100, drawingDiv, 'mousemove');

        sendMouseEvent(100, 500, document, 'mousedown');
        sendMouseEvent(100, 100, drawingDiv, 'mousemove');

        paper.forEach((el) => {
            raphaelElements.push(el);

            return true;
        });

        assert.equal(raphaelElements.length, 0,
            'Nothing should be drawn while mousedown happens outside drawingDiv');
    });
    it('should draw a line when mousedown starts exactly at the edge of drawingDiv', () => {
        let raphaelElements: RaphaelElement[] = [];

        userInteraction(paper, drawingDOM, drawLine);

        sendMouseEvent(600, 100, drawingDiv, 'mousedown');
        sendMouseEvent(100, 100, drawingDiv, 'mousemove');

        paper.forEach((el) => {
            raphaelElements.push(el);

            return true;
        });

        assert.equal(
            raphaelElements.length, 1,
            'when mouse down starts at the edge of drawingDiv a line should be drawn');
    });
    it('should stop drawing when mouse leaves drawingDiv', () => {
        let raphaelElements: RaphaelElement[] = [];

        userInteraction(paper, drawingDOM, drawLine);

        sendMouseEvent(300, 100, drawingDiv, 'mousedown');

        // NOTE: not 100% accurate, since in real world mousemove
        // event doesnt' happen on drawingDiv once mouse leaves it
        sendMouseEvent(900, 100, drawingDiv, 'mousemove');

        // =mouseleave= doesn't happen automatically like in real
        // situations when user actually moves out of drawingDiv; hence
        // we simulate that manually
        sendMouseEvent(900, 100, drawingDiv, 'mouseleave');
        sendMouseEvent(300, 300, drawingDiv, 'mousemove');

        paper.forEach((el) => {
            raphaelElements.push(el);

            return true;
        });

        assert.equal(
            raphaelElements.length, 1,
            'when mouse leaves the drawingDiv, drawing should not happen when it returns to drawingDiv');
    });
    it('default behavior of mousedown event (i.e seleting texts or dragging imgs) should be prevented',
        () => {
            userInteraction(paper, drawingDOM, drawLine);
            drawingDiv.addEventListener('mousedown', function (event) {

                assert.ok(event.defaultPrevented, 'default behavior of mousedown should be prevented.');
            });
            sendMouseEvent(100, 150, drawingDiv, 'mousedown');
        });
});
