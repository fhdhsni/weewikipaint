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

    drawingArea.addEventListener('mouseup', () => stopDrawing());
    drawingArea.addEventListener('touchend', () => stopDrawing());

    drawingArea.addEventListener('mouseleave', () => stopDrawing());
    drawingArea.addEventListener('touchcancel', () => stopDrawing());

    drawingArea.addEventListener('mousedown', event => {
        event.preventDefault(); // to prevent text selection
        start = relativeOffset(event.clientX, event.clientY);
    });
    drawingArea.addEventListener('touchstart', event => {
        event.preventDefault(); // to prevent scroll
        start = relativeOffset(event.touches[0].clientX, event.touches[0].clientY);
    });

    drawingArea.addEventListener('mousemove', event => {
        if (start !== undefined) {
            handleDrang(event.clientX, event.clientY);
        }
    });
    drawingArea.addEventListener('touchmove', event => {
        if (start !== undefined && event.touches.length === 1) { // only when there's one finger on screen
            handleDrang(event.touches[0].clientX, event.touches[0].clientY);
        }
    });

    let timer: any;
    const calculateBoundingBox = () => {
        // we are doing this to only run getBoundingClientRect for once when resizing finished
        clearTimeout(timer);
        timer = setTimeout(() => {
            drawingAreaPosition = drawingArea.getBoundingClientRect();
        }, 100);
    };

    window.addEventListener('resize', calculateBoundingBox);
    window.addEventListener('scroll', calculateBoundingBox);

    function relativeOffset(absuloteX: number, absoluteY: number) {

        return {
            x: absuloteX - drawingAreaPosition.left - padding - border,
            y: absoluteY - drawingAreaPosition.top - padding - border,
        };
    }
    function handleDrang(x: number, y: number) {
        const end = relativeOffset(x, y);

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
