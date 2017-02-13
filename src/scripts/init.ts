import * as raphael from 'raphael';

export function initializeDrawingArea(drawingAreaElement: HTMLDivElement, width: number, height: number): RaphaelPaper {
    const paper = raphael(drawingAreaElement, width, height);

    return paper;
}
