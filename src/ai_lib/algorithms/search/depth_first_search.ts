import { IFrontier, GenericSearch } from './generic_search';
import { IHashable } from '../../structures/hash_set';
import { ISearchProblem, SearchNode } from './search_problem';

/** DFS: nodes searched in LIFO order */
export class DepthFirstSearch<TState extends IHashable, TAction> extends GenericSearch<TState, TAction> {

    constructor(problem: ISearchProblem<TState, TAction>, path_cost_limit: number = Number.MAX_VALUE) {
        super(problem, path_cost_limit);
        this._frontier = new LifoFrontier();
        this._frontier.push(new SearchNode(problem.initial_state));
    }
}

class LifoFrontier<T extends IHashable> implements IFrontier<T> {
    private readonly frontier_queue: T[]

    constructor() {
        this.frontier_queue = [];
    }

    public push(search_node: T) {
        this.frontier_queue.push(search_node);
    }

    public pop() : T {
        if (this.frontier_queue.length === 0) {
            throw new Error('queue is empty');
        }
        return this.frontier_queue.pop() as T;
    }

    public contains(node: T) : boolean {
        return this.frontier_queue.indexOf(node) >= 0;
    }

    public getStates() : T[] {
        return this.frontier_queue;
    }

    public isEmpty() : boolean {
        return this.frontier_queue.length === 0;
    }
}
