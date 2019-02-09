import * as React from 'react';
import { PandemicBoard } from 'src/games/pandemic/pandemic_board';
import { PandemicGameState } from 'src/games/pandemic/game_state';
import { PandemicStateDisplay } from './PandemicStateDisplay';

export class Pandemic extends React.Component {

    private _game_state: PandemicGameState;

    constructor(props: any) {
        super(props);
        this._game_state = PandemicGameState.createNew(new PandemicBoard());
    }

    public render() {
        return (
            <div>
                <h1>Pandemic!</h1>
                <button>End turn</button>
                <PandemicStateDisplay game_state={this._game_state} />
            </div>
        )
    }
}
