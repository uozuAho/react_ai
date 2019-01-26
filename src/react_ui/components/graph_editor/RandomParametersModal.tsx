import * as React from 'react';
import * as Modal from 'react-modal';

export class RandomParameters {
    constructor(public num_nodes: number) {}
}

interface IRandomParametersModalProps {
    isOpen: boolean;
    onClose: (params: RandomParameters) => void;
}

interface IRandomParametersModalState {
    value: string;
}

export class RandomParametersModal extends React.Component<IRandomParametersModalProps, IRandomParametersModalState> {

    constructor(props: IRandomParametersModalProps) {
        super(props);
        this.state = {
            value: '20'
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

                <div>Generate random graph</div>
                <label>
                    Number of nodes:
                    <input value={this.state.value} onChange={this.handleChange} />
                </label>
                <button onClick={this.onClose}>OK</button>
            </Modal>
        );
    }

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            value: e.target.value
        });
    }

    private onClose = () => {
        const num_nodes = parseInt(this.state.value, 10);
        const params = new RandomParameters(num_nodes);
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
