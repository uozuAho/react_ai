import { ILocalSearchProblem } from './local_search_problem';
import { ILocalSearchAlgorithm } from './local_search_algorithm';

export class HillClimbingSolver<TState> implements ILocalSearchAlgorithm<TState> {

    private _finished = false;

    public constructor(
        private _problem: ILocalSearchProblem<TState>,
        private _state: TState
        ) { }

    public setState(state: TState): void {
        this._state = state;
    }

    public getCurrentState() : TState {
        return this._state;
    }

    public step() {
        let best_state = this._state;
        for (const neighbour of this._problem.getAllNeighbours(this._state)) {
            if (this._problem.score(neighbour) > this._problem.score(best_state)) {
                best_state = neighbour;
            }
            else {
                this._finished = true;
            }
        }
        this._state = best_state;
    }

    public solve() {
        while (!this.isFinished()) {
            this.step();
        }
    }

    public isFinished() {
        return this._finished;
    }
}
