import { HillClimbingSolver } from "./hill_climbing";
import * as tmoq from 'typemoq';
import { ILocalSearchProblem } from './local_search_problem';
import { Graph } from '../../structures/graph';
import { GraphColoringProblem } from './graph_coloring_problem';

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

    describe('for 3n2k graph coloring', () => {
        // bipartite 3 node graph
        //
        //  n ----- n ------ n
        //
        const graph = new Graph(3);
        graph.add_edge(0, 1);
        graph.add_edge(1, 2);

        it('should find 2 coloring from invalid initial state', () => {
            const initial_state = [0, 0, 0];
            const problem = new GraphColoringProblem(graph);
            const solver = new HillClimbingSolver(problem, initial_state);

            solver.solve();

            expect(solver.isFinished()).toBe(true);
            const num_colours = new Set(solver.getCurrentState()).size;
            expect(num_colours).toBe(2);
        });

        it('should find 2 coloring from valid initial state', () => {
            const initial_state = [0, 1, 2];
            const problem = new GraphColoringProblem(graph);
            const solver = new HillClimbingSolver(problem, initial_state);

            solver.solve();

            expect(solver.isFinished()).toBe(true);
            const num_colours = new Set(solver.getCurrentState()).size;
            expect(num_colours).toBe(2);
        });
    });
});
