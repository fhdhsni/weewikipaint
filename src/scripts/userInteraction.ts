/**
 * draws lines on drawingArea when user clicks or touches and drags
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

    drawingArea.addEventListener('mouseup', () => start = undefined);
    drawingArea.addEventListener('touchend', () => start = undefined);

    drawingArea.addEventListener('mouseleave', () => start = undefined);
    drawingArea.addEventListener('touchleave', () => start = undefined);

    drawingArea.addEventListener('mousedown', event => {
        event.preventDefault(); // to prevent text selection or other wierd behaviors
        start = relativeOffset(event.clientX, event.clientY);
    });
    drawingArea.addEventListener('touchstart', event => {
        event.preventDefault(); // to prevent scroll or other wierd behaviors
        start = relativeOffset(event.touches[0].clientX, event.touches[0].clientY);
    });

    drawingArea.addEventListener('mousemove', event => {
        if (start !== undefined) {
            const end = relativeOffset(event.clientX, event.clientY);

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
    drawingArea.addEventListener('touchmove', event => {
        if (start !== undefined && event.touches.length === 1) { // only when there's one finger on screen
            const end = relativeOffset(event.touches[0].clientX, event.touches[0].clientY);

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
    window.addEventListener('scroll', () => {
        // we are doing this to only run getBoundingClientRect for once when scroll finished
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
