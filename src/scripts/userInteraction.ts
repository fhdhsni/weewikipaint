/**
 * draws lines on drawingArea when user clicks and drags
 */
export function userInteraction(
    paper: RaphaelPaper,
    drawingArea: HTMLElement,
    drawLine: (arg: DrawLineArgumentObject) => void) {

    let drawingAreaPosition = drawingArea.getBoundingClientRect();
    let startX: number;
    let startY: number;
    let shouldWeDraw = false;
    const drawingAreaCSS = window.getComputedStyle(drawingArea);
    const padding = parseInt(drawingAreaCSS.paddingLeft, 10);
    const border = parseInt(drawingAreaCSS.borderLeftWidth, 10);
    let timer: any;

    window.addEventListener('resize', () => {
        // we are doing this to only run getBoundingClientRect for once when resizing finished
        clearTimeout(timer);
        timer = setTimeout(() => {
            drawingAreaPosition = drawingArea.getBoundingClientRect();
        }, 100);
    });
    document.addEventListener('mouseup', () => shouldWeDraw = false);
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
}
