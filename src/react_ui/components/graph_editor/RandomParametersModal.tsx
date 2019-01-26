import * as React from 'react';
import * as Modal from 'react-modal';

interface IRandomParametersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export class RandomParametersModal extends React.Component<IRandomParametersModalProps> {

    constructor(props: IRandomParametersModalProps) {
        super(props);
    }

    public render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.onClose}
                style={customStyles}
                contentLabel="Example Modal"
            >

                <button onClick={this.props.onClose}>close</button>
                <div>I am a modal</div>
                <form>
                    <input />
                    <button>tab navigation</button>
                    <button>stays</button>
                    <button>inside</button>
                    <button>the modal</button>
                </form>
            </Modal>
        );
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
