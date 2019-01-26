import { IGraph } from 'src/ai_lib/structures/igraph';

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

        const num_nodes = this._graph.num_nodes();
        for (let num_colors = 2; num_colors < 36; num_colors++) {
            for (const coloring of this.allColorings(num_nodes, num_colors)) {
                if (this.is_valid_coloring(this._graph, coloring)) {
                    this._colors = coloring;
                    return;
                }
            }
        }
        // todo: handle this
        // no valid colorings for k <= 36
        return;
    }

    private* allColorings(num_nodes: number, num_colors: number): IterableIterator<number[]> {
        for (const coloring_string of this.allColoringsAsStrings(num_nodes, num_colors)) {
            const coloring_chars = Array.from(coloring_string);
            yield coloring_chars.map(c => this.charToColor(c));
        }
    }

    private* allColoringsAsStrings(num_nodes: number, num_colors: number): IterableIterator<string> {
        const max_combos = num_colors**num_nodes;
        const radix = num_colors;

        for (let i = 0; i < max_combos; i++) {
            const str = i.toString(radix);
            yield this.zeroLeftPad(str, num_nodes);
        }
    }

    private zeroLeftPad(str: string, size: number) {
        const s = "00000000000000000000000000000000000000000000" + str;
        return s.substr(s.length - size);
    }

    private charToColor(c: string): number {
        if (c < 'a') {
            return c.charCodeAt(0) - 48;
        }
        return c.charCodeAt(0) - 87;
    }

    private is_valid_coloring(graph: IGraph, colors: number[]): boolean {
        const num_nodes = graph.num_nodes();
        for (let node = 0; node < num_nodes; node++) {
            const this_color = colors[node];
            for (const adj of graph.adjacent(node)) {
                const neighbour_color = colors[adj.other(node)];
                if (neighbour_color === this_color) {
                    return false;
                }
            }
        }
        return true;
    }
}
