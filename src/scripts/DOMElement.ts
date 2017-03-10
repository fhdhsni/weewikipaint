export class DOMElement implements DOMElementI {
    public mouseOrTouchIsDown: Boolean;
    private originalElement: HTMLElement;
    private drawingAreaPosition: ClientRect;
    private drawingAreaCSS: CSSStyleDeclaration;
    private padding: number;
    private border: number;
    private timer: any;

    constructor(element: HTMLElement) {
        this.originalElement = element;
        this.drawingAreaPosition = element.getBoundingClientRect();
        this.drawingAreaCSS = window.getComputedStyle(element);
        this.padding = parseInt(this.drawingAreaCSS.paddingLeft, 10);
        this.border = parseInt(this.drawingAreaCSS.borderLeftWidth, 10);
        this.mouseOrTouchIsDown = false;
    }

    public relativeOffset(absuloteX: number, absoluteY: number): Coordinate {
        return {
            x: absuloteX - this.drawingAreaPosition.left - this.padding - this.border,
            y: absoluteY - this.drawingAreaPosition.top - this.padding - this.border,
        };
    }

    public onTouchStart = function (cb: (xy: Coordinate) => void) {
        this.originalElement.addEventListener('touchstart', (event: TouchEvent) => {
            this.mouseOrTouchIsDown = true;
            event.preventDefault(); // to prevent scroll
            cb(this.relativeOffset(event.touches[0].clientX, event.touches[0].clientY));
        });
    };

    public onTouchMove(cb: (x: number, y: number) => void) {
        this.originalElement.addEventListener('touchmove', (event) => {
            if (event.touches.length === 1) {   // only when there's one finger on screen
                let { x, y } = this.relativeOffset(event.touches[0].clientX, event.touches[0].clientY);

                cb(x, y);
            }
        });
    }

    public onTouchEnd(cb: () => void) {
        this.originalElement.addEventListener('touchend', cb);
    }

    public onTouchCancel = function (cb: () => void) {
        this.originalElement.addEventListener('touchcancel', cb);
    };

    public onMouseDown(cb: (xy: Coordinate) => void) {
        this.originalElement.addEventListener('mousedown', (event) => {
            this.mouseOrTouchIsDown = true;
            event.preventDefault();
            cb(this.relativeOffset(event.clientX, event.clientY));
        });
    }

    // TODO: havn't been tested
    public calculateBoundingBox() {
        this.drawingAreaPosition = this.originalElement.getBoundingClientRect();
    }
    // TODO: havn't been tested
    public resized() {
        this.calculateBoundingBoxWithDelay();
    }
    // TODO: havn't been tested
    public scrolled() {
        this.calculateBoundingBoxWithDelay();
    }

    // TODO: havn't been tested
    private calculateBoundingBoxWithDelay() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.calculateBoundingBox();
        }, 100);
    }
}
