import {calcInnerDistancesBetweenPointAndSidesOfElement} from "./intersection";
import {ease} from "./ease";
let scrollZonePX = window.innerHeight / 4;
export function makeScroller() {
    let scrollingInfo;
    function resetScrolling() {
        scrollingInfo = {directionObj: undefined, stepPx: 0};
    }
    resetScrolling();
    // directionObj {x: 0|1|-1, y:0|1|-1} - 1 means down in y and right in x
    function scrollContainer(containerEl) {
        const {directionObj, stepPx} = scrollingInfo;
        if (directionObj) {
            containerEl.scrollBy(directionObj.x * stepPx, directionObj.y * stepPx);
            window.requestAnimationFrame(() => scrollContainer(containerEl));
        }
    }
    // function calcScrollStepPx(distancePx) {
    //     return scrollZonePX - distancePx;
    // }

    function normalize(value, min, max) {
        return (value - min) / (max - min);
    }
    /**
     * If the pointer is next to the sides of the element to scroll, will trigger scrolling
     * Can be called repeatedly with updated pointer and elementToScroll values without issues
     * @return {boolean} - true if scrolling was needed
     */
    function scrollIfNeeded(pointer, elementToScroll) {
        scrollZonePX = window.innerHeight / 4;

        if (!elementToScroll) {
            return false;
        }
        const distances = calcInnerDistancesBetweenPointAndSidesOfElement(pointer, elementToScroll);
        if (distances === null) {
            resetScrolling();
            return false;
        }
        const isAlreadyScrolling = !!scrollingInfo.directionObj;
        // let [scrollingVertically, scrollingHorizontally] = [false, false];
        let scrollingVertically = false;
        let top = pointer.y;
        let bottom = window.innerHeight - pointer.y;

        // vertical
        if (elementToScroll.scrollHeight > elementToScroll.clientHeight) {
            if (bottom < scrollZonePX) {
                let normalizedScrollStep = normalize(bottom, 0, scrollZonePX);
                console.log("bottom: ", bottom);
                console.log("scrollZonePX: ", scrollZonePX);
                console.log("normalizedScrollStep: ", normalizedScrollStep);
                console.log("ease(normalizedScrollStep): ", ease(normalizedScrollStep));
                scrollingVertically = true;
                scrollingInfo.directionObj = {x: 0, y: 1};
                scrollingInfo.stepPx = ease(normalizedScrollStep) * 10;
            } else if (top < scrollZonePX) {
                let normalizedScrollStep = normalize(top, 0, scrollZonePX);
                console.log("top: ", top);
                console.log("scrollZonePX: ", scrollZonePX);
                console.log("normalizedScrollStep: ", normalizedScrollStep);
                console.log("ease(normalizedScrollStep): ", ease(normalizedScrollStep));
                scrollingVertically = true;
                scrollingInfo.directionObj = {x: 0, y: -1};
                scrollingInfo.stepPx = ease(normalizedScrollStep) * 10;
            }
            if (scrollingVertically) {
                if (!isAlreadyScrolling) {
                    scrollContainer(elementToScroll);
                }
                return true;
            }
        }
        // horizontal
        // if (elementToScroll.scrollWidth > elementToScroll.clientWidth) {
        //     if (distances.right < scrollZonePX) {
        //         scrollingHorizontally = true;
        //         scrollingInfo.directionObj = {x: 1, y: 0};
        //         scrollingInfo.stepPx = calcScrollStepPx(distances.right);
        //     } else if (distances.left < scrollZonePX) {
        //         scrollingHorizontally = true;
        //         scrollingInfo.directionObj = {x: -1, y: 0};
        //         scrollingInfo.stepPx = calcScrollStepPx(distances.left);
        //     }
        //     if (scrollingHorizontally) {
        //         if (!isAlreadyScrolling) {
        //             scrollContainer(elementToScroll);
        //         }
        //         return true;
        //     }
        // }
        resetScrolling();
        return false;
    }

    return {
        scrollIfNeeded,
        resetScrolling
    };
}
