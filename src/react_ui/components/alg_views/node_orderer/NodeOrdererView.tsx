import * as React from 'react';
import { GraphEditor } from '../../graph_editor/GraphEditor';
import { DiGraphT } from 'src/ai_lib/structures/graphT';
import { TopoSort } from 'src/ai_lib/algorithms/graph/toposort';
import { GraphEditorNode } from '../../graph_editor/GraphEditorNode';

interface INodeOrdererViewState {
    instructionsText?: string;
    nextButtonText: string;
}

export class NodeOrdererView extends React.Component<any, INodeOrdererViewState> {

    private _graphEditor: GraphEditor;
    // Viewer state is kept separate since react state updates may not occur immediately, and
    // not all viewer state changes require a re-render
    private _viewerState: AlgViewerState;
    private _originalGraph: DiGraphT<GraphEditorNode>;

    constructor(props: any) {
        super(props);
        this._viewerState = this.createGraphState();
        this.state = {
            nextButtonText: 'Next',
        };
    }

    public render() {
        return (
            <div>
                <h1>Node orderer</h1>
                <p>Find node orderings in directed graphs without cycles (topological order).
                    Orderings in cyclic graphs not yet supported...
                </p>
                <p>{this.state.instructionsText}</p>
                <button onClick={this.onNextClick}>{this.state.nextButtonText}</button>
                <GraphEditor setRef={this.setEditorRef}/>
            </div>
        );
    }

    public componentDidMount() {
        this._viewerState.run();
    }

    private onNextClick = () => {
        this.updateViewerState(StateInput.Next);
    }

    private setEditorRef = (ref: GraphEditor) => {
        this._graphEditor = ref;
    }

    private updateViewerState = (input: StateInput) => {
        const currentViewerState = this._viewerState;
        const nextViewerState = this._viewerState.next(input);

        if (nextViewerState === currentViewerState) {
            return;
        }
        else {
            if (currentViewerState.onLeavingState !== null) {
                currentViewerState.onLeavingState();
            }
            this._viewerState = nextViewerState;
            nextViewerState.run();
        }
    }

    private createGraphState = () => new AlgViewerState(
        'create graph',
        () => {
            this.setState({
                instructionsText: 'Draw a graph'
            });
        },
        input => {
            switch (input) {
                case StateInput.Next: {
                    const graph = this._graphEditor.getDigraph();
                    this._originalGraph = graph;
                    if (new TopoSort(graph).hasOrder()) {
                        return this.showTopoOrderState();
                    } else {
                        // todo: get orderer from ts ai 2. meh
                        throw new Error('contains cycle. Not supported ... yet');
                    }
                }
                default: return this._viewerState;
            }
        }
    );

    private showTopoOrderState: (() => AlgViewerState) = () => new AlgViewerState(
        'show topo',
        () => {
            this.setState({instructionsText: 'Colouring nodes in topological order'});

            const topo = new TopoSort(this._originalGraph);
            const order = Array.from(topo.order());
            const nodes = this._originalGraph.get_nodes();

            let idx = 0;
            this._viewerState.data.timer = setInterval(() => {
                const prevIdx = idx;
                if (++idx === order.length) { idx = 0; }
                nodes[prevIdx].setHighlighted(false);
                nodes[idx].setHighlighted(true);
            }, 300);
        },
        input => {
          switch (input) {
            case StateInput.Back: {
              return this.createGraphState();
            }
            default: return this._viewerState;
          }
        },
        () => clearInterval(this._viewerState.data.timer)
    );
}

enum StateInput {
    Next,
    Back
}

class AlgViewerState {
    constructor(
      public label: string,
      public run: (() => void),
      public next: ((input: StateInput) => AlgViewerState),
      public onLeavingState: (() => void) | null = null,
      public data: any = {})
    {
    }
}
