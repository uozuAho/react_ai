import { ISearchProblem } from './search_problem';
import { IHashable } from '../../structures/hash_set';
import { BreadthFirstSearch } from './breadth_first_search';
import * as tmoq from 'typemoq';

class StateMock implements IHashable {
    public data: string;
    constructor(data: string) { this.data = data; }
    public hash() {return this.data};
}

class ActionMock {}

describe('BreadthFirstSearch', () => {
    const initial_state = new StateMock("initial state");
    let problem = tmoq.Mock.ofType<ISearchProblem<StateMock, ActionMock>>();
    let bfs : BreadthFirstSearch<StateMock, ActionMock>;

    const initialiseOneStateProblem = () => {
        problem = tmoq.Mock.ofType<ISearchProblem<StateMock, ActionMock>>();
        problem.setup(p => p.initial_state).returns(() => initial_state);
        problem.setup(p => p.getActions(tmoq.It.isAny())).returns(() => []);
        problem.setup(p => p.isGoal(tmoq.It.isAny())).returns(() => false);
        bfs = new BreadthFirstSearch(problem.object);
    }

    it('initial state', () => {
        initialiseOneStateProblem();
        expect(bfs.getExplored()).toEqual([]);
        expect(bfs.isFinished).toBe(false);
        expect(bfs.getFrontier().length).toBe(1);
        expect(bfs.getFrontier()[0].data).toBe("initial state");
    });

    it('solve one state problem should finish', () => {
        initialiseOneStateProblem();
        bfs.solve();
        expect(bfs.isFinished).toBe(true);
    });

    it('first step', () => {
        const action1 = new ActionMock();
        const action2 = new ActionMock();
        const state1 = new StateMock("state 1");
        const state2 = new StateMock("state 2");
        problem = tmoq.Mock.ofType<ISearchProblem<StateMock, ActionMock>>();
        problem.setup(p => p.initial_state).returns(() => initial_state);
        problem.setup(p => p.getActions(initial_state)).returns(() => [action1, action2]);
        problem.setup(p => p.doAction(initial_state, action1)).returns(() => state1);
        problem.setup(p => p.doAction(initial_state, action2)).returns(() => state2);
        problem.setup(p => p.pathCost(tmoq.It.isAny(), tmoq.It.isAny())).returns(() => 1);
        bfs = new BreadthFirstSearch(problem.object);

        bfs.step();

        expect(bfs.getExplored()).toEqual([initial_state]);
        expect(bfs.getFrontier()).toEqual([state1, state2]);
        expect(bfs.isFinished).toBe(false);
    });

    it('solvable should solve and return correct solution', () => {
        const action1 = new ActionMock();
        const action2 = new ActionMock();
        const state1 = new StateMock("state 1");
        const state2 = new StateMock("state 2");
        problem = tmoq.Mock.ofType<ISearchProblem<StateMock, ActionMock>>();
        problem.setup(p => p.initial_state).returns(() => initial_state);
        problem.setup(p => p.getActions(initial_state)).returns(() => [action1]);
        problem.setup(p => p.doAction(initial_state, action1)).returns(() => state1);
        problem.setup(p => p.getActions(state1)).returns(() => [action2]);
        problem.setup(p => p.doAction(state1, action2)).returns(() => state2);
        problem.setup(p => p.isGoal(state2)).returns(() => true);
        problem.setup(p => p.pathCost(tmoq.It.isAny(), tmoq.It.isAny())).returns(() => 1);
        bfs = new BreadthFirstSearch(problem.object);

        bfs.solve();

        expect(bfs.isFinished).toBe(true);
        expect(bfs.getSolution()).toEqual([action1, action2]);
        expect(bfs.getSolutionTo(state1)).toEqual([action1]);
    });
});