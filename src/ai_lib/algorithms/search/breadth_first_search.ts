import { IFrontier, GenericSearch } from './generic_search';
import { UniqueHashSet } from '../../structures/hash_set';
import { IHashable } from '../../structures/hash_set';
import { FifoQueue } from '../../structures/fifo_queue';
import { SearchNode, ISearchProblem } from './search_problem';

/** BFS: nodes searched in FIFO order */
export class BreadthFirstSearch<TState extends IHashable, TAction> extends GenericSearch<TState, TAction> {

    constructor(problem: ISearchProblem<TState, TAction>, path_cost_limit: number = Number.MAX_VALUE) {
        super(problem, path_cost_limit);
        this._frontier = new FifoFrontier();
        this._frontier.push(new SearchNode(problem.initial_state));
    }
}

class FifoFrontier<T extends IHashable> implements IFrontier<T> {
    private readonly frontier_queue: FifoQueue<T>;
    private readonly frontier_set: UniqueHashSet<T>;

    constructor() {
        this.frontier_queue = new FifoQueue<T>();
        this.frontier_set = new UniqueHashSet;
    }

    public push(search_node: T) {
        this.frontier_queue.push(search_node);
        this.frontier_set.add(search_node);
    }

    public pop() : T {
        const node = this.frontier_queue.pop();
        this.frontier_set.remove(node);
        return node;
    }

    public contains(node: T) : boolean {
        return this.frontier_set.contains(node);
    }

    public getStates() : T[] {
        return this.frontier_set.items();
    }

    public isEmpty() : boolean {
        return this.frontier_set.size() === 0;
    }
}
