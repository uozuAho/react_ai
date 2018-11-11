import { connect } from 'react-redux';
import * as actions from '../actions/';
import Hello from '../components/Hello';
import { IStoreState } from '../types/index';

export function mapStateToProps({ enthusiasmLevel, languageName }: IStoreState) {
    return {
        enthusiasmLevel,
        name: languageName,
    }
}

// todo: couldn't work out type for dispatch. Doesn't seem to be Dispatch or DispatchProps
export function mapDispatchToProps(dispatch: any) {
    return {
        onDecrement: () => dispatch(actions.decrementEnthusiasm()),
        onIncrement: () => dispatch(actions.incrementEnthusiasm()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Hello);
