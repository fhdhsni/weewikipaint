/**
 * draws lines on drawingArea when user clicks or touches and drags
 */
export function userInteraction(paper: RaphaelPaper, drawingDOM: DOMElementI, drawLine: DrawLine) {
    let start: Coordinate = undefined;

    document.body.addEventListener('mousemove', (event) => {
        if (drawingDOM.mouseOrTouchIsDown) {
            const coordinate = drawingDOM.relativeOffset(event.clientX, event.clientY);

            handleDrang(coordinate.x, coordinate.y);
        }
    });
    document.addEventListener('mouseup', () => drawingDOM.mouseOrTouchIsDown = false);

    drawingDOM.onTouchEnd(stopDrawing);
    drawingDOM.onTouchCancel(stopDrawing);

    drawingDOM.onMouseDown(xy => start = xy);
    drawingDOM.onTouchStart(xy => start = xy);

    drawingDOM.onTouchMove(handleDrang);

    document.addEventListener('resize', () => drawingDOM.resized());
    document.addEventListener('scroll', () => drawingDOM.scrolled());

    function handleDrang(x: number, y: number) {
        if (drawingDOM.mouseOrTouchIsDown) {
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

    function stopDrawing() {
        drawingDOM.mouseOrTouchIsDown = false;
    }
}
