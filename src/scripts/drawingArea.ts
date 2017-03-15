import * as raphael from 'raphael';

const color = '#663399';
const strokeWidth = 2;

export function initializeDrawingArea(drawingAreaElement: HTMLDivElement): RaphaelPaper {
    const widthStr = window.getComputedStyle(drawingAreaElement).getPropertyValue('width');
    const width = parseInt(widthStr, 10);

    const heightStr = window.getComputedStyle(drawingAreaElement).getPropertyValue('height');
    const height = parseInt(heightStr, 10);

    const paper = raphael(drawingAreaElement, width, height);

    return paper;
}

export function drawLine(o: DrawLineArgumentObject) {
    const endX = o.endX ? o.endX : o.startX;
    const endY = o.endY ? o.endY : o.startY;

    o.paper
        .path(`M${o.startX},${o.startY}L${endX},${endY}`)
        .attr({
            'stroke-width': strokeWidth,
            'stroke': `${color}`,
            'stroke-linecap': 'round',
        });
}

// export function circle(x: number, y: number, paper: RaphaelPaper) {
//     paper.circle(x, y, 1).attr({
//         'fill': `${color}`,
//         'stroke-width': 0,
//     });
// }
