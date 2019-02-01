import { IGraph } from 'src/ai_lib/structures/igraph';
import { GraphColoring } from './graph_coloring';

export class GraphColoringSimulatedAnnealer {

    private _colors: number[];
    private _neighbour_colors: number[];
    private _graph: IGraph;
    private _temperature: number;

    constructor(graph: IGraph) {
        this._graph = graph;
        this._colors = Array(graph.num_nodes()).fill(0);
        this._neighbour_colors = Array(graph.num_nodes()).fill(0);
        this._temperature = 1000;
    }

    public get_colors(): number[] { return this._colors; }

    public solve() {
        const start = Date.now();
        let colorings_tried = 0;
        let lastTempDecrease = start;
        let isFinishing = false;
        while (true) {
            colorings_tried++;
            const now = Date.now();
            if (now - lastTempDecrease > 100) {
                lastTempDecrease = now;
                this._temperature = this._temperature * 0.8;
                // tslint:disable-next-line:no-console
                console.log(this._temperature);
            }
            const neighbour = this.get_random_neighbour();
            if (this.is_better_than(neighbour, this._colors)) {
                this._colors = neighbour;
            }
            // choose a worse solution with probability exp(-1 / temperature)
            else if (!isFinishing && Math.random() < Math.exp(-1 / this._temperature)) {
                this._colors = neighbour;
            }
            if (this._temperature < 0 || now - start > 5000) {
                isFinishing = true;
                // stop on next valid solution
                if (GraphColoring.isValid(this._graph, this._colors)) {
                    const colorings_per_second = (colorings_tried * 1000) / (now - start);
                    // tslint:disable-next-line:no-console
                    console.log(`${colorings_per_second} colorings/sec`);
                    break;
                }
                if (now - start > 10000) {
                    // tslint:disable-next-line:no-console
                    console.log('couldnt find valid solution in 10s');
                    break;
                }
            }
        }
    }

    private get_random_neighbour(): number[] {
        // copy current colors to neighbour
        let i = this._colors.length - 1;
        while (i--) {this._neighbour_colors[i] = this._colors[i]}

        const rand_idx = randomInt(this._colors.length);
        const rand_color = randomInt(this._colors.length);
        this._neighbour_colors[rand_idx] = rand_color;
        return this._neighbour_colors;
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
