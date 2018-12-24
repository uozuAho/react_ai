import { IFrontier, GenericSearch } from './generic_search';
import { PriorityQueue } from '../../structures/priority_queue';
import { IHashable, UniqueHashSet } from '../../structures/hash_set';
import { SearchNode, ISearchProblem } from './search_problem';

/** Best first - searches the frontier in the given priority order */
export abstract class BestFirstSearch<TState extends IHashable, TAction> extends GenericSearch<TState, TAction> {

    constructor(problem: ISearchProblem<TState, TAction>, path_cost_limit: number = Number.MAX_VALUE) {
        super(problem, path_cost_limit);
        this._frontier = new PriorityFrontier<SearchNode<TState, TAction>>(
            (a, b) => this.compareStates(a, b));
        this._frontier.push(new SearchNode(problem.initial_state));
    }

    protected abstract _priorityFunc(node: SearchNode<TState, TAction>): number;

    // comparer for the priority queue
    private compareStates(a: SearchNode<TState, TAction>, b: SearchNode<TState, TAction>) : -1 | 0 | 1 {
        const h_a = this._priorityFunc(a);
        const h_b = this._priorityFunc(b);
        return h_a < h_b ? -1 : h_a > h_b ? 1 : 0;
    }
}

class PriorityFrontier<T extends IHashable> implements IFrontier<T> {
    private readonly _queue: PriorityQueue<T>;
    private readonly _set: UniqueHashSet<T>;

    constructor(compare: (a: T, b: T) => -1 | 0 | 1) {
        this._queue = new PriorityQueue<T>([], compare);
        this._set = new UniqueHashSet();
    }

    public push(search_node: T) {
        this._queue.push(search_node);
        this._set.add(search_node);
    }

    public pop() : T {
        const item = this._queue.pop();
        this._set.remove(item);
        return item;
    }

    public contains(node: T) : boolean {
        return this._set.contains(node)
    }

    public getStates() : T[] {
        return this._set.items();
    }

    public isEmpty() : boolean {
        return this._set.size() === 0;
    }
}