// mathjs is too big, cbf writing a full-fledged affine matrix doover

export interface IPoint2d {
    x: number;
    y: number;
}

export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class ScaleTranslateMatrix2d {

    private constructor(private m: number[][]) { }

    /** initialise 3x3 matrix with array values */
    public static fromArray(arr: number[][]): ScaleTranslateMatrix2d {
        return new ScaleTranslateMatrix2d(arr);
    }

    public static fromRects(rectFrom: IRect, rectTo: IRect): ScaleTranslateMatrix2d {
        const xscale = rectTo.width / rectFrom.width;
        const yscale = rectTo.height / rectFrom.height;
        const xtrans = rectTo.x - xscale * rectFrom.x;
        const ytrans = rectTo.y - yscale * rectFrom.y;
        return new ScaleTranslateMatrix2d([
            [xscale,      0, xtrans],
            [     0, yscale, ytrans],
            [     0,      0,      1]
        ]);
    }

    public transform(point: IPoint2d): IPoint2d {
        const m = this.m;
        return {
            x: m[0][0] * point.x + m[0][2],
            y: m[1][1] * point.y + m[1][2]
        };
    }
}
