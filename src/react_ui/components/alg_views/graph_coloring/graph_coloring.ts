import { IGraph } from 'src/ai_lib/structures/igraph';

/** Returns true if no two adjacent nodes have the same color */
export function isValid(graph: IGraph, colors: number[]): boolean {
    const num_nodes = graph.num_nodes();
    if (colors.length !== num_nodes) {
        throw new Error("colors array must be same length as number of nodes");
    }

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
