import { AssignmentProblem } from './assignment_problem';

describe('AssignmentProblem', () => {

    it('2x2 simple', () => {
        const weights = [
            [10, 1],
            [1, 10]
        ];
        const ap = new AssignmentProblem(weights);
        expect(ap.sol(0)).toBe(1);
        expect(ap.sol(1)).toBe(0);
        expect(ap.weight()).toBe(2);
    });

    it('3x3', () => {
        const weights = [
            [10, 1, 1],
            [1, 10, 1],
            [1, 1, 10]
        ];
        const ap = new AssignmentProblem(weights);
        expect(ap.weight()).toBe(3);
    });
});
