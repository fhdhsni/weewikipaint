/**
 * draws lines on drawingArea when user clicks/touches and drags
 */
export function userInteraction(paper: RaphaelPaper, drawingDOM: DOMElementI, drawLine: DrawLine) {
    let start: Coordinate = undefined;

    document.body.addEventListener('mousemove', (event) => {
        if (drawingDOM.mouseOrTouchIsDown) {
            start.dottable = false;
            const coordinate = drawingDOM.relativeOffset(event.clientX, event.clientY);

            drag(coordinate.x, coordinate.y);
        }
    });
    document.addEventListener('mouseup', () => drawingDOM.mouseOrTouchIsDown = false);

    drawingDOM.onTouchEnd(() => {
        if (start.dottable) {
            drawLine({ startX: start.x, startY: start.y, paper });
        }
        drawingDOM.mouseOrTouchIsDown = false;
    });
    drawingDOM.onTouchCancel(() => drawingDOM.mouseOrTouchIsDown = false);

    drawingDOM.onMouseDown(xy => {
        start = xy;
        start.dottable = true;
    });

    drawingDOM.onMouseUp(() => {
        if (start.dottable) {
            drawLine({ startX: start.x, startY: start.y, paper });
        }
    });

    drawingDOM.onTouchStart(xy => {
        start = xy;
        start.dottable = true;
    });

    drawingDOM.onTouchMove((x, y) => {
        start.dottable = false;
        drag(x, y);
    });

    window.addEventListener('resize', () => drawingDOM.resized());
    window.addEventListener('scroll', () => drawingDOM.scrolled());

    function drag(x: number, y: number) {
        if (drawingDOM.mouseOrTouchIsDown) {
            if (start.x === x && start.y === y) {
                return;
            }
            drawLine({
                startX: start.x,
                startY: start.y,
                endX: x,
                endY: y,
                paper,
            });
            start.x = x;
            start.y = y;
        }
    }
}
