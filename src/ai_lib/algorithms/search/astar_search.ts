import { BestFirstSearch } from './best_first_search';
import { IHashable } from '../../structures/hash_set';
import { SearchNode, ISearchProblem } from './search_problem';

/** A* search - uses the node path cost + heuristic as priority
 */
export class AStarSearch<TState extends IHashable, TAction> extends BestFirstSearch<TState, TAction> {

    private _heuristic: (node: TState) => number;

    constructor(problem: ISearchProblem<TState, TAction>, path_cost_limit: number = Number.MAX_VALUE,
        heuristic: (node: TState) => number) {
        super(problem, path_cost_limit);
        this._heuristic = heuristic;
    }

    // f(n) = g(n) + h(n)
    // priority function = cost of N + heuristic of N
    protected _priorityFunc(node: SearchNode<TState, TAction>) : number {
        return node.path_cost + this._heuristic(node.state);
    }
}
