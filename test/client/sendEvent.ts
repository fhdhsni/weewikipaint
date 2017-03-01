export function sendTouchEvent(element: HTMLDocument | HTMLDivElement, eventType: string, coordinates: Coordinate[]) {
    const newTouchEvent: TouchEventConstructor = TouchEvent;
    let touchList: Touch[] = [];

    coordinates.forEach(coordinate => {
        let relativeX: number;
        let relativeY: number;

        if (element instanceof HTMLDivElement) {
            relativeX = findRelativePosition(coordinate.x, element, 'x');
            relativeY = findRelativePosition(coordinate.y, element, 'y');
        } else {
            relativeX = coordinate.x;
            relativeY = coordinate.y;
        }

        touchList.push(createTouchObject(relativeX, relativeY, element));
    });

    const touchEvent = new newTouchEvent(eventType, {
        cancelable: true,
        bubbles: true,
        touches: touchList,
        targetTouches: [],
        changedTouches: touchList,
        shiftKey: true,
    });

    element.dispatchEvent(touchEvent);
}

function createTouchObject(x: number, y: number, element: HTMLDivElement | HTMLDocument): Touch {
    const NewTouch: TouchConstructor = Touch;

    return new NewTouch({
        identifier: Date.now(),
        target: element,
        clientX: x,
        clientY: y,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5,
    });
}

export function sendMouseEvent(x: number, y: number, element: HTMLDocument | HTMLDivElement, eventType: string) {
    let relativeX: number;
    let relativeY: number;
    if (element instanceof HTMLDivElement) {
        relativeX = findRelativePosition(x, element, 'x');
        relativeY = findRelativePosition(y, element, 'y');
    } else {
        relativeX = x;
        relativeY = y;
    }
    const event = document.createEvent('MouseEvent');

    event.initMouseEvent(
        eventType,
        true /* bubble */,
        true /* cancelable */,
        window, null,
        null,
        null,
        relativeX,
        relativeY, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left click*/,
        null,
    );

    element.dispatchEvent(event);
}

export function findRelativePosition(position: number, el: HTMLElement, whatKind: 'x' | 'y'): number {
    let offset: number;
    const borderWidth = window.getComputedStyle(el).borderLeftWidth;
    const paddingWidth = window.getComputedStyle(el).paddingLeft;

    if (whatKind === 'x') {
        offset = el.offsetLeft;
    } else {
        offset = el.offsetTop;
    }

    return position + parseInt(borderWidth, 10) + parseInt(paddingWidth, 10) + offset;
}

export function supportTouchEvent() {
    if (typeof Touch !== 'undefined' &&
        typeof TouchEvent !== 'undefined' &&
        Touch.length === 1 &&
        TouchEvent.length === 1) {

        return true;
    }

    return false;
}
