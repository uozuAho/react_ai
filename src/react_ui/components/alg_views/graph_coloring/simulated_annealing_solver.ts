import { IGraph } from 'src/ai_lib/structures/igraph';
import { GraphColoring } from './graph_coloring';

export class GraphColoringSimulatedAnnealer {

    private _colors: number[];
    private _graph: IGraph;
    private _temperature: number;

    constructor(graph: IGraph) {
        this._graph = graph;
        // todo: probably better to start with a random coloring?
        this._colors = Array(graph.num_nodes()).fill(0);
        this._temperature = 1000;
    }

    public get_colors(): number[] { return this._colors; }

    public solve() {
        const start = new Date().getTime();
        let lastTempDecrease = start;
        while (true) {
            const now = new Date().getTime();
            if (now - lastTempDecrease > 100) {
                lastTempDecrease = now;
                this._temperature = this._temperature * 0.9;
                // tslint:disable-next-line:no-console
                console.log(this._temperature);
            }
            const neighbour = this.get_random_neighbour();
            if (this.is_better_than(neighbour, this._colors)) {
                this._colors = neighbour;
            }
            else if (Math.random() < Math.exp(-1/this._temperature)) {
                this._colors = neighbour;
            }
            if (this._temperature < 0 || now - start > 10000) {
                break;
            }
        }
    }

    private get_random_neighbour(): number[] {
        const neighbour = this._colors.slice();
        const num_nodes = this._graph.num_nodes();
        const rand_idx = randomInt(num_nodes);
        const rand_color = randomInt(num_nodes);
        neighbour[rand_idx] = rand_color;
        return neighbour;
    }

    private is_better_than(colors1: number[], colors2: number[]): boolean {
        const colors1_valid = GraphColoring.isValid(this._graph, colors1);
        const colors2_valid = GraphColoring.isValid(this._graph, colors2);

        if (colors1_valid && colors2_valid) {
            return numColors(colors1) < numColors(colors2);
        }
        else if (colors1_valid && !colors2_valid) {
            return true;
        }
        else if (!colors1_valid && colors2_valid) {
            return false;
        }
        else {
            // both colorings are invalid
            const numInvalid1 = GraphColoring.numInvalidNodes(this._graph, colors1);
            const numInvalid2 = GraphColoring.numInvalidNodes(this._graph, colors2);
            return numInvalid1 < numInvalid2;
        }
    }
}

function numColors(colors: number[]): number {
    return new Set(colors).size;
}

function randomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}
