import { IGraph } from 'src/ai_lib/structures/igraph';

export class GraphColoring {

    /** Returns true if no two adjacent nodes have the same color */
    public static isValid(graph: IGraph, colors: number[]): boolean {
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

    /** Retunrs the number of nodes which have the same colour as an adjacent node */
    public static numInvalidNodes(graph: IGraph, colors: number[]): number {
        const num_nodes = graph.num_nodes();
        if (colors.length !== num_nodes) {
            throw new Error("colors array must be same length as number of nodes");
        }

        let num = 0;
        for (let node = 0; node < num_nodes; node++) {
            const this_color = colors[node];
            for (const adj of graph.adjacent(node)) {
                const neighbour_color = colors[adj.other(node)];
                if (neighbour_color === this_color) {
                    num++;
                    break;
                }
            }
        }
        return num;
    }
}
