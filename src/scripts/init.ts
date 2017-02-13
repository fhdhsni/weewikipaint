/* tslint:disable */
import * as raphael from 'raphael';

export function initializeDrawingArea(drawingAreaElement: HTMLDivElement): RaphaelPaper {
    const widthString = window.getComputedStyle(drawingAreaElement).getPropertyValue('width');
    const widthNumber = parseInt(widthString, 10);

    const heightString = window.getComputedStyle(drawingAreaElement).getPropertyValue('height');
    const heightNumber = parseInt(heightString, 10);

    const paper = raphael(drawingAreaElement, widthNumber, heightNumber);

    return paper;
}

export function drawLine(startX: number, startY: number, endX: number, endY: number) {
    // paper.path('M100,10L300,20');
}
