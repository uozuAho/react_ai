import { IterUtils } from "./iter_utils";

describe('iter_utils', () => {
    describe('range', () => {
        it('empty', () => {
            const r = Array.from(IterUtils.range(0));
            expect(r.length).toBe(0);
        })

        it('10', () => {
            const r = Array.from(IterUtils.range(10));
            expect(r.length).toBe(10);
            expect(r[9]).toBe(9);
            expect(r[0]).toBe(0);
        });
    });

    describe('firstOrNull', () => {
        it('should find existing value', () => {
            const arr = Array(4).fill(0);
            const val = IterUtils.firstOrNull(arr, v => v === 0);
            expect(val).toBe(0);
        });

        it('should not find non existing value', () => {
            const arr = Array(4).fill(0);
            const val = IterUtils.firstOrNull(arr, v => v === 1);
            expect(val).toBe(null);
        });

        it('should find first one', () => {
            const arr = [
                [1, 'unique 1'],
                [2, 'first 2'],
                [2, 'second 2'],
                [3, 'unique 3'],
            ];
            const val = IterUtils.firstOrNull(arr, v => v[0] === 2);
            expect(val).not.toBeNull();
            expect(val![1]).toBe('first 2');
        });
    });

    describe('min', () => {
        it('should throw on empty', () => {
            expect(() => IterUtils.min([])).toThrowError();
        });

        it('should find min', () => {
            expect(IterUtils.min([1, 2, 3])).toBe(1);
        });

        it('should find min with negatives', () => {
            expect(IterUtils.min([1, 2, 3, -1, -2, -3])).toBe(-3);
        });

        it('should use passed comparator', () => {
            const arr = [1, 2, 3];
            const reverseCompare = (a: number, b: number) => a < b ? 1 : a > b ? -1 : 0;
            const max = IterUtils.min(arr, reverseCompare);
            expect(max).toBe(3);
        });
    });

    describe('max', () => {
        it('should throw on empty', () => {
            expect(() => IterUtils.max([])).toThrowError();
        });

        it('should find max', () => {
            expect(IterUtils.max([1, 2, 3])).toBe(3);
        });

        it('should find max with negatives', () => {
            expect(IterUtils.max([1, 2, 3, -1, -2, -3])).toBe(3);
        });

        it('should use passed comparator', () => {
            const arr = [1, 2, 3];
            const reverseCompare = (a: number, b: number) => a < b ? 1 : a > b ? -1 : 0;
            const min = IterUtils.max(arr, reverseCompare);
            expect(min).toBe(1);
        });
    });
});
