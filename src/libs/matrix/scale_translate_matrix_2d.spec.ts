import { ScaleTranslateMatrix2d } from "./scale_translate_matrix_2d";

describe('scale translate matrix', () => {
    it('should scale', () => {
        const rectFrom = {x: 0.5, y: 0.5, width: 1, height: 1};
        const rectTo = {x: 1, y: 1, width: 2, height: 2};
        const m = ScaleTranslateMatrix2d.fromRects(rectFrom, rectTo);

        expect(m.transform({x: 5, y: 5})).toEqual({x: 10, y: 10});
        expect(m.transform({x: -5, y: -5})).toEqual({x: -10, y: -10});
    });

    it('should transform', () => {
        const rectFrom = {x: 1, y: 1, width: 1, height: 1};
        const rectTo = {x: 2, y: 2, width: 1, height: 1};
        const m = ScaleTranslateMatrix2d.fromRects(rectFrom, rectTo);

        expect(m.transform({x: 5, y: 5})).toEqual({x: 6, y: 6});
    });

    it('should scale and transform', () => {
        const rectFrom = {x: 1, y: 1, width: 1, height: 1};
        const rectTo = {x: 3, y: 1, width: 2, height: 2};
        const m = ScaleTranslateMatrix2d.fromRects(rectFrom, rectTo);

        expect(m.transform({x: 1, y: 1})).toEqual({x: 3, y: 1});
        expect(m.transform({x: 2, y: 1})).toEqual({x: 5, y: 1});
        expect(m.transform({x: 1, y: 2})).toEqual({x: 3, y: 3});
        expect(m.transform({x: 2, y: 2})).toEqual({x: 5, y: 3});
    });
});
