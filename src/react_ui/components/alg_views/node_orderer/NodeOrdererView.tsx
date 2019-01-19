import * as React from 'react';
import { GraphEditor } from '../../graph_editor/GraphEditor';

interface INodeOrdererViewState {
    instructionsText?: string;
    nextButtonText: string;
    viewerState: AlgViewerState;
}

export class NodeOrdererView extends React.Component<any, INodeOrdererViewState> {

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
                <button>{this.state.nextButtonText}</button>
                <GraphEditor />
            </div>
        );
    }

    public componentDidMount() {
        this.state.viewerState.run();
    }

    private updateViewerState(input: StateInput) {
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
