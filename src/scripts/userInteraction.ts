export function userInteraction(
    paper: RaphaelPaper, drawingArea: HTMLElement, drawLine: (arg: DrawLineArgumentObject) => void) {
    const pos = drawingArea.getBoundingClientRect();
    let startX: number;
    let startY: number;
    let shouldWeDraw = false;
    const padding = parseInt(window.getComputedStyle(drawingArea).getPropertyValue('padding'), 10);
    const border = parseInt(window.getComputedStyle(drawingArea).getPropertyValue('border-width'), 10);

    function mouseDownHandler(mouseDownEvent: MouseEvent) {
        shouldWeDraw = true;
        mouseDownEvent.preventDefault();
        startX = mouseDownEvent.clientX - pos.left - padding - border;
        startY = mouseDownEvent.clientY - pos.top - padding - border;
    }

    document.addEventListener('mouseup', () => shouldWeDraw = false);
    drawingArea.addEventListener('mouseleave', () => shouldWeDraw = false);
    drawingArea.addEventListener('mousedown', mouseDownHandler);
    drawingArea.addEventListener('mousemove', mouseMoveEvent => {
        if (shouldWeDraw) {
            const endX = mouseMoveEvent.clientX - pos.left - padding - border;
            const endY = mouseMoveEvent.clientY - pos.top - padding - border;

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
