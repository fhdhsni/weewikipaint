import './../styles/main.scss';
import { initializeDrawingArea } from './drawingArea';

const drawingArea = document.getElementById('drawingArea') as HTMLDivElement;
const paper = initializeDrawingArea(drawingArea);
