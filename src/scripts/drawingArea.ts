import * as raphael from 'raphael';

export function initializeDrawingArea(drawingAreaElement: HTMLDivElement): RaphaelPaper {
    const widthStr = window.getComputedStyle(drawingAreaElement).getPropertyValue('width');
    const width = parseInt(widthStr, 10);

    const heightStr = window.getComputedStyle(drawingAreaElement).getPropertyValue('height');
    const height = parseInt(heightStr, 10);

    const paper = raphael(drawingAreaElement, width, height);

    return paper;
}

export function drawLine(coordinate: DrawLineArgumentObject) {
    coordinate
        .paper
        .path(`M${coordinate.startX},${coordinate.startY}L${coordinate.endX},${coordinate.endY}`)
        .attr({
            'stroke-width': 2,
            'stroke': 'rebeccapurple',
            'stroke-linecap': 'round',
        });
}
