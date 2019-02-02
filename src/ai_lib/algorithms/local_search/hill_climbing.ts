import { ILocalSearchProblem } from './local_search_problem';

export class HillClimbingSolver<TState> {

    public constructor(
        private _problem: ILocalSearchProblem<TState>,
        private _state: TState
    ) { }

    public getCurrentState() : TState {
        return this._state;
    }

    public step() {
        let best_state = this._state;
        for (const neighbour of this._problem.getAllNeighbours(this._state)) {
            if (this._problem.score(neighbour) > this._problem.score(best_state)) {
                best_state = neighbour;
            }
        }
        this._state = best_state;
    }
}
