import * as React from 'react';
import { GraphEditor } from '../../graph_editor/GraphEditor';

interface INodeOrdererViewState {
    instructionsText?: string;
    nextButtonText: string;
    viewerState: AlgViewerState;
}

export class NodeOrdererView extends React.Component<any, INodeOrdererViewState> {

    private _graphEditor: GraphEditor;

    constructor(props: any) {
        super(props);
        this.state = {
            nextButtonText: 'Next',
            viewerState: this.createGraphState
        };
    }

    public render() {
        return (
            <div>
                <h1>Node orderer</h1>
                <p>Find node orderings in directed graphs with and without cycles</p>
                <p>{this.state.instructionsText}</p>
                <button onClick={this.onNextClick}>{this.state.nextButtonText}</button>
                <GraphEditor setRef={this.setEditorRef}/>
            </div>
        );
    }

    public componentDidMount() {
        this.state.viewerState.run();
    }

    private onNextClick = () => {
        this.updateViewerState(StateInput.Next);
        const graph = this._graphEditor.getGraph();
        // tslint:disable-next-line:no-console
        console.log(graph);
    }

    private setEditorRef = (ref: GraphEditor) => {
        this._graphEditor = ref;
    }

    private updateViewerState = (input: StateInput) => {
        const currentViewerState = this.state.viewerState;
        const nextViewerState = this.state.viewerState.next(input);

        if (nextViewerState === currentViewerState) {
            return;
        }
        else {
            if (currentViewerState.onLeavingState !== null) {
                currentViewerState.onLeavingState();
            }
            this.setState({viewerState: nextViewerState});
            nextViewerState.run();
        }
    }

    private createGraphState = new AlgViewerState(
        () => {
            this.setState({
                instructionsText: 'Draw a graph'
            });
        },
        input => {
            switch (input) {
                case StateInput.Next: {
                    return this.state.viewerState;
                }
                default: return this.state.viewerState;
            }
        }
    );
}

enum StateInput {
    Next,
    Back
}

class AlgViewerState {
    constructor(
      public run: (() => void),
      public next: ((input: StateInput) => AlgViewerState),
      public onLeavingState: (() => void) | null = null,
      public data: any = {})
    {
    }
}
