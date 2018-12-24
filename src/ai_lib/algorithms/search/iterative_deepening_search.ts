import { DepthFirstSearch } from './depth_first_search';
import { ISearchProblem } from './search_problem';
import { ISearchAlgorithm } from './search_algorithm';
import { IHashable } from '../../structures/hash_set';

export class IterativeDeepeningSearch<TState extends IHashable, TAction> implements ISearchAlgorithm<TState, TAction> {

    public isFinished: boolean;

    private _problem: ISearchProblem<TState, TAction>;
    private _dfsSolver: DepthFirstSearch<TState, TAction>;
    private _current_limit: number;

    constructor(problem: ISearchProblem<TState, TAction>) {
        this._problem = problem;
        this._current_limit = 1;
        this._dfsSolver = this.createDfsSolver();
    }

    public getCurrentState(): TState {
        return this._dfsSolver.getCurrentState();
    }

    public getSolutionTo(state: TState): TAction[] {
        return this._dfsSolver.getSolutionTo(state);
    }

    public isExplored(state: TState): boolean {
        return this._dfsSolver.isExplored(state);
    }

    public step(): void {
        if (this._dfsSolver.isFinished) {
            if (!this._dfsSolver.isSolved) {
                // couldn't solve problem with current depth limit, increase and try again
                this._current_limit += 1;
                this._dfsSolver = this.createDfsSolver();
                this._dfsSolver.step();
            }
            // else a solution has been found - do nothing
        }
        else {
            this._dfsSolver.step();
        }
    }

    private createDfsSolver() {
        return new DepthFirstSearch(this._problem, this._current_limit);
    }
}