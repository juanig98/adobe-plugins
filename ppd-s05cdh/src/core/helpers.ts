import { global } from "./global";

export const pointsToInches = (pt: string | number): number => parseInt(pt.toString()) / 72;

export const pointsToPixels = (pt: string | number): number => parseInt(pt.toString()) * (4 / 3);

export const inchesToPoints = (inc: string | number): number => parseInt(inc.toString()) * 72;

export const inchesToPixels = (inc: string | number): number => parseInt(inc.toString()) * 96;

export const prepareNumberToCsv = (val: string | number): number => Number(Number(val).toFixed(global.decimals))

export const prepareTextToCsv = (text: string | number): string => {
    return text.toString()
        .replace(/(\r\n|\n|\r)/gm, "")
}

function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export const rgb2hex = (RGB: [number, number, number]) => {
    return "#" + componentToHex(RGB[0]) + componentToHex(RGB[1]) + componentToHex(RGB[2]);
}

export const rgb2cmyk = (r: number, g: number, b: number) => {
    var computedC = 0;
    var computedM = 0;
    var computedY = 0;
    var computedK = 0;

    //remove spaces from input RGB values, convert to int
    var r = parseInt(('' + r).replace(/\s/g, ''), 10);
    var g = parseInt(('' + g).replace(/\s/g, ''), 10);
    var b = parseInt(('' + b).replace(/\s/g, ''), 10);

    if (r == null || g == null || b == null ||
        isNaN(r) || isNaN(g) || isNaN(b)) {
        alert('Please enter numeric RGB values!');
        return;
    }
    if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
        alert('RGB values must be in the range 0 to 255.');
        return;
    }

    // BLACK
    if (r == 0 && g == 0 && b == 0) {
        computedK = 1;
        return [0, 0, 0, 1];
    }

    computedC = 1 - (r / 255);
    computedM = 1 - (g / 255);
    computedY = 1 - (b / 255);

    var minCMY = Math.min(computedC,
        Math.min(computedM, computedY));
    computedC = (computedC - minCMY) / (1 - minCMY);
    computedM = (computedM - minCMY) / (1 - minCMY);
    computedY = (computedY - minCMY) / (1 - minCMY);
    computedK = minCMY;

    return [computedC, computedM, computedY, computedK];
}

export const cmyk2rgb = (CMYK: [number, number, number, number]): [number, number, number] => {
    var c = (CMYK[0] / 100);
    var m = (CMYK[1] / 100);
    var y = (CMYK[2] / 100);
    var k = (CMYK[3] / 100);

    c = c * (1 - k) + k;
    m = m * (1 - k) + k;
    y = y * (1 - k) + k;

    var r = 1 - c;
    var g = 1 - m;
    var b = 1 - y;

    r = Math.round(255 * r);
    g = Math.round(255 * g);
    b = Math.round(255 * b);

    return [r, g, b];
}

export const areAllEqual = (
    a: string | number,
    b: string | number,
    c: string | number,
    d: string | number
): boolean => {
    const _a = a.toString();
    const _b = b.toString();
    const _c = c.toString();
    const _d = d.toString();
    return _a === _b && _a === _c && _a === _d;
}

export const sleep = async (seconds: number) => new Promise((resolve) => { setTimeout(resolve, seconds * 1000); });


