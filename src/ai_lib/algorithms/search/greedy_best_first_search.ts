import { BestFirstSearch } from './best_first_search';
import { IHashable } from '../../structures/hash_set';
import { SearchNode, ISearchProblem } from './search_problem';

/** 'Greedy' best first - simply uses the given heuristic as the priority
 */
export class GreedyBestFirstSearch<TState extends IHashable, TAction> extends BestFirstSearch<TState, TAction> {

    private _heuristic: (node: TState) => number;

    constructor(problem: ISearchProblem<TState, TAction>, path_cost_limit: number = Number.MAX_VALUE,
            heuristic: (node: TState) => number) {
        super(problem, path_cost_limit);
        this._heuristic = heuristic;
    }

    protected _priorityFunc(node: SearchNode<TState, TAction>) : number {
        return this._heuristic(node.state);
    }
}
