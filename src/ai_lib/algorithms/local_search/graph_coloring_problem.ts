import { ILocalSearchProblem } from './local_search_problem';

export class GraphColoringProblem implements ILocalSearchProblem<number[]> {

    constructor(public initial_state: number[]) {}

    public getAllNeighbours(state: number[]): Iterable<number[]> {
        throw new Error("Method not implemented.");
    }

    public getRandomNeighbour(state: number[]): number[] {
        throw new Error("Method not implemented.");
    }

    public score(state: number[]): number {
        throw new Error("Method not implemented.");
    }
}
