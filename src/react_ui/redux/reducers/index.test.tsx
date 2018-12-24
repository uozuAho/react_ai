import { enthusiasm } from '.';
import { decrementEnthusiasm, incrementEnthusiasm } from '../actions';
import { IStoreState } from "../IStoreState";

it('should increment enthusiasm', () => {
    const state = {languageName: '', enthusiasmLevel: 1} as IStoreState;

    const nextState = enthusiasm(state, incrementEnthusiasm());

    expect(nextState.enthusiasmLevel).toBe(2);
});

it('should decrement enthusiasm', () => {
    const state = {languageName: '', enthusiasmLevel: 2} as IStoreState;

    const nextState = enthusiasm(state, decrementEnthusiasm());

    expect(nextState.enthusiasmLevel).toBe(1);
});

it('should not decrement enthusiasm past 1', () => {
    const state = {languageName: '', enthusiasmLevel: 1} as IStoreState;

    const nextState = enthusiasm(state, decrementEnthusiasm());

    expect(nextState.enthusiasmLevel).toBe(1);
});