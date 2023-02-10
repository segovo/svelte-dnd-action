import {calcInnerDistancesBetweenPointAndSidesOfElement} from "./intersection";
const SCROLL_ZONE_PX = 100;
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
    function calcScrollStepPx(distancePx) {
        return SCROLL_ZONE_PX - distancePx;
    }

    /**
     * If the pointer is next to the sides of the element to scroll, will trigger scrolling
     * Can be called repeatedly with updated pointer and elementToScroll values without issues
     * @return {boolean} - true if scrolling was needed
     */
    function scrollIfNeeded(pointer, elementToScroll) {
        if (!elementToScroll) {
            return false;
        }
        const distances = calcInnerDistancesBetweenPointAndSidesOfElement(pointer, elementToScroll);
        if (distances === null) {
            resetScrolling();
            return false;
        }
        const isAlreadyScrolling = !!scrollingInfo.directionObj;
        let [scrollingVertically, scrollingHorizontally] = [false, false];

        let top = pointer.y;
        let bottom = window.innerHeight - pointer.y;
        // vertical
        if (elementToScroll.scrollHeight > elementToScroll.clientHeight) {
            if (bottom < SCROLL_ZONE_PX) {
                scrollingVertically = true;
                scrollingInfo.directionObj = {x: 0, y: 1};
                scrollingInfo.stepPx = calcScrollStepPx(bottom) / 16;
            } else if (top < SCROLL_ZONE_PX) {
                scrollingVertically = true;
                scrollingInfo.directionObj = {x: 0, y: -1};
                scrollingInfo.stepPx = calcScrollStepPx(top) / 16;
            }
            if (scrollingVertically) {
                if (!isAlreadyScrolling) {
                    scrollContainer(elementToScroll);
                }
                return true;
            }
        }
        // horizontal
        if (elementToScroll.scrollWidth > elementToScroll.clientWidth) {
            if (distances.right < SCROLL_ZONE_PX) {
                scrollingHorizontally = true;
                scrollingInfo.directionObj = {x: 1, y: 0};
                scrollingInfo.stepPx = calcScrollStepPx(distances.right);
            } else if (distances.left < SCROLL_ZONE_PX) {
                scrollingHorizontally = true;
                scrollingInfo.directionObj = {x: -1, y: 0};
                scrollingInfo.stepPx = calcScrollStepPx(distances.left);
            }
            if (scrollingHorizontally) {
                if (!isAlreadyScrolling) {
                    scrollContainer(elementToScroll);
                }
                return true;
            }
        }
        resetScrolling();
        return false;
    }

    return {
        scrollIfNeeded,
        resetScrolling
    };
}
