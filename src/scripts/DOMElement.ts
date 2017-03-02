export class DOMElement implements DOMElementI {
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
    }

    public relativeOffset(absuloteX: number, absoluteY: number): Coordinate {
        return {
            x: absuloteX - this.drawingAreaPosition.left - this.padding - this.border,
            y: absoluteY - this.drawingAreaPosition.top - this.padding - this.border,
        };
    }

    public onTouchStart = function(cb: (xy: Coordinate) => void) {
        this.originalElement.addEventListener('touchstart', (event: TouchEvent) => {
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

    public onTouchCancel = function(cb: () => void) {
        this.originalElement.addEventListener('touchcancel', cb);
    };

    public onMouseDown(cb: (xy: Coordinate) => void) {
        this.originalElement.addEventListener('mousedown', (event) => {
            event.preventDefault();
            cb(this.relativeOffset(event.clientX, event.clientY));
        });
    }

    public onMouseLeave(cb: () => void) {
        this.originalElement.addEventListener('mouseleave', cb);
    }

    public onMouseMove(cb: (x: number, y: number) => void) {
        // this.originalElement.addEventListener('mousemove', cb);
        this.originalElement.addEventListener('mousemove', (event) => {
            let { x, y } = this.relativeOffset(event.clientX, event.clientY);

            cb(x, y);
        });
    }

    public onMouseUp(cb: () => void) {
        this.originalElement.addEventListener('mouseup', cb);
    }

    public calculateBoundingBox() {
        this.drawingAreaPosition = this.originalElement.getBoundingClientRect();
    }

    public resized() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.calculateBoundingBox();
        }, 100);
    }

    public scrolled() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.calculateBoundingBox();
        }, 100);
    }
}
