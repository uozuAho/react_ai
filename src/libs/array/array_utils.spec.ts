import { ArrayUtils } from "./array_utils";

describe('array utils', () => {
    it('should shuffle', () => {
        const array = [1, 2, 3, 4];
        ArrayUtils.shuffle(array);

        expect(array.length).toBe(4);
        expect(array).toContain(1);
        expect(array).toContain(2);
        expect(array).toContain(3);
        expect(array).toContain(4);
    });
});
