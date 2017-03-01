import './../styles/main.scss';
import { initializeDrawingArea, drawLine } from './drawingArea';
import { userInteraction } from './userInteraction';
import { DOMElement } from './DOMElement';

const drawingArea = document.getElementById('drawingArea') as HTMLDivElement;
const paper = initializeDrawingArea(drawingArea);
const drawingDOM = new DOMElement(drawingArea);

userInteraction(paper, drawingDOM, drawLine);
