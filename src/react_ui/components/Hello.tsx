import * as React from "react";
import './Hello.css';
import { IStoreState } from '../redux/IStoreState';
import * as actions from '../redux/actions';
import { connect } from 'react-redux';

export interface IProps {
  name: string;
  enthusiasmLevel?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export function HelloView({ name, enthusiasmLevel = 1, onIncrement, onDecrement }: IProps) {
  if (enthusiasmLevel <= 0) {
    throw new Error('You could be a little more enthusiastic. :D');
  }

  return (
    <div className="hello">
      <div className="greeting">
        Hello {name + getExclamationMarks(enthusiasmLevel)}
      </div>
      <div>
        <button id="btnDec" onClick={onDecrement}>-</button>
        <button id="btnInc" onClick={onIncrement}>+</button>
      </div>
    </div>
  );
}

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join('!');
}


// ------------------------------------------------------------------------------
// redux container

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

export const Hello = connect(mapStateToProps, mapDispatchToProps)(HelloView);
