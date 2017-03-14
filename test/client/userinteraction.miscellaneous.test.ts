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
});
