import { initializeDrawingArea, drawLine } from '../../src/scripts/drawingArea';
import { userInteraction } from '../../src/scripts/userInteraction';
import { assert } from 'chai';

describe('userinteraction', function () {
    const width = 600;
    const height = 400;
    const drawingArea = document.createElement('div');
    let paper: RaphaelPaper;
    let drawingDiv: HTMLDivElement;

    drawingArea.setAttribute('id', 'wwp-drawingArea');
    drawingArea.style.height = `${height}px`;
    drawingArea.style.width = `${width}px`;
    drawingArea.style.border = '2px pink solid';

    beforeEach('creating a clean slate before each test', function () {
        drawingDiv = drawingArea.cloneNode(true) as HTMLDivElement;

        document.body.appendChild(drawingDiv); // so each time we have a clean slate
        paper = initializeDrawingArea(drawingDiv);
    });

    afterEach('cleaning the DOM after assertion', function () {
        drawingDiv.parentNode.removeChild(drawingDiv);
    });

    describe('mouse events', function () {
        it('should draw a line in response to mouse events', () => {
            userInteraction(paper, drawingDiv, drawLine);
            sendMouseEvent(100, 0, drawingDiv, 'mousedown');
            sendMouseEvent(100, 100, drawingDiv, 'mousemove');

            paper.forEach((el) => {
                const boundingBox = el.getBBox();

                assert.equal(boundingBox.height, 100,
                    'height of drawed line should be 100');

                return true;
            });
        });
        it('should not draw a line after mouseup', () => {
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

            assert.equal(raphaelElements.length, 1,
                'mousemove following a mouseup shouldn\'t draw a line');
        });

        it('should draw two line segments.', () => {
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
            assert.equal(raphaelElements[0].getBBox().height, 100,
                'boundingBox height of first path should be 100');
            assert.equal(raphaelElements[1].getBBox().width, 100,
                'boundingBox width of second path should be 100');
        });

        it('should not draw a line when only mouse moves (i.e. without mousedown)', () => {
            let raphaelElements: RaphaelElement[] = [];

            userInteraction(paper, drawingDiv, drawLine);
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

            userInteraction(paper, drawingDiv, drawLine);
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

            userInteraction(paper, drawingDiv, drawLine);

            sendMouseEvent(width, 100, drawingDiv, 'mousedown');
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

            userInteraction(paper, drawingDiv, drawLine);

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
                userInteraction(paper, drawingDiv, drawLine);
                drawingDiv.addEventListener('mousedown', function (event) {

                    assert.ok(event.defaultPrevented, 'default behavior of mousedown should be prevented.');
                });
                sendMouseEvent(100, 150, drawingDiv, 'mousedown');
            });
    });
    if (supportTouchEvent()) {
        describe('touch evetns', function () {
            it('should respond to touch events ', function () {
                const raphaelElements: RaphaelElement[] = [];

                userInteraction(paper, drawingDiv, drawLine);
                sendTouchEvent(drawingDiv, 'touchstart', [{ x: 150, y: 150 }]);
                sendTouchEvent(drawingDiv, 'touchmove', [{ x: 220, y: 200 }]);
                sendTouchEvent(drawingDiv, 'touchend', [{ x: 220, y: 200 }]);

                paper.forEach((el) => {
                    raphaelElements.push(el);

                    return true;
                });

                assert.equal(raphaelElements[0].getBBox().width, 70,
                    'boundingBox height of the path should be 100');
                assert.equal(raphaelElements[0].getBBox().height, 50,
                             'boundingBox width of the path should be 100');
            });
            it('should stop drawing on touchcancel event', () => {
                const raphaelElements: RaphaelElement[] = [];

                userInteraction(paper, drawingDiv, drawLine);
                sendTouchEvent(drawingDiv, 'touchstart', [{ x: 150, y: 150 }]);
                sendTouchEvent(drawingDiv, 'touchmove', [{ x: 220, y: 200 }]);
                sendTouchEvent(drawingDiv, 'touchcancel', [{ x: 220, y: 200 }]);
                sendTouchEvent(drawingDiv, 'touchmove', [{ x: 250, y: 250 }]);

                paper.forEach((el) => {
                    raphaelElements.push(el);

                    return true;
                });

                assert.equal(raphaelElements.length, 1, 'touchcancel should stop drawing');
                assert.equal(raphaelElements[0].getBBox().width, 70,
                    'boundingBox height of the path should be 100');
                assert.equal(raphaelElements[0].getBBox().height, 50,
                    'boundingBox width of the path should be 100');
            });
            it('should stop drawing on touchend event', () => {
                const raphaelElements: RaphaelElement[] = [];

                userInteraction(paper, drawingDiv, drawLine);
                sendTouchEvent(drawingDiv, 'touchstart', [{ x: 150, y: 150 }]);
                sendTouchEvent(drawingDiv, 'touchmove', [{ x: 220, y: 200 }]);
                sendTouchEvent(drawingDiv, 'touchend', [{ x: 220, y: 200 }]);
                sendTouchEvent(drawingDiv, 'touchmove', [{ x: 250, y: 250 }]);

                paper.forEach((el) => {
                    raphaelElements.push(el);

                    return true;
                });

                assert.equal(raphaelElements.length, 1, 'touchend should stop drawing');
                assert.equal(raphaelElements[0].getBBox().width, 70,
                    'boundingBox height of the path should be 100');
                assert.equal(raphaelElements[0].getBBox().height, 50,
                    'boundingBox width of the path should be 100');
            });
            it('default behavior of touchdown event (i.e  scrolling) should be prevented',
                () => {
                    userInteraction(paper, drawingDiv, drawLine);
                    drawingDiv.addEventListener('touchstart', function (event) {

                        assert.ok(event.defaultPrevented, 'default behavior of touchdown event should be prevented.');
                    });
                    sendTouchEvent(drawingDiv, 'touchstart', [{ x: 150, y: 150 }]);
                    sendTouchEvent(drawingDiv, 'touchmove', [{ x: 220, y: 200 }]);
                    sendTouchEvent(drawingDiv, 'touchend', [{ x: 220, y: 200 }]);
                });
            it('should stop drawing on multi touch gestures', () => {
                const raphaelElements: RaphaelElement[] = [];
                userInteraction(paper, drawingDiv, drawLine);

                sendTouchEvent(drawingDiv, 'touchstart', [{ x: 10, y: 10 }]);
                sendTouchEvent(drawingDiv, 'touchmove', [{ x: 50, y: 70 }]);
                sendTouchEvent(drawingDiv, 'touchstart', [{ x: 50, y: 70 }, { x: 150, y: 150 }]);
                sendTouchEvent(drawingDiv, 'touchmove', [{ x: 150, y: 150 }, { x: 200, y: 200 }]);
                sendTouchEvent(drawingDiv, 'touchend', [{ x: 150, y: 150 }, { x: 200, y: 200 }]);

                paper.forEach((el) => {
                    raphaelElements.push(el);

                    return true;
                });

                assert.equal(raphaelElements.length, 1, 'should be only one path');
                assert.equal(raphaelElements[0].getBBox().width, 40, 'getBBox().width of path should be 40');
                assert.equal(raphaelElements[0].getBBox().height, 60, 'getBBox().height of path should be 60');
            });
        });
    }
});

