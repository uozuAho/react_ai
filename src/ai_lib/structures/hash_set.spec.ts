import { IHashable, UniqueHashSet } from './hash_set';

class TestHashable<T> implements IHashable {
    private thing: T;

    constructor(thing: T) {
        this.thing = thing;
    }

    public hash(): string {
        return '' + this.thing;
    }
}

describe('UniqueHashSet', () => {
    let set = new UniqueHashSet();

    beforeEach(() => {
        set = new UniqueHashSet();
    });

    it('should contain 1 but not 2', () => {
        set.add(new TestHashable<number>(1));
        expect(set.contains(new TestHashable<number>(1))).toBe(true);
        expect(set.contains(new TestHashable<number>(2))).toBe(false);
    });

    it('should throw when attempting to add an existing hash', () => {
        set.add(new TestHashable<number>(1));
        expect(() => {set.add(new TestHashable<number>(1)); }).toThrowError();
    });

    it('should remove 1 but not 2', () => {
        set.add(new TestHashable<number>(1));
        set.add(new TestHashable<number>(2));
        set.remove(new TestHashable<number>(1));
        expect(set.contains(new TestHashable<number>(1))).toBe(false);
        expect(set.contains(new TestHashable<number>(2))).toBe(true);
    });

    it('should have correct size', () => {
        expect(set.size()).toBe(0);
        set.add(new TestHashable<number>(1));
        expect(set.size()).toBe(1);
    });

    it('should return all values', () => {
        const hashable1 = new TestHashable(1);
        const hashable2 = new TestHashable(2);

        set.add(hashable1);
        expect(set.items()).toEqual([hashable1]);
        set.add(hashable2);
        expect(set.items()).toEqual([hashable1, hashable2]);
    });
});
