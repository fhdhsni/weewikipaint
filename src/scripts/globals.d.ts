interface DrawLineArgumentObject {
    startX: number;
    startY: number;
    endX?: number;
    endY?: number;
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
    dottable?: boolean;
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
    mouseOrTouchIsDown: Boolean;
    drawingAreaPosition: ClientRect;
    onMouseDown(cb: (xy: Coordinate) => void): void;
    onMouseUp(cb: (xy: Coordinate) => void): void;
    onTouchStart(cb: (xy: Coordinate) => void): void;
    onTouchMove(cb: (x: number, y: number) => void): void;
    onTouchEnd(cb: (event: TouchEvent) => void): void;
    onTouchCancel(cb: (event: TouchEvent) => void): void;

    calculateBoundingBox(): void;
    relativeOffset(absuloteX: number, absoluteY: number): Coordinate;
    resized(): void;
    scrolled(): void;
}
