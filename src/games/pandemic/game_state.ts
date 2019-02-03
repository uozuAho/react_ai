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
    private _won_because?: WinCondition;
    private _lost_because?: LoseCondition;
    private _unused_cubes: Map<Colour, number>;

    private constructor(board: PandemicBoard) {
        this._board = board;
    }

    public static createNew(board: PandemicBoard) {
        const state = new PandemicGameState(board);
        state.infection_deck = this.init_infection_deck(board);
        state.infection_discard_pile = [];
        state.infection_rate = 2;
        state._unused_cubes = this.init_cubes();
        state.city_states = this.init_cities(board);
        state.do_initial_infection();
        return state;
    }

    public clone(): PandemicGameState {
        const new_state = new PandemicGameState(this._board);
        new_state.infection_deck = this.infection_deck.slice();
        new_state.infection_discard_pile = this.infection_discard_pile.slice();
        new_state.infection_rate = this.infection_rate;
        new_state._unused_cubes = new Map();
        for (const kv of this._unused_cubes.entries()) {
            new_state._unused_cubes.set(kv[0], kv[1]);
        }
        const new_city_states = IterUtils.map(this.get_cities(), c => c.clone());
        new_state.city_states = PandemicGameState.create_city_map(new_city_states);
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

    public is_finished = () => this.won() || this.lost();

    public won = () => this._won_because !== undefined;

    public lost = () => this._lost_because !== undefined;

    private static init_infection_deck(board: PandemicBoard): string[] {
        const deck = board.getCities().map(c => c.name);
        ArrayUtils.shuffle(deck);
        return deck;
    }

    private static init_cubes(): Map<Colour, number> {
        const map = new Map<Colour, number>();
        for (const colour of all_colours) {
            map.set(colour, 24);
        }
        return map;
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
                for (let k = 0; k < j; k++) {
                    // todo: take cubes from cube pile
                    // meh... not another for loop...
                    city.add_cube(colour);
                }
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

    public clone(): CityState {
        const new_state = new CityState(this.city);
        all_colours.map(c => new_state.cubes.set(c, this.num_cubes(c)));
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

    public remove_cube(colour?: Colour) {
        colour = colour ? colour : this.city.colour;
        const num_cubes = this.num_cubes(colour);
        if (num_cubes === 0) {
            throw new Error('0 cubes to remove');
        }
        this.cubes.set(colour, num_cubes - 1);
    }
}

export enum WinCondition {
}

export enum LoseCondition {
    no_more_cubes
}
