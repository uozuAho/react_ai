import * as React from 'react';
import * as Modal from 'react-modal';

export class RandomParameters {
    constructor(
        public num_nodes: number,
        public connect_within_distance: number) {}
}

interface IRandomParametersModalProps {
    isOpen: boolean;
    onClose: (params: RandomParameters) => void;
}

interface IRandomParametersModalState {
    num_nodes: string;
    connect_within_distance: string;
}

export class RandomParametersModal extends React.Component<IRandomParametersModalProps, IRandomParametersModalState> {

    constructor(props: IRandomParametersModalProps) {
        super(props);
        this.state = {
            num_nodes: '20',
            connect_within_distance: '200'
        };
    }

    public render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={this.onClose}
                style={customStyles}
                contentLabel="Random graph params modal"
                ariaHideApp={false}>

                <h2>Generate random graph</h2>
                <label>
                    Number of nodes:
                    <input value={this.state.num_nodes} onChange={this.onNumNodesChange} />
                </label>
                <br />
                <label>
                    Connect within distance:
                    <input value={this.state.connect_within_distance} onChange={this.onConnectDistanceChange} />
                </label>
                <button onClick={this.onClose}>OK</button>
            </Modal>
        );
    }

    private onNumNodesChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({num_nodes: e.target.value});

    private onConnectDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({connect_within_distance: e.target.value});

    private onClose = () => {
        const num_nodes = parseInt(this.state.num_nodes, 10);
        const connect_within_distance = parseInt(this.state.connect_within_distance, 10);

        const params = {
            num_nodes,
            connect_within_distance
        } as RandomParameters;

        this.props.onClose(params);
    }
}

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
};
