import './../styles/main.scss';
import { initializeDrawingArea, drawLine } from './drawingArea';
import { userInteraction } from './userInteraction';

const drawingArea = document.getElementById('drawingArea') as HTMLDivElement;
const paper = initializeDrawingArea(drawingArea);

userInteraction(paper, drawingArea, drawLine);
