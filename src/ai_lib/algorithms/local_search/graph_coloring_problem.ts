import { ILocalSearchProblem } from './local_search_problem';
import { IGraph } from 'src/ai_lib/structures/igraph';
import { GraphColoring } from './graph_coloring';

export class GraphColoringProblem implements ILocalSearchProblem<number[]> {

    constructor(private _graph: IGraph) {}

    public getAllNeighbours(state: number[]): Iterable<number[]> {
        // optimisation hack : since all neighbours will have at most one colour different
        // to the current state, all the 'best' neighbours will have the same score. Just
        // find the first 'best' neighbour and return it.
        // Note: This works for hill climbing, but may break other algs.
        const num_nodes = this._graph.num_nodes();
        const num_colors = this.num_colours(state);
        const valid_state = GraphColoring.isValid(this._graph, state);
        const try_colors = valid_state ? num_colors : num_colors + 1;
        const current_score = this.score(state);

        for (let node = 0; node < num_nodes; node++) {
            const neighbour_colors = state.slice();
            for (let color = 0; color < try_colors; color++) {
                neighbour_colors[node] = color;
                if (this.score(neighbour_colors) > current_score) {
                    return [neighbour_colors];
                }
            }
        }
        return [state];
    }

    public getRandomNeighbour(state: number[]): number[] {
        const neighbour = state.slice();
        const rand_idx = this.randomInt(state.length);
        const rand_color = this.randomInt(state.length);
        neighbour[rand_idx] = rand_color;
        return neighbour;
    }

    public score(state: number[]): number {
        const num_nodes = state.length;
        const max_score = 2 * num_nodes;
        return max_score - this.inverse_score(state);
    }

    public isValid(state: number[]): boolean {
        return GraphColoring.isValid(this._graph, state);
    }

    // graph coloring is easier to score inversely - less colors the better
    private inverse_score(state: number[]): number {
        if (GraphColoring.isValid(this._graph, state)) {
            return this.num_colours(state);
        }
        else {
            const num_nodes = state.length;
            // add the number of nodes to ensure invalid coloring score is always
            // higher than valid coloring
            return num_nodes + GraphColoring.numInvalidNodes(this._graph, state);
        }
    }

    private num_colours(state: number[]) {
        return new Set(state).size;
    }

    private randomInt(max: number): number {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
