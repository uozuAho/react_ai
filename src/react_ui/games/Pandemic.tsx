import * as React from 'react';
import { PandemicBoard } from 'src/games/pandemic/pandemic_board';
import { PandemicGameState } from 'src/games/pandemic/game_state';
import { PandemicStateDisplay } from './PandemicStateDisplay';
import { RootReducer } from 'src/games/pandemic/game_reducers';
import { EndTurnAction, IPandemicAction } from 'src/games/pandemic/game_actions';

export class Pandemic extends React.Component {

    private _reducer: RootReducer;
    private _game_state: PandemicGameState;

    constructor(props: any) {
        super(props);
        this._reducer = new RootReducer();
        this._game_state = PandemicGameState.createNew(new PandemicBoard());
    }

    public render() {
        return (
            <div>
                <h1>Pandemic!</h1>
                <button onClick={this.endTurn}>End turn</button>
                <PandemicStateDisplay game_state={this._game_state} />
            </div>
        )
    }

    private endTurn = () => { this.performAction(new EndTurnAction()); }

    private performAction(action: IPandemicAction) {
        // tslint:disable-next-line:no-console
        console.log(action.name);
        this._game_state = this._reducer.reduce(this._game_state, action);
    }
}
