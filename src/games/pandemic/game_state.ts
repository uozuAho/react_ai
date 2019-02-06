import { PandemicBoard, Colour, City, all_colours } from './pandemic_board';
import { ArrayUtils } from '../../../src/libs/array/array_utils';
import { IterUtils } from '../../../src/libs/array/iter_utils';
import { GraphT } from '../../../src/ai_lib/structures/graphT';
import { Edge } from '../../../src/ai_lib/structures/igraph';

export class PandemicGameState {
    /** infection cards per turn */
    public infection_rate: number;
    /** city name[] */
    public infection_deck: string[];
    /** city name[] */
    public infection_discard_pile: string[];

    public win_condition?: WinCondition;
    public lose_condition?: LoseCondition;
    public unused_cubes: Cubes;
    public outbreak_counter: number;

    /** map of city name : city state */
    private _city_states: Map<string, CityState>;

    private _board: PandemicBoard;
    private _graph: GraphT<CityState>;

    private constructor(board: PandemicBoard) {
        this._board = board;
    }

    public static createNew(board: PandemicBoard) {
        const state = new PandemicGameState(board);

        state.infection_deck = this.init_infection_deck(board);
        state.infection_discard_pile = [];
        state.infection_rate = 2;
        state.unused_cubes = this.init_cubes();
        state.outbreak_counter = 0;

        const city_states = board.getCities().map(c => new CityState(c));
        state._graph = this.init_city_graph(city_states, board.getCityGraph().get_edges());
        state._city_states = this.create_city_map(city_states);

        state.do_initial_infection();

        return state;
    }

    public clone(): PandemicGameState {
        const new_state = new PandemicGameState(this._board);

        new_state.infection_deck = this.infection_deck.slice();
        new_state.infection_discard_pile = this.infection_discard_pile.slice();
        new_state.infection_rate = this.infection_rate;
        new_state.unused_cubes = this.unused_cubes.clone();
        new_state.outbreak_counter = this.outbreak_counter;

        const new_city_states = Array.from(IterUtils.map(this.get_cities(), c => c.clone()));
        new_state._graph = PandemicGameState.init_city_graph(
            new_city_states, this._board.getCityGraph().get_edges());
        new_state._city_states = PandemicGameState.create_city_map(new_city_states);
        return new_state;
    }

    public get_city_graph(): GraphT<CityState> {
        return this._graph;
    }

    public get_city(name: string): CityState {
        const city = this._city_states.get(name);
        if (city === undefined) {
            throw new Error('unknown city ' + name);
        }
        return city;
    }

    public get_cities(): Iterable<CityState> {
        return this._city_states.values();
    }

    public get_neighbours(city: CityState): CityState[] {
        return this._board.getAdjacentCities(city.city).map(c => this.get_city(c.name));
    }

    public is_finished = () => this.won() || this.lost();

    public won = () => this.win_condition !== undefined;

    public lost = () => this.lose_condition !== undefined;

    private static init_infection_deck(board: PandemicBoard): string[] {
        const deck = board.getCities().map(c => c.name);
        ArrayUtils.shuffle(deck);
        return deck;
    }

    private static init_cubes(): Cubes {
        const cubes = new Cubes();
        all_colours.map(c => cubes.set_num_cubes(c, 24));
        return cubes;
    }

    private static init_city_graph(cities: CityState[], edges: Edge[]): GraphT<CityState>
    {
        const graph = new GraphT<CityState>();

        for (const city of cities) {
            graph.add_node(city);
        }
        for (const edge of edges) {
            graph.add_edge(edge.from, edge.to);
        }

        return graph;
    }

    private static create_city_map(city_states: Iterable<CityState>): Map<string, CityState> {
        const map = new Map<string, CityState>();
        for (const city_state of city_states) {
            map.set(city_state.city.name, city_state);
        }
        return map;
    }

    private do_initial_infection() {
        for (let i = 0; i < 3; i++) {
            for (let j = 3; j > 0; j--) {
                const card = this.infection_deck.pop()!;
                this.infection_discard_pile.push(card);
                const city = this.get_city(card);
                const colour = city.city.colour;
                for (let k = 0; k < j; k++) {
                    this.unused_cubes.remove_cube(colour);
                    city.add_cube(colour);
                }
            }
        }
    }
}

export class CityState {
    private _cubes: Cubes;

    constructor(public city: City) {
        this._cubes = new Cubes();
    }

    public clone(): CityState {
        const new_state = new CityState(this.city);
        new_state._cubes = this._cubes.clone();
        return new_state;
    }

    public num_cubes(colour?: Colour): number {
        colour = colour ? colour : this.city.colour;
        return this._cubes.num_cubes(colour);
    }

    public add_cube(colour?: Colour) {
        colour = colour ? colour : this.city.colour;
        this._cubes.add_cube(colour);
    }

    public remove_cube(colour?: Colour) {
        colour = colour ? colour : this.city.colour;
        this._cubes.remove_cube(colour);
    }
}

class Cubes {
    private _counts: Map<Colour, number> = new Map([
        ["red" as Colour, 0],
        ["yellow" as Colour, 0],
        ["black" as Colour, 0],
        ["blue" as Colour, 0],
    ]);

    public clone(): Cubes {
        const new_cubes = new Cubes();
        all_colours.map(c => new_cubes._counts.set(c, this.num_cubes(c)));
        return new_cubes;
    }

    public num_cubes(colour: Colour): number {
        return this._counts.get(colour)!;
    }

    public add_cube(colour: Colour) {
        const num_cubes = this.num_cubes(colour);
        this._counts.set(colour, num_cubes + 1);
    }

    public set_num_cubes(colour: Colour, value: number) {
        this._counts.set(colour, value);
    }

    public remove_cube(colour: Colour) {
        const num_cubes = this.num_cubes(colour);
        if (num_cubes === 0) {
            throw new Error('0 cubes to remove');
        }
        this._counts.set(colour, num_cubes - 1);
    }
}

export enum WinCondition {
}

export enum LoseCondition {
    NoMoreCubes,
    MaxOutbreaks
}
