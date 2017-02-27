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
