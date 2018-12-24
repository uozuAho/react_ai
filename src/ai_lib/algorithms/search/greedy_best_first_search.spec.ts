import { Point2d } from '../../structures/point2d';
import { GreedyBestFirstSearch } from './greedy_best_first_search';
import { ISearchProblem } from './search_problem';
import { IHashable } from '../../structures/hash_set';
import * as tmoq from 'typemoq';

class StateMock implements IHashable {
    public data: string;
    constructor(data: string) { this.data = data; }
    public hash() {return this.data};
}

class ActionMock {}

describe('GreedyBestFirstSearch', () => {
    const initial_state = new StateMock("initial state");
    let problem = tmoq.Mock.ofType<ISearchProblem<StateMock, ActionMock>>();
    let search : GreedyBestFirstSearch<StateMock, ActionMock>;

    const initialiseOneStateProblem = () => {
        problem = tmoq.Mock.ofType<ISearchProblem<StateMock, ActionMock>>();
        problem.setup(p => p.initial_state).returns(() => initial_state);
        problem.setup(p => p.getActions(tmoq.It.isAny())).returns(() => []);
        problem.setup(p => p.isGoal(tmoq.It.isAny())).returns(() => false);
        search = new GreedyBestFirstSearch(problem.object, Number.MAX_VALUE, () => 1);
    }

    it('initial state', () => {
        initialiseOneStateProblem();
        expect(search.getExplored()).toEqual([]);
        expect(search.isFinished).toBe(false);
        expect(search.getFrontier().length).toBe(1);
        expect(search.getFrontier()[0].data).toBe("initial state");
    });

    it('solve one state problem should finish', () => {
        initialiseOneStateProblem();
        search.solve();
        expect(search.isFinished).toBe(true);
    });

    /**     state1   state2
     *          \     /
     *            init
     *                \
     *               state3 -- goal state
     *
     * should go init --> state3 --> goal state
     */
    it('point 2d step order', () => {
        const init = new Point2d(0, 0);
        const state1 = new Point2d(-1, 1);
        const state2 = new Point2d(1, 1);
        const state3 = new Point2d(1, -1);
        const goal = new Point2d(2, -1);
        // hmm. be easier to just use an actual graph here...
        const p2Problem = tmoq.Mock.ofType<ISearchProblem<Point2d, Point2d>>();
        p2Problem.setup(p => p.initial_state).returns(() => init);
        p2Problem.setup(p => p.getActions(init)).returns(() => [state1, state2, state3]);
        p2Problem.setup(p => p.getActions(state1)).returns(() => [init]);
        p2Problem.setup(p => p.getActions(state2)).returns(() => [init]);
        p2Problem.setup(p => p.getActions(state3)).returns(() => [init, goal]);
        p2Problem.setup(p => p.doAction(tmoq.It.isAny(), init)).returns(() => init);
        p2Problem.setup(p => p.doAction(tmoq.It.isAny(), state1)).returns(() => state1);
        p2Problem.setup(p => p.doAction(tmoq.It.isAny(), state2)).returns(() => state2);
        p2Problem.setup(p => p.doAction(tmoq.It.isAny(), state3)).returns(() => state3);
        p2Problem.setup(p => p.doAction(tmoq.It.isAny(), goal)).returns(() => goal);
        p2Problem.setup(p => p.pathCost(tmoq.It.isAny(), tmoq.It.isAny())).returns(() => 1);

        const heuristic = (p: Point2d) => Point2d.distanceSquared(p, goal);
        const p2search = new GreedyBestFirstSearch(p2Problem.object, Number.MAX_VALUE, heuristic);

        p2search.step();

        expect(p2search.getExplored()).toEqual([init]);
        expect(p2search.getFrontier()).toEqual([state1, state2, state3]);

        p2search.step();

        expect(p2search.getExplored()).toEqual([init, state3]);
        expect(p2search.getFrontier()).toEqual([state1, state2, goal]);
    });
});