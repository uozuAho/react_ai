import * as React from 'react';
import { GraphEditor } from '../../graph_editor/GraphEditor';
import { IGraph } from 'src/ai_lib/structures/igraph';
import { GraphEditorNode } from '../../graph_editor/GraphEditorNode';
import { GraphT } from 'src/ai_lib/structures/graphT';

interface IGraphColoringViewState {
    num_nodes: number;
    num_colors: number;
}

export class GraphColoringView extends React.Component<any, IGraphColoringViewState> {

    private _graphEditor: GraphEditor;
    private _graphToColor: GraphT<GraphEditorNode>;

    constructor(props: any) {
        super(props);
        this.state = {
            num_nodes: 0,
            num_colors: 0
        };
    }

    public render() {
        return (
            <div>
                <h1>Graph coloring</h1>
                <button onClick={this.findColoring}>Find coloring</button>
                <h2>Nodes: {this.state.num_nodes}, colors: {this.state.num_colors}</h2>
                <GraphEditor setRef={this.setEditorRef}/>
            </div>
        );
    }

    private findColoring = () => {
        this._graphToColor = this._graphEditor.getGraph();
        this.setState({num_nodes: this._graphToColor.num_nodes()});
        this.solveWithHillClimbing();
    }

    private setEditorRef = (ref: GraphEditor) => {
        this._graphEditor = ref;
    }

    private setNodeColors(colors: number[]) {
        const nodes = this._graphToColor.get_nodes();
        if (colors.length !== nodes.length) {
            throw new Error("colors array length != number of nodes");
        }
        for (let i = 0; i < colors.length; i++) {
            nodes[i].setColor(css_color_names[i]);
        }
    }

    private solveWithHillClimbing() {
        const graph = this._graphToColor;
        const initial_colors = Array.from(range(graph.num_nodes()))
        const solver = new BasicGraphColoringHillClimber(graph, initial_colors);
        const solution = solver.get_colors();
        this.setNodeColors(solution);

        const num_colors = new Set(solution).size;

        this.setState({num_colors});
    }
}

function* range(n: number): IterableIterator<number> {
    for (let i = 0; i < n; i++) { yield i; }
}

/** Basic hill climbing graph colorer. Stops when no neighbours are better than the current state. */
class BasicGraphColoringHillClimber {

    private _colors: number[];
    private _graph: IGraph;

    /**
     * @param graph graph to color
     * @param initial_colors initial node colors. NOTE: this must be a valid coloring (todo: relax this later)
     */
    constructor(graph: IGraph, initial_colors: number[]) {

        if (!this.is_valid_coloring(graph, initial_colors)) {
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
            } else {
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
                if (this.is_valid_coloring(this._graph, neighbour_colors) &&
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

// color names grabbed from https://www.w3schools.com/colors/colors_names.asp
const css_color_names = [
'AliceBlue',
'AntiqueWhite',
'Aqua',
'Aquamarine',
'Azure',
'Beige',
'Bisque',
'Black',
'BlanchedAlmond',
'Blue',
'BlueViolet',
'Brown',
'BurlyWood',
'CadetBlue',
'Chartreuse',
'Chocolate',
'Coral',
'CornflowerBlue',
'Cornsilk',
'Crimson',
'Cyan',
'DarkBlue',
'DarkCyan',
'DarkGoldenRod',
'DarkGray',
'DarkGrey',
'DarkGreen',
'DarkKhaki',
'DarkMagenta',
'DarkOliveGreen',
'DarkOrange',
'DarkOrchid',
'DarkRed',
'DarkSalmon',
'DarkSeaGreen',
'DarkSlateBlue',
'DarkSlateGray',
'DarkSlateGrey',
'DarkTurquoise',
'DarkViolet',
'DeepPink',
'DeepSkyBlue',
'DimGray',
'DimGrey',
'DodgerBlue',
'FireBrick',
'FloralWhite',
'ForestGreen',
'Fuchsia',
'Gainsboro',
'GhostWhite',
'Gold',
'GoldenRod',
'Gray',
'Grey',
'Green',
'GreenYellow',
'HoneyDew',
'HotPink',
'IndianRed',
'Indigo',
'Ivory',
'Khaki',
'Lavender',
'LavenderBlush',
'LawnGreen',
'LemonChiffon',
'LightBlue',
'LightCoral',
'LightCyan',
'LightGoldenRodYellow',
'LightGray',
'LightGrey',
'LightGreen',
'LightPink',
'LightSalmon',
'LightSeaGreen',
'LightSkyBlue',
'LightSlateGray',
'LightSlateGrey',
'LightSteelBlue',
'LightYellow',
'Lime',
'LimeGreen',
'Linen',
'Magenta',
'Maroon',
'MediumAquaMarine',
'MediumBlue',
'MediumOrchid',
'MediumPurple',
'MediumSeaGreen',
'MediumSlateBlue',
'MediumSpringGreen',
'MediumTurquoise',
'MediumVioletRed',
'MidnightBlue',
'MintCream',
'MistyRose',
'Moccasin',
'NavajoWhite',
'Navy',
'OldLace',
'Olive',
'OliveDrab',
'Orange',
'OrangeRed',
'Orchid',
'PaleGoldenRod',
'PaleGreen',
'PaleTurquoise',
'PaleVioletRed',
'PapayaWhip',
'PeachPuff',
'Peru',
'Pink',
'Plum',
'PowderBlue',
'Purple',
'RebeccaPurple',
'Red',
'RosyBrown',
'RoyalBlue',
'SaddleBrown',
'Salmon',
'SandyBrown',
'SeaGreen',
'SeaShell',
'Sienna',
'Silver',
'SkyBlue',
'SlateBlue',
'SlateGray',
'SlateGrey',
'Snow',
'SpringGreen',
'SteelBlue',
'Tan',
'Teal',
'Thistle',
'Tomato',
'Turquoise',
'Violet',
'Wheat',
'White',
'WhiteSmoke',
'Yellow',
'YellowGreen'
];
