import { initializeDrawingArea, drawLine } from '../../src/scripts/drawingArea';
import { userInteraction } from '../../src/scripts/userInteraction';
import { DOMElement } from '../../src/scripts/DOMElement';
import { sendTouchEvent, supportTouchEvent } from './sendEvent';
import { postTest, preTest } from './userinteraction.BeforeAfterEach';
import { assert } from 'chai';

if (supportTouchEvent()) {
    describe('Touch Evetns: ', function () {
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

            const { x, x2, y, y2, width, height } = raphaelElements[0].getBBox();

            assert.equal(raphaelElements.length, 1,
                'should be 1 path, that is one line');
            assert.equal(width, 70,
                'boundingBox width of the path should be 70');
            assert.equal(height, 30,
                'boundingBox height of the path should be 30');
            assert.approximately(x, 150, 0.02,
                'path should start at x = 150');
            assert.approximately(y, 170, 0.02,
                'path should start at y = 170');
            assert.approximately(x2, 220, 0.02,
                'path should end at x2 = 220');
            assert.approximately(y2, 200, 0.02,
                'path should end at y2 = 200');
        });
        it('should draw a dot when screen is tapped', () => {
            const raphaelElements: RaphaelElement[] = [];

            userInteraction(paper, drawingDOM, drawLine);
            sendTouchEvent(drawingDiv, 'touchstart', [{ x: 150, y: 160 }]);
            sendTouchEvent(drawingDiv, 'touchend', [{ x: 150, y: 160 }]);

            paper.forEach((el) => {
                raphaelElements.push(el);

                return true;
            });
            const bBox = raphaelElements[0].getBBox();

            assert.equal(raphaelElements.length, 1, 'tapping on screen should draw a dot');
            assert.equal(bBox.x, 150, 'should\'ve drawn a dot at specified position');
            assert.equal(bBox.y, 160, 'should\'ve drawn a dot at specified position');
            assert.equal(bBox.x2, 150, 'should\'ve drawn a dot at specified position');
            assert.equal(bBox.y2, 160, 'should\'ve drawn a dot at specified position');

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
                'width of the line should be 70');
            assert.equal(raphaelElements[0].getBBox().height, 50,
                'height of the line should be 50');
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
                'width of the line should be 70');
            assert.equal(raphaelElements[0].getBBox().height, 50,
                'height of the line should be 60');
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
        it('should stop drawing on multitouch gestures', () => {
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

            assert.equal(raphaelElements.length, 1, 'should only be one path');
            assert.equal(raphaelElements[0].getBBox().width, 40, 'getBBox().width of path should be 40');
            assert.equal(raphaelElements[0].getBBox().height, 60, 'getBBox().height of path should be 60');
        });
    });
}
