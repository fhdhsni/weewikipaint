import { initializeDrawingArea } from '../../src/scripts/drawingArea';
import { DOMElement } from '../../src/scripts/DOMElement';

let paper: RaphaelPaper;
let drawingDiv: HTMLDivElement;
let drawingDOM: DOMElementI;
const width = 600;
const height = 400;
const drawingArea = document.createElement('div');

drawingArea.setAttribute('id', 'wwp-drawingArea');
drawingArea.style.height = `${height}px`;
drawingArea.style.width = `${width}px`;
drawingArea.style.border = '2px pink solid';

export function preTest() {
    drawingDiv = drawingArea.cloneNode(true) as HTMLDivElement;

    document.body.appendChild(drawingDiv); // so each time we have a clean slate
    paper = initializeDrawingArea(drawingDiv);
    drawingDOM = new DOMElement(drawingDiv);

    return {
        drawingDiv,
        paper,
        drawingDOM,
    };
}

export function postTest() {
    drawingDiv.parentNode.removeChild(drawingDiv);
}
