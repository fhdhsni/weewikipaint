/**
 * draws lines on drawingArea when user clicks and drags
 */
export function userInteraction(
    paper: RaphaelPaper,
    drawingArea: HTMLElement,
    drawLine: (arg: DrawLineArgumentObject) => void) {

    let drawingAreaPosition = drawingArea.getBoundingClientRect();
    const drawingAreaCSS = window.getComputedStyle(drawingArea);
    const padding = parseInt(drawingAreaCSS.paddingLeft, 10);
    const border = parseInt(drawingAreaCSS.borderLeftWidth, 10);
    let start: {
        x: number;
        y: number;
    } = undefined;

    document.addEventListener('mouseup', () => start = undefined);
    drawingArea.addEventListener('mouseleave', () => start = undefined);
    drawingArea.addEventListener('mousedown', (mouseDownEvent) => {
        mouseDownEvent.preventDefault();
        start = relativeOffset(mouseDownEvent.clientX, mouseDownEvent.clientY);
    });
    drawingArea.addEventListener('mousemove', mouseMoveEvent => {
        if (start !== undefined) {
            const end = relativeOffset(mouseMoveEvent.clientX, mouseMoveEvent.clientY);

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
    });

    let timer: any;
    window.addEventListener('resize', () => {
        // we are doing this to only run getBoundingClientRect for once when resizing finished
        clearTimeout(timer);
        timer = setTimeout(() => {
            drawingAreaPosition = drawingArea.getBoundingClientRect();
        }, 100);
    });

    function relativeOffset(absuloteX: number, absoluteY: number) {

        return {
            x: absuloteX - drawingAreaPosition.left - padding - border,
            y: absoluteY - drawingAreaPosition.top - padding - border,
        };
    }
}
