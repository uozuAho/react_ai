import * as React from 'react';
import { PandemicBoard } from 'src/games/pandemic/pandemic_board';
import { PandemicGameState } from 'src/games/pandemic/game_state';
import { PandemicStateDisplay } from './PandemicStateDisplay';
import { EndTurnAction, IPandemicAction, ActionNames } from 'src/games/pandemic/game_actions';
import { PandemicStateMachine } from 'src/games/pandemic/game_state_machine';

interface IPandemicState {
    game_state: PandemicGameState;
}

export class Pandemic extends React.Component<any, IPandemicState> {

    private _game: PandemicStateMachine;

    constructor(props: any) {
        super(props);
        const state = PandemicGameState.createNew(new PandemicBoard());
        this._game = new PandemicStateMachine(state);
        this.state = {
            game_state: state
        };
    }

    public render() {
        return (
            <div>
                <h1>Pandemic!</h1>
                <button onClick={this.endTurn}>End turn</button>
                <PandemicStateDisplay game_state={this.state.game_state} />
            </div>
        )
    }

    private endTurn = () => { this.performAction(new EndTurnAction()); }

    private performAction(action: IPandemicAction) {
        this._game.emit_action(action);
        const game_state = this._game.get_state();
        this.setState({game_state});
    }
}
