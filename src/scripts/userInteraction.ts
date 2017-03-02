/**
 * draws lines on drawingArea when user clicks or touches and drags
 */
export function userInteraction(paper: RaphaelPaper, drawingDOM: DOMElementI, drawLine: DrawLine) {
    let start: Coordinate = undefined;

    drawingDOM.onMouseUp(stopDrawing);
    drawingDOM.onTouchEnd(stopDrawing);
    drawingDOM.onMouseLeave(stopDrawing);
    drawingDOM.onTouchCancel(stopDrawing);

    drawingDOM.onMouseDown(event => {
        event.preventDefault(); // to prevent text selection
        start = drawingDOM.relativeOffset(event.clientX, event.clientY);
    });

    drawingDOM.onTouchStart(event => {
        event.preventDefault(); // to prevent scroll
        start = drawingDOM.relativeOffset(event.touches[0].clientX, event.touches[0].clientY);
    });

    drawingDOM.onMouseMove((x, y) => {
        if (start !== undefined) {
            handleDrang(x, y);
        }
    });

    drawingDOM.onTouchMove((x, y) => {
        if (start !== undefined) {
            handleDrang(x, y);
        }
    });

    window.addEventListener('resize', () => drawingDOM.resized());
    window.addEventListener('scroll', () => drawingDOM.scrolled());

    function handleDrang(x: number, y: number) {
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

    function stopDrawing() {
        start = undefined;
    }
}
