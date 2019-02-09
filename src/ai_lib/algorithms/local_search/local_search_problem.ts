export interface ILocalSearchProblem<TState> {
    /** Get all neighbours to the current state */
    getAllNeighbours(state: TState) : Iterable<TState>;

    /** Pick a random neighbour of the current state */
    getRandomNeighbour(state: TState): TState;

    /** Return a number that can be used to compare how 'good' this state is
     *  compared to other states. Higher score = better.
     */
    score(state: TState): number;
}
