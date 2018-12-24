import { BinaryHeap } from './binary_heap';

describe('MinQueue number', () => {

    let h = new BinaryHeap<number>();

    beforeEach(() => {
        h = new BinaryHeap();
    });

    it('should throw on empty peek', () => {
        expect(() => h.peekMin()).toThrow();
    });

    it('should throw on empty removes', () => {
        expect(() => h.removeMin()).toThrow();
        expect(() => h.remove(1)).toThrow();
    });

    it('should have 0 size when empty', () => {
        expect(h.size()).toBe(0);
    });

    it('should return false on empty.contains', () => {
        expect(h.contains(234)).toBe(false);
    });

    it('add and remove single', () => {
        h.add(55);
        expect(h.contains(55)).toBe(true);
        expect(h.peekMin()).toBe(55);
        expect(h.size()).toBe(1);
        expect(h.removeMin()).toBe(55);
        expect(h.size()).toBe(0);
        expect(h.contains(55)).toBe(false);
    });

    it('add and remove sequence', () => {
        h.add(1);
        h.add(2);
        h.add(3);
        expect(h.removeMin()).toBe(1);
        expect(h.removeMin()).toBe(2);
        expect(h.removeMin()).toBe(3);
    });

    it('add and remove reverse sequence', () => {
        h.add(3);
        h.add(2);
        h.add(1);
        expect(h.removeMin()).toBe(1);
        expect(h.removeMin()).toBe(2);
        expect(h.removeMin()).toBe(3);
    });

    it('should throw on removing non-existent item', () => {
        h.add(3);
        expect(() => h.remove(4)).toThrow();
    });

    it('remove', () => {
        h.add(3);
        h.add(2);
        h.add(1);
        h.remove(2);
        expect(h.peekMin()).toBe(1);
        expect(h.size()).toBe(2);
    });
});
