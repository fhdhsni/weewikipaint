import './../styles/main.scss';
import { initializeDrawingArea } from './init';

const drawingArea = document.getElementById('drawingArea') as HTMLDivElement;
const paper = initializeDrawingArea(drawingArea);

paper.path('M100,10L300,20');