function sendTouchEvent(element: HTMLDocument | HTMLDivElement, eventType: string, coordinates: coordinate[]) {
    let touchList: Touch[] = [];

    coordinates.forEach(coordinate => {
        let relativeX: number;
        let relativeY: number;

        if (element instanceof HTMLDivElement) {
            relativeX = findRelativePosition(coordinate.x, element, 'x');
            relativeY = findRelativePosition(coordinate.y, element, 'y');
        } else {
            relativeX = coordinate.x;
            relativeY = coordinate.y;
        }

        touchList.push(createTouchObject(relativeX, relativeY, element));
    });

    const touchEvent = new TouchEvent(eventType, {
        cancelable: true,
        bubbles: true,
        touches: touchList,
        targetTouches: [],
        changedTouches: touchList,
        shiftKey: true,
    });

    element.dispatchEvent(touchEvent);
}

function createTouchObject(x: number, y: number, element: HTMLDivElement | HTMLDocument): Touch {
    return new Touch({
        identifier: Date.now(),
        target: element,
        clientX: x,
        clientY: y,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5,
    });
}

function sendMouseEvent(x: number, y: number, element: HTMLDocument | HTMLDivElement, eventType: string) {
    let relativeX: number;
    let relativeY: number;
    if (element instanceof HTMLDivElement) {
        relativeX = findRelativePosition(x, element, 'x');
        relativeY = findRelativePosition(y, element, 'y');
    } else {
        relativeX = x;
        relativeY = y;
    }
    const event = document.createEvent('MouseEvent');

    event.initMouseEvent(
        eventType,
        true /* bubble */,
        true /* cancelable */,
        window, null,
        null,
        null,
        relativeX,
        relativeY, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left click*/,
        null,
    );

    element.dispatchEvent(event);
}

function findRelativePosition(position: number, el: HTMLElement, whatKind: 'x' | 'y'): number {
    let offset: number;
    const borderWidth = window.getComputedStyle(el).borderLeftWidth;
    const paddingWidth = window.getComputedStyle(el).paddingLeft;

    if (whatKind === 'x') {
        offset = el.offsetLeft;
    } else {
        offset = el.offsetTop;
    }

    return position + parseInt(borderWidth, 10) + parseInt(paddingWidth, 10) + offset;
}

function supportTouchEvent() {
    if (typeof Touch !== 'undefined' &&
        typeof TouchEvent !== 'undefined' &&
        Touch.length === 1 &&
        TouchEvent.length === 1) {

        return true;
    }

    return false;
}
