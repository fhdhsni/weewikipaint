let timer: any;

export class DOMElement implements DOMElementI {
    private originalElement: HTMLElement;
    private drawingAreaPosition: ClientRect;
    private drawingAreaCSS: CSSStyleDeclaration;
    private padding: number;
    private border: number;

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

    public onTouchStart = function (cb: () => void) {
        this.originalElement.addEventListener('touchstart', cb);
    };

    public onTouchMove(cb: () => void) {
        this.originalElement.addEventListener('touchmove', cb);
    }

    public onTouchEnd(cb: () => void) {
        this.originalElement.addEventListener('touchend', cb);
    }

    public onTouchCancel = function (cb: () => void) {
        this.originalElement.addEventListener('touchcancel', cb);
    };

    public onMouseDown(cb: () => void) {
        this.originalElement.addEventListener('mousedown', cb);
    }

    public onMouseLeave(cb: () => void) {
        this.originalElement.addEventListener('mouseleave', cb);
    }

    public onMouseMove(cb: () => void) {
        this.originalElement.addEventListener('mousemove', cb);
    }

    public onMouseUp(cb: () => void) {
        this.originalElement.addEventListener('mouseup', cb);
    }

    public calculateBoundingBox() {
        this.drawingAreaPosition = this.originalElement.getBoundingClientRect();
    }

    public resized() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            this.calculateBoundingBox();
        }, 100);
    }

    public scrolled() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            this.calculateBoundingBox();
        }, 100);
    }
}
