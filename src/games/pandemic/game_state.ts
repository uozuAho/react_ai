import { PandemicBoard, Colour, City, all_colours } from './pandemic_board';
import { ArrayUtils } from '../../../src/libs/array/array_utils';
import { IterUtils } from '../../../src/libs/array/iter_utils';

export class PandemicGameState {
    /** infection cards per turn */
    public infection_rate: number;
    /** city name[] */
    public infection_deck: string[];
    /** city name[] */
    public infection_discard_pile: string[];
    /** map of city name : city state */
    private city_states: Map<string, CityState>;

    private _board: PandemicBoard;

    private constructor(board: PandemicBoard) {
        this._board = board;
    }

    public static createNew(board: PandemicBoard) {
        const state = new PandemicGameState(board);
        state.infection_deck = this.init_infection_deck(board);
        state.infection_discard_pile = [];
        state.infection_rate = 2;
        state.city_states = this.init_cities(board);
        state.do_initial_infection();
        return state;
    }

    public static clone(old_state: PandemicGameState): PandemicGameState {
        const new_state = new PandemicGameState(old_state._board);
        new_state.infection_deck = old_state.infection_deck.slice();
        new_state.infection_discard_pile = old_state.infection_discard_pile.slice();
        new_state.infection_rate = old_state.infection_rate;
        const new_city_states = IterUtils.map(old_state.get_cities(), c => CityState.clone(c));
        new_state.city_states = this.create_city_map(new_city_states);
        return new_state;
    }

    public get_city(name: string): CityState {
        const city = this.city_states.get(name);
        if (city === undefined) {
            throw new Error('unknown city ' + name);
        }
        return city;
    }

    public get_cities(): Iterable<CityState> {
        return this.city_states.values();
    }

    public get_neighbours(city: CityState): CityState[] {
        return this._board.getAdjacentCities(city.city).map(c => this.get_city(c.name));
    }

    private static init_infection_deck(board: PandemicBoard): string[] {
        const deck = board.getCities().map(c => c.name);
        ArrayUtils.shuffle(deck);
        return deck;
    }

    private static init_cities(board: PandemicBoard): Map<string, CityState> {
        return this.create_city_map(board.getCities().map(c => new CityState(c)));
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
                // todo: take cubes from cube pile
                // meh... not another for loop...
                Array(j).fill(0).map(_ => city.add_cube(colour));
            }
        }
    }
}

export class CityState {
    private cubes: Map<Colour, number> = new Map([
        ["red" as Colour, 0],
        ["yellow" as Colour, 0],
        ["black" as Colour, 0],
        ["blue" as Colour, 0],
    ]);

    constructor(public city: City) {}

    public static clone(old_state: CityState): CityState {
        const new_state = new CityState(old_state.city);
        all_colours.map(c => new_state.cubes.set(c, old_state.num_cubes(c)));
        return new_state;
    }

    public num_cubes(colour?: Colour): number {
        if (colour === undefined) {
            return this.num_all_cubes();
        }
        return this.cubes.get(colour)!;
    }

    private num_all_cubes(): number {
        return this.num_cubes("black") +
            this.num_cubes("red") +
            this.num_cubes("yellow") +
            this.num_cubes("blue");
    }

    public add_cube(colour?: Colour) {
        colour = colour ? colour : this.city.colour;
        const num_cubes = this.num_cubes(colour);
        this.cubes.set(colour, num_cubes + 1);
    }
}
