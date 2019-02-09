import { ILocalSearchProblem } from './local_search_problem';
import { ILocalSearchAlgorithm } from './local_search_algorithm';

const START_FINISHING_AT_MS = 5000;
const TIMEOUT_MS = 10000;

export class SimulatedAnnealing<TState> implements ILocalSearchAlgorithm<TState> {

    private _is_finishing = false;
    private _is_finished = false;
    private _temperature = 1000;
    private _start_time_ms = 0;
    private _last_temp_decrease_ms = 0;
    private _current_score = Number.MIN_VALUE;

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
        const now = Date.now();
        if (now - this._last_temp_decrease_ms > 100) {
            this._last_temp_decrease_ms = now;
            this._temperature = this._temperature * 0.9;
            // tslint:disable-next-line:no-console
            console.log(this._temperature);
        }

        const neighbour = this._problem.getRandomNeighbour(this._state);
        const neighbour_score = this._problem.score(neighbour);

        if (neighbour_score > this._current_score) {
            this._state = neighbour;
            this._current_score = neighbour_score;
        }
        // choose a worse solution with probability exp(-1 / temperature)
        else if (!this._is_finishing && Math.random() < Math.exp(-1 / this._temperature)) {
            this._state = neighbour;
        }
        if (this._temperature < 0 || now - this._start_time_ms > START_FINISHING_AT_MS) {
            if (!this._is_finishing) {
                // tslint:disable-next-line:no-console
                console.log('looking for valid solution');
            }
            this._is_finishing = true;
            // stop on next valid solution
            if (this._problem.isValid(this._state)) {
                this._is_finished = true;
            }
            if (now - this._start_time_ms > TIMEOUT_MS) {
                // tslint:disable-next-line:no-console
                console.log('timeout');
                this._is_finished = true;
            }
        }
    }

    public solve() {
        this._start_time_ms = Date.now();
        while (!this.isFinished()) {
            this.step();
        }
    }

    public isFinished() {
        return this._is_finished;
    }
}
