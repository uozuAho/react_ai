export interface ILocalSearchProblem<TState> {
    readonly initial_state: TState;

    getAllNeighbours(state: TState) : Iterable<TState>;
    getRandomNeighbour(state: TState): TState;

    /** Return a number that can be used to compare how 'good' this state is
     *  compared to other states. Higher score = better.
     */
    score(state: TState): number;
}
