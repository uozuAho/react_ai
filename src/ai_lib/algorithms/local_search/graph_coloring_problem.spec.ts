import { GraphColoringProblem } from "./graph_coloring_problem";
import { Graph } from '../../structures/graph';

describe('graph coloring problem', () => {

    const graph = new Graph(3);
    graph.add_edge(0, 1);
    graph.add_edge(1, 2);

    it('get all neighbours should return 1 better neighbour', () => {
        // note this test is for an optimisation hack

        const initial_state = [0, 0, 0];
        const problem = new GraphColoringProblem(graph);
        const initial_score = problem.score(initial_state);
        const neighbours = Array.from(problem.getAllNeighbours(initial_state));

        expect(neighbours.length).toBe(1);

        const neighbour = neighbours[0];
        const neighbour_score = problem.score(neighbour);

        expect(neighbour_score > initial_score).toBe(true);
    });
});
