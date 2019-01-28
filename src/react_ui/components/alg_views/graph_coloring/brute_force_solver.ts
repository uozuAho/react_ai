import { IGraph } from 'src/ai_lib/structures/igraph';
import * as GraphColoring from './graph_coloring';

/** Try all combinations of 1, 2, 3, ... k colors until a valid solution is found.
 *  Note that finding a solution takes exponential time in (n, e) (probably, or worse?),
 *  so it's only really useful for small numbers of nodes & edges.
 */
export class GraphColoringBruteForcer {

    private _colors: number[];
    private _graph: IGraph;

    constructor(graph: IGraph) {
        this._graph = graph;
        this._colors = Array(graph.num_nodes()).fill(0);
    }

    public get_colors(): number[] { return this._colors; }

    public solve() {
        if (this._graph.num_edges() === 0) {
            return this._colors;
        }

        let num_colorings_tried = 0;
        const start = new Date().getTime();
        const num_nodes = this._graph.num_nodes();
        for (let num_colors = 2; num_colors < 36; num_colors++) {
            const numColorings = num_colors ** num_nodes;
            let now = new Date().getTime() - start;
            // tslint:disable-next-line:no-console
            console.log(`${now}: no ${num_colors - 1}-coloring. Trying all ${numColorings} possible ${num_colors}-colorings.`);
            for (const coloring of this.allColorings(num_nodes, num_colors)) {
                num_colorings_tried++;
                now = new Date().getTime() - start;
                if (now > 10000) {
                    // tslint:disable-next-line:no-console
                    console.log('no valid colorings found in 10s');
                    // tslint:disable-next-line:no-console
                    console.log(`avg ${(num_colorings_tried * 1000) / now} colorings / sec`);
                    return;
                }
                if (GraphColoring.isValid(this._graph, coloring)) {
                    this._colors = coloring;
                    now = new Date().getTime() - start;
                    // tslint:disable-next-line:no-console
                    console.log(`found ${num_colors}-coloring in ${now} ms`);
                    // tslint:disable-next-line:no-console
                    console.log(`avg ${(num_colorings_tried * 1000) / now} colorings / sec`);
                    return;
                }
            }
        }
        // todo: handle this
        // no valid colorings for k <= 36
        return;
    }

    private* allColorings(num_nodes: number, num_colors: number): IterableIterator<number[]> {
        const total_possible_colorings = num_colors ** num_nodes;
        const radix = num_colors;

        // use an array as a radix-n counter, yield all countable values
        const colors: number[] = Array(num_nodes).fill(0);

        let max_reached = false;
        const increment = (idx: number) => {
            if (idx === colors.length) {
                max_reached = true;
                return;
            }
            colors[idx]++;
            if (colors[idx] === radix) {
                colors[idx] = 0;
                increment(idx + 1);
            }
        }

        for (let i = 0; i < total_possible_colorings; i++) {
            yield colors;
            increment(0);
            if (max_reached) {
                break;
            }
        }
    }
}
