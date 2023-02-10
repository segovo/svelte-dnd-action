const easeP1 = {
    x: 0,
    y: 1
};
const easeP2 = {
    x: 0,
    y: 1
};

function cubicBezier(t, p1, p2) {
    const p0 = {
        x: 0,
        y: 0
    };

    const p3 = {
        x: 1,
        y: 1
    };

    const x = (1 - t) ** 3 * p0.x + (1 - t) ** 2 * t * 3 * p1.x + (1 - t) * t ** 2 * 3 * p2.x + t ** 3 * p3.x;
    const y = (1 - t) ** 3 * p0.y + (1 - t) ** 2 * t * 3 * p1.y + (1 - t) * t ** 2 * 3 * p2.y + t ** 3 * p3.y;

    return {x, y};
}

export function ease(t) {
    return cubicBezier(t, easeP1, easeP2).y;
}
