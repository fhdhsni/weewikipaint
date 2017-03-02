/**
 * draws lines on drawingArea when user clicks or touches and drags
 */
export function userInteraction(paper: RaphaelPaper, drawingDOM: DOMElementI, drawLine: DrawLine) {
    let start: Coordinate = undefined;

    drawingDOM.onMouseUp(stopDrawing);
    drawingDOM.onMouseLeave(stopDrawing);
    drawingDOM.onTouchEnd(stopDrawing);
    drawingDOM.onTouchCancel(stopDrawing);

    drawingDOM.onMouseDown(xy => start = xy);
    drawingDOM.onTouchStart(xy => start = xy);

    drawingDOM.onMouseMove(handleDrang);
    drawingDOM.onTouchMove(handleDrang);

    window.addEventListener('resize', () => drawingDOM.resized());
    window.addEventListener('scroll', () => drawingDOM.scrolled());

    function handleDrang(x: number, y: number) {
        if (start !== undefined) {
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
        start = undefined;
    }
}
