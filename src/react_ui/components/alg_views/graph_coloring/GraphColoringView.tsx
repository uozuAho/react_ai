import * as React from 'react';
import { GraphEditor } from '../../graph_editor/GraphEditor';

export class GraphColoringView extends React.Component {

    private _graphEditor: GraphEditor;

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div>
                <h1>Graph coloring</h1>
                <button onClick={this.findColoring}>Find coloring</button>
                <GraphEditor setRef={this.setEditorRef}/>
            </div>
        );
    }

    private findColoring = () => {
        const graph = this._graphEditor.getGraph();
        let colorIdx = 0;
        for (const node of graph.get_nodes()) {
            node.setColor(css_color_names[colorIdx++]);
            colorIdx = colorIdx % css_color_names.length;
        }
    }

    private setEditorRef = (ref: GraphEditor) => {
        this._graphEditor = ref;
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
