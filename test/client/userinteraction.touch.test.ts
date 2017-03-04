import { initializeDrawingArea, drawLine } from '../../src/scripts/drawingArea';
import { userInteraction } from '../../src/scripts/userInteraction';
import { DOMElement } from '../../src/scripts/DOMElement';
import { sendTouchEvent, supportTouchEvent } from './sendEvent';
import { postTest, preTest } from './userinteraction.BeforeAfterEach';
import { assert } from 'chai';

if (supportTouchEvent()) {
    describe('Touch Evetns', function () {
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

        afterEach('cleaning the DOM after assertion', function () {
            postTest();
        });

        it('Should respond to touch events ', function () {
            const raphaelElements: RaphaelElement[] = [];

            userInteraction(paper, drawingDOM, drawLine);
            sendTouchEvent(drawingDiv, 'touchstart', [{ x: 150, y: 170 }]);
            sendTouchEvent(drawingDiv, 'touchmove', [{ x: 220, y: 200 }]);
            sendTouchEvent(drawingDiv, 'touchend', [{ x: 220, y: 200 }]);

            paper.forEach((el) => {
                raphaelElements.push(el);

                return true;
            });
            assert.equal(raphaelElements[0].getBBox().width, 70,
                'boundingBox width of the path should be 70');
            assert.equal(raphaelElements[0].getBBox().height, 30,
                'boundingBox height of the path should be 30');
            assert.equal(raphaelElements[0].getBBox().x, 150,
                'path should start at x = 150');
            assert.equal(raphaelElements[0].getBBox().y, 170,
                'path should start at y = 170');
            assert.equal(raphaelElements[0].getBBox().x2, 220,
                'path should end at x2 = 200');
            assert.equal(raphaelElements[0].getBBox().y2, 200,
                'path should end at y2 = 200');
        });
        it('Should stop drawing on touchcancel event', () => {
            const raphaelElements: RaphaelElement[] = [];

            userInteraction(paper, drawingDOM, drawLine);
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
        it('Should stop drawing on touchend event', () => {
            const raphaelElements: RaphaelElement[] = [];

            userInteraction(paper, drawingDOM, drawLine);
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
                userInteraction(paper, drawingDOM, drawLine);
                drawingDiv.addEventListener('touchstart', function (event) {

                    assert.ok(event.defaultPrevented, 'default behavior of touchdown event should be prevented.');
                });
                sendTouchEvent(drawingDiv, 'touchstart', [{ x: 150, y: 150 }]);
                sendTouchEvent(drawingDiv, 'touchmove', [{ x: 220, y: 200 }]);
                sendTouchEvent(drawingDiv, 'touchend', [{ x: 220, y: 200 }]);
            });
        it('should stop drawing on multi touch gestures', () => {
            const raphaelElements: RaphaelElement[] = [];
            userInteraction(paper, drawingDOM, drawLine);

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
