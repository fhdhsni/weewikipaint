import { initializeDrawingArea, drawLine } from '../../src/scripts/drawingArea';
import { userInteraction } from '../../src/scripts/userInteraction';
import { DOMElement } from '../../src/scripts/DOMElement';
import { sendMouseEvent } from './sendEvent';
import { postTest, preTest } from './userinteraction.BeforeAfterEach';
import { assert } from 'chai';

describe('Mouse Events: ', function () {
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
    it('Should draw a dot in response to mouse click', () => {
        const raphaelElements: RaphaelElement[] = [];

        userInteraction(paper, drawingDOM, drawLine);
        sendMouseEvent(200, 100, drawingDiv, 'click');

        paper.forEach((el) => {
            raphaelElements.push(el);
            return true;
        });

        assert.equal(raphaelElements.length, 1,
            'click should draw a dot');
        const { x, x2, y, y2, height, width } = raphaelElements[0].getBBox();
        assert.equal(height, 0,
            'height of drawn dot should be, well, 0');
        assert.equal(width, 0,
            'width of drawn dot should be, well, 0');
        assert.equal(x, 200,
            'drawn dot should happen at x = 200');
        assert.equal(y, 100,
            'drawn dot should happen at y = 100');
        assert.equal(x, x2, 'drawn thing(!) should be a dot i.e x = x1');
        assert.equal(y, y2, 'drawn thing(!) should be a dot i.e y = y1');
    });

    it('Should have stroke-width of at least 2 and stroke-linecap of round for a dot to visually appear', () => {
        const raphaelElements: RaphaelElement[] = [];

        userInteraction(paper, drawingDOM, drawLine);
        sendMouseEvent(200, 100, drawingDiv, 'click');

        paper.forEach((el) => {
            raphaelElements.push(el);
            const sWidth = el.node.getAttribute('stroke-width');
            const linecap = el.node.getAttribute('stroke-linecap');
            assert.equal(sWidth, 2);
            assert.equal(linecap, 'round');
            return true;
        });
    });

    it('Should draw a line in response to mouse events at specified positions', () => {
        userInteraction(paper, drawingDOM, drawLine);
        sendMouseEvent(100, 10, drawingDiv, 'mousedown');
        sendMouseEvent(150, 100, drawingDiv, 'mousemove');

        paper.forEach((el) => {
            const { x, x2, y, y2, height } = el.getBBox();

            assert.equal(height, 90,
                'height of drawn line should be 90');
            assert.approximately(x, 100, 0.02,
                'should start at x = 100');
            assert.approximately(y, 10, 0.02,
                'should start at y = 10');
            assert.approximately(x2, 150, 0.02,
                'should end at x2 = 150');
            assert.approximately(y2, 100, 0.02,
                'should end at y2 = 100');

            return true;
        });
    });
    it('Should not draw a line after mouseup', () => {
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

    it('Should draw two line segments.', () => {
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

    it('Should not draw a line when only mouse moves (i.e. without mousedown)', () => {
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
    it('Should not draw a line when mousemove starts outside of drawingDiv ', () => {
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
    it('Should draw a line when mousedown starts exactly at the edge of drawingDiv', () => {
        let raphaelElements: RaphaelElement[] = [];

        userInteraction(paper, drawingDOM, drawLine);

        sendMouseEvent(0, 100, drawingDiv, 'mousedown');
        sendMouseEvent(110, 150, drawingDiv, 'mousemove');

        paper.forEach((el) => {
            raphaelElements.push(el);

            return true;
        });
        const { x, x2, y, y2, width, height } = raphaelElements[0].getBBox();

        assert.equal(
            raphaelElements.length, 1,
            'when mouse down starts at the edge of drawingDiv a line should be drawn');
        assert.equal(x, 0, 'drawing should start at x = 0');
        assert.equal(x2, 110, 'drawing should end at x = 110');
        assert.equal(y, 100, 'drawing should start at y = 100');
        assert.equal(y2, 150, 'drawing should end at y = 150');
    });
    it('Should continue drawing when mouse leaves drawingDiv and comes back in', () => {
        let raphaelElements: RaphaelElement[] = [];

        userInteraction(paper, drawingDOM, drawLine);
        sendMouseEvent(300, 100, drawingDiv, 'mousedown');

        // NOTE: not 100% accurate, since in real world mousemove
        // event doesnt' happen on drawingDiv once mouse leaves it
        sendMouseEvent(900, 100, drawingDiv, 'mousemove');
        sendMouseEvent(300, 300, drawingDiv, 'mousemove');

        paper.forEach((el) => {
            raphaelElements.push(el);

            return true;
        });

        assert.equal(
            raphaelElements.length, 2,
            'when mouse leaves the drawingDiv, drawing should start again from where it comes in');
    });
    it('default behavior of mousedown event (i.e seleting texts or dragging imgs) should be prevented',
        () => {
            userInteraction(paper, drawingDOM, drawLine);
            drawingDiv.addEventListener('mousedown', function (event) {

                assert.ok(event.defaultPrevented, 'default behavior of mousedown should be prevented.');
            });
            sendMouseEvent(100, 150, drawingDiv, 'mousedown');
        });

    it('should stop drawing when mouse leaves drawingDiv and mouse button is released.',
        () => {
            let raphaelElements: RaphaelElement[] = [];

            userInteraction(paper, drawingDOM, drawLine);

            sendMouseEvent(100, 150, drawingDiv, 'mousedown');
            sendMouseEvent(700, 250, drawingDiv, 'mousemove');
            sendMouseEvent(700, 250, document.body, 'mouseup');
            sendMouseEvent(700, 300, document.body, 'mousedown');
            sendMouseEvent(150, 250, drawingDiv, 'mousemove');

            paper.forEach((el) => {
                raphaelElements.push(el);

                return true;
            });

            assert.equal(
                raphaelElements.length, 1,
                'when mouse button is released outside drawingDiv, on its return, no line should be drawn');
        });
    it('should stop drawing when mouse button is released outside browser',
        () => {
            let raphaelElements: RaphaelElement[] = [];

            userInteraction(paper, drawingDOM, drawLine);

            sendMouseEvent(100, 150, drawingDiv, 'mousedown');
            sendMouseEvent(700, 250, drawingDiv, 'mousemove');
            sendMouseEvent(null, null, document, 'mouseleave');
            sendMouseEvent(null, null, document, 'mouseup');
            sendMouseEvent(150, 250, drawingDiv, 'mousemove');

            paper.forEach((el) => {
                raphaelElements.push(el);

                return true;
            });

            assert.equal(
                raphaelElements.length, 1,
                'when mouse button is released outside browser window, on its return, no line should be drawn');
        });
});
