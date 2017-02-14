/* tslint:disable no-debugger */

import './../styles/main.scss';
import { initializeDrawingArea, drawLine } from './drawingArea';

const drawingArea = document.getElementById('drawingArea') as HTMLDivElement;
const paper = initializeDrawingArea(drawingArea);

drawLine({
    endX: 300,
    endY: 300,
    startX: 100,
    startY: 100,
    paper,
});
