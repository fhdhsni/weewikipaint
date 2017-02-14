export function userInteraction(
    paper: RaphaelPaper, drawingArea: HTMLDivElement, drawLine: (arg: DrawLineArgumentObject) => void) {
    const pos = drawingArea.getBoundingClientRect();
    let startX: number;
    let startY: number;
    let shouldWeDraw = false;

    function mouseDownHandler(mouseDownEvent: MouseEvent) {
        shouldWeDraw = true;
        mouseDownEvent.preventDefault();
        startX = mouseDownEvent.clientX - pos.left;
        startY = mouseDownEvent.clientY - pos.top;
    }

    document.addEventListener('mouseup', () => shouldWeDraw = false);
    drawingArea.addEventListener('mousedown', mouseDownHandler);
    drawingArea.addEventListener('mouseleave', () => shouldWeDraw = false);
    drawingArea.addEventListener('mousemove', mouseMoveEvent => {
        if (shouldWeDraw) {
            const endX = mouseMoveEvent.clientX - pos.left;
            const endY = mouseMoveEvent.clientY - pos.top;

            drawLine({
                startX,
                startY,
                endX,
                endY,
                paper,
            });
            startX = endX;
            startY = endY;
        }
    });
}
