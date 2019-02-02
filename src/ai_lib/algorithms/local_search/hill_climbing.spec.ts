import { HillClimbingSolver } from "./hill_climbing";
import * as tmoq from 'typemoq';
import { ILocalSearchProblem } from './local_search_problem';

class StateMock {
    constructor(public id: number) {}
}

describe('hill climbing', () => {
    it('should pick the best neighbour', () => {
        // setup
        const problem = tmoq.Mock.ofType<ILocalSearchProblem<StateMock>>();
        const initial_state = new StateMock(0);
        const neighbours = [
            new StateMock(1),
            new StateMock(2)
        ];
        problem.setup(p => p.getAllNeighbours(tmoq.It.isAny())).returns(() => neighbours);
        problem.setup(p => p.score(initial_state)).returns(() => 0);
        problem.setup(p => p.score(neighbours[0])).returns(() => 1);
        problem.setup(p => p.score(neighbours[1])).returns(() => 2);

        // act
        const hillClimber = new HillClimbingSolver(problem.object, initial_state);
        hillClimber.step();

        // assert
        const nextState = hillClimber.getCurrentState();
        expect(nextState.id).toBe(2);
    });
});
