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
        const colors = ["red", "blue", "green"];
        let colorIdx = 0;
        for (const node of graph.get_nodes()) {
            node.setColor(colors[colorIdx++]);
            colorIdx = colorIdx % colors.length;
        }
    }

    private setEditorRef = (ref: GraphEditor) => {
        this._graphEditor = ref;
    }
}
