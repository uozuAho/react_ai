import { PandemicGameState } from './game_state';
import { IPandemicAction, ActionNames } from './game_actions';

export const RootReducer = (state: PandemicGameState, action: IPandemicAction) => {
    switch (action.name) {
        case ActionNames.END_TURN:
            return state
        default:
            throw new Error("Unhandled action " + action.name);
    }
}
