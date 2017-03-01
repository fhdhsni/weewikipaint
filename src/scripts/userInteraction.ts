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

    drawingDOM.onMouseMove(event => {
        if (start !== undefined) {
            handleDrang(event.clientX, event.clientY);
        }
    });

    drawingDOM.onTouchMove(event => {
        if (start !== undefined && event.touches.length === 1) { // only when there's one finger on screen
            handleDrang(event.touches[0].clientX, event.touches[0].clientY);
        }
    });

    window.addEventListener('resize', () => drawingDOM.resized());
    window.addEventListener('scroll', () => drawingDOM.scrolled());

    function handleDrang(x: number, y: number) {
        const end = drawingDOM.relativeOffset(x, y);

        drawLine({
            startX: start.x,
            startY: start.y,
            endX: end.x,
            endY: end.y,
            paper,
        });
        start.x = end.x;
        start.y = end.y;
    }

    function stopDrawing() {
        start = undefined;
    }
}
