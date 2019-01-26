import * as React from 'react';
import * as Modal from 'react-modal';

export class RandomParameters {
    constructor(public num_nodes: number) {}
}

interface IRandomParametersModalProps {
    isOpen: boolean;
    onClose: (params: RandomParameters) => void;
}

export class RandomParametersModal extends React.Component<IRandomParametersModalProps> {

    constructor(props: IRandomParametersModalProps) {
        super(props);
    }

    public render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={this.onClose}
                style={customStyles}
                contentLabel="Random graph params modal">

                <div>Generate random graph</div>
                <button onClick={this.onClose}>OK</button>
            </Modal>
        );
    }

    private onClose = () => {
        const params = new RandomParameters(30);
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
