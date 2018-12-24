export interface IHashable {
    hash(): string;
}

/** Contains max one item per hash, to save memory */
export class UniqueHashSet<T extends IHashable> {
    private map: Map<string, T> = new Map();

    public add(thing: T) {
        if (this.contains(thing)) {
            throw new Error('already in set: ' + thing);
        }
        this.map.set(thing.hash(), thing);
    }

    public size(): number {
        return this.map.size;
    }

    public remove(thing: T) {
        this.map.delete(thing.hash());
    }

    public contains(thing: T): boolean {
        return this.map.has(thing.hash());
    }

    public containsHash(hash: string): boolean {
        return this.map.has(hash);
    }

    public getItemByHash(hash: string): T {
        if (!this.map.has(hash)) {
            throw new Error('set does not contain hash ' + hash);
        }
        return this.map.get(hash)!;
    }

    // todo: this should return an iterable
    public items(): T[] {
        return Array.from(this.map.values());
    }
}
