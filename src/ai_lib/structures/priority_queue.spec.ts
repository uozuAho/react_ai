import { PriorityQueue } from './priority_queue';

describe('PriorityQueue', () => {
    let numberQueue: PriorityQueue<number>;

    beforeEach(() => {
        numberQueue = new PriorityQueue();
    });

    it('pop empty should throw', () => {
        expect(() => numberQueue.pop()).toThrow();
    });

    it('pop in correct order', () => {
        numberQueue.push(1);
        numberQueue.push(5);
        numberQueue.push(2);
        numberQueue.push(4);
        numberQueue.push(3);
        expect(numberQueue.pop()).toBe(1);
        expect(numberQueue.pop()).toBe(2);
        expect(numberQueue.pop()).toBe(3);
        expect(numberQueue.pop()).toBe(4);
        expect(numberQueue.pop()).toBe(5);
    });

    it('object queue', () => {
        const objQueue = new PriorityQueue<TestObj>([], (a, b) => TestObj.compare(a, b));
        objQueue.push(new TestObj(5, '5'));
        objQueue.push(new TestObj(1, '1'));
        objQueue.push(new TestObj(3, '3'));
        expect(objQueue.pop().myNumber).toBe(1);
        expect(objQueue.pop().myNumber).toBe(3);
        expect(objQueue.pop().myNumber).toBe(5);
    });
});

class TestObj {
    public myNumber: number;
    public myData: string;
    constructor(num: number, dat: string) {
        this.myNumber = num;
        this.myData = dat;
    }

    public static compare(a: TestObj, b: TestObj) {
        return a.myNumber < b.myNumber ? -1 : a.myNumber > b.myNumber ? 1 : 0;
    }
}
