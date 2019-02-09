export interface ILocalSearchAlgorithm<TState> {
    setState(state: TState): void;
    step(): void;
    solve(): void;
    isFinished(): boolean;
    getCurrentState() : TState;
}
