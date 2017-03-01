interface DrawLineArgumentObject {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    paper: RaphaelPaper;
}

interface OffsetObject {
    top: string;
    left: string;
    borderWidth: string;
    paddingWidth: string;
    width: string;
    height: string;
}

interface Coordinate {
    x: number;
    y: number;
}

interface TouchConstructor {
    prototype: Touch;
    new (arg: any): Touch;
}

interface TouchEventConstructor {
    prototype: TouchEvent;
    new (...arg: any[]): TouchEvent;
}

interface DrawLine {
    (arg: DrawLineArgumentObject): void;
}

interface DOMElementI {
    onMouseDown(cb: (event: MouseEvent) => void): void;
    onMouseUp(cb: (event: MouseEvent) => void): void;
    onMouseMove(cb: (event: MouseEvent) => void): void;
    onMouseLeave(cb: (event: MouseEvent) => void): void;

    onTouchStart(cb: (event: TouchEvent) => void): void;
    onTouchMove(cb: (event: TouchEvent) => void): void;
    onTouchEnd(cb: (event: TouchEvent) => void): void;
    onTouchCancel(cb: (event: TouchEvent) => void): void;

    calculateBoundingBox(): void;
    relativeOffset(absuloteX: number, absoluteY: number): Coordinate;
    resized(): void;
    scrolled(): void;
}

// interface DOMElement: {
//     prototype: DomElementPrototype;
//     new (arg: HTMLElement): DomElementPrototype;
// };
