import './../styles/main.scss';
import { initializeDrawingArea } from './init';

const drawingArea = document.getElementById('drawingArea') as HTMLDivElement;
const paper = initializeDrawingArea(drawingArea);
