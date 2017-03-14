import { initializeDrawingArea, drawLine } from '../../src/scripts/drawingArea';
import { userInteraction } from '../../src/scripts/userInteraction';
import { DOMElement } from '../../src/scripts/DOMElement';
import { preTest, postTest } from './userinteraction.BeforeAfterEach';
import { assert } from 'chai';

describe('Miscellaneous: ', function () {
    let paper: RaphaelPaper;
    let drawingDOM: DOMElementI;
    let drawingDiv: HTMLDivElement;

    beforeEach('set up', () => {
        ({
            paper,
            drawingDOM,
            drawingDiv,
        } = preTest());
    });
    // TODO: Doesn't pass in Travis-CI :(
    it.skip('should call calculateBoundingBox when resize event is fired', function (done) {
        this.timeout(5000);
        userInteraction(paper, drawingDOM, drawLine);
        const beforeChange = drawingDOM.drawingAreaPosition;

        document.getElementById('wwp-drawingArea').setAttribute('style', 'height: 800px');
        window.addEventListener('resize', resizeListener);

        const evt = window.document.createEvent('UIEvents');

        evt.initUIEvent('resize', true, false, window, 0);
        window.dispatchEvent(evt);

        function resizeListener() {
            setTimeout(function () {
                const afterChange = drawingDOM.drawingAreaPosition;

                document.getElementById('wwp-drawingArea').removeAttribute('style');
                assert.notEqual(beforeChange.height, afterChange.height,
                    'Resize event should trigger getBoundingClientRect which calculates new ClientRect drawingDOM');
                assert.equal(afterChange.height, 800,
                    'Resize event should trigger getBoundingClientRect which calculates new ClientRect for drawingDOM');
                postTest();
                window.removeEventListener('resize', resizeListener);
                done();
            }, 120);
        }
    });

    // TODO: Doesn't pass in Travis-CI :(
    it.skip('should call calculateBoundingBox when scroll is triggered', function (done) {
        this.timeout(5000);
        userInteraction(paper, drawingDOM, drawLine);
        let alreadyDone = false;
        const beforeChange = drawingDOM.drawingAreaPosition;

        const helperDiv = document.createElement('div'); // to help us make window scrollable
        helperDiv.setAttribute('id', 'helper');
        helperDiv.style.backgroundColor = 'red';
        helperDiv.style.height = '1em';
        helperDiv.style.width = '1em';
        helperDiv.style.marginTop = '100em';
        document.body.appendChild(helperDiv);

        document.getElementById('wwp-drawingArea').setAttribute('style', 'height: 800px');

        document.addEventListener('scroll', function () {
            setTimeout(function () {
                if (alreadyDone) {
                    return undefined;
                }
                alreadyDone = true;
                const afterChange = drawingDOM.drawingAreaPosition;
                helperDiv.parentNode.removeChild(helperDiv);
                document.getElementById('wwp-drawingArea').removeAttribute('style');
                postTest();
                assert.notEqual(beforeChange.height, afterChange.height,
                    'Scroll event should trigger getBoundingClientRect');
                assert.equal(afterChange.height, 800,
                    'Scroll event should trigger getBoundingClientRect');
                window.scroll(0, 0);
                done();
            }, 120);

        });
        window.scroll(0, 1000);
    });
});
