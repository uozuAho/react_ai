import { IGraph } from 'src/ai_lib/structures/igraph';
import * as GraphColoring from './graph_coloring';

/** Basic hill climbing graph colorer. Stops when no neighbours are better than the current state. */
export class GraphColoringHillClimber {

    private _colors: number[];
    private _graph: IGraph;

    /**
     * @param graph graph to color
     * @param initial_colors initial node colors. NOTE: this must be a valid coloring (todo: relax this later)
     */
    constructor(graph: IGraph, initial_colors: number[]) {
        if (!GraphColoring.isValid(graph, initial_colors)) {
            throw new Error('only valid initial colorings supported');
        }
        this._graph = graph;
        this._colors = initial_colors;
        this.solve();
    }

    public get_colors(): number[] { return this._colors; }

    private solve() {
        let solved = false;
        while (!solved) {
            const neighbour = this.get_best_neighbour();
            if (this.is_better_than(neighbour, this._colors)) {
                this._colors = neighbour;
            }
            else {
                solved = true;
            }
        }
    }

    private get_best_neighbour(): number[] {
        // - consider neighbours to be all node colorings with one node's color
        //   different to the current coloring
        // - assuming we're starting at a valid coloring, limit neighbours to
        //   those with the same or fewer total colors than the current coloring
        // - given the above, the best neighbour will have at most one fewer color
        //   than the current coloring, thus we can stop searching when we find a
        //   valid coloring with one less color than the current coloring
        const num_nodes = this._graph.num_nodes();
        const num_colors = new Set(this._colors).size;
        for (let node = 0; node < num_nodes; node++) {
            const neighbour_colors = this._colors.slice();
            for (let color = 0; color < num_colors; color++) {
                neighbour_colors[node] = color;
                if (GraphColoring.isValid(this._graph, neighbour_colors) &&
                    this.is_better_than(neighbour_colors, this._colors)) {
                    return neighbour_colors;
                }
            }
        }
        return this._colors;
    }

    /** Returns true if colors1 has fewer unique colors than colors2.
     *  NOTE: assumes both colorings are valid.
     */
    private is_better_than(colors1: number[], colors2: number[]): boolean {
        return new Set(colors1).size < new Set(colors2).size;
    }
}
