import * as React from 'react';
import { GraphEditor } from '../../graph_editor/GraphEditor';
import { GraphEditorNode } from '../../graph_editor/GraphEditorNode';
import { GraphT } from 'src/ai_lib/structures/graphT';
import { GraphColoringHillClimber } from './hill_climbing_solver';
import * as ArrayUtils from 'src/libs/array/array_utils';
import { GraphColoringBruteForcer } from './brute_force_solver';

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
        this.setState({
            num_nodes: this._graphToColor.num_nodes(),
        });
        // this.solveWithHillClimbing();
        this.solveWithBruteForce();
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
            const color = colors[i];
            nodes[i].setColor(css_color_names[color]);
        }
    }

    private solveWithHillClimbing() {
        const graph = this._graphToColor;
        const initial_colors = Array.from(ArrayUtils.range(graph.num_nodes()))
        const solver = new GraphColoringHillClimber(graph, initial_colors);
        const solution = solver.get_colors();
        this.setNodeColors(solution);

        const num_colors = new Set(solution).size;

        this.setState({num_colors});
    }

    private solveWithBruteForce() {
        const graph = this._graphToColor;
        const solver = new GraphColoringBruteForcer(graph);
        solver.solve();
        const solution = solver.get_colors();
        this.setNodeColors(solution);

        const num_colors = new Set(solution).size;

        this.setState({num_colors});
    }
}

// color names grabbed from https://www.w3schools.com/colors/colors_names.asp
const css_color_names = [
'White',
'Black',
'Red',
'Green',
'Blue',
'Orange',
'Yellow',
'Pink',
'Purple',
'AliceBlue',
'AntiqueWhite',
'Aqua',
'Aquamarine',
'Azure',
'Beige',
'Bisque',
'BlanchedAlmond',
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
'OrangeRed',
'Orchid',
'PaleGoldenRod',
'PaleGreen',
'PaleTurquoise',
'PaleVioletRed',
'PapayaWhip',
'PeachPuff',
'Peru',
'Plum',
'PowderBlue',
'RebeccaPurple',
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
'WhiteSmoke',
'YellowGreen'
];
