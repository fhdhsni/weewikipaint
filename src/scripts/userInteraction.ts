/**
 * draws lines on drawingArea when user clicks drag
 */
export function userInteraction(
    paper: RaphaelPaper, drawingArea: HTMLElement, drawLine: (arg: DrawLineArgumentObject) => void) {
    let drawingAreaPosition = drawingArea.getBoundingClientRect();
    let startX: number;
    let startY: number;
    let shouldWeDraw = false;
    const padding = parseInt(window.getComputedStyle(drawingArea).getPropertyValue('padding'), 10);
    const border = parseInt(window.getComputedStyle(drawingArea).getPropertyValue('border-width'), 10);

    document.addEventListener('mouseup', () => shouldWeDraw = false);
    window.addEventListener('resize', () => {
        drawingAreaPosition = drawingArea.getBoundingClientRect();
    });

    drawingArea.addEventListener('mouseleave', () => shouldWeDraw = false);
    drawingArea.addEventListener('mousedown', mouseDownHandler);
    drawingArea.addEventListener('mousemove', mouseMoveEvent => {
        if (shouldWeDraw) {
            const endX = mouseMoveEvent.clientX - drawingAreaPosition.left - padding - border;
            const endY = mouseMoveEvent.clientY - drawingAreaPosition.top - padding - border;

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

    function mouseDownHandler(mouseDownEvent: MouseEvent) {
        shouldWeDraw = true;
        mouseDownEvent.preventDefault();
        startX = mouseDownEvent.clientX - drawingAreaPosition.left - padding - border;
        startY = mouseDownEvent.clientY - drawingAreaPosition.top - padding - border;
    }

    document.addEventListener('mouseup', () => shouldWeDraw = false);
}
