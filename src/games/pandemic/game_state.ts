import { PandemicBoard, Colour, City } from './pandemic_board';
import { ArrayUtils } from '../../../src/libs/array/array_utils';

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

    constructor(board: PandemicBoard) {
        this._board = board;
        this.infection_deck = this.init_infection_deck(board);
        this.infection_discard_pile = [];
        this.infection_rate = 2;
        this.city_states = this.init_cities(board);
        this.do_initial_infection();
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

    private init_infection_deck(board: PandemicBoard): string[] {
        const deck = board.getCities().map(c => c.name);
        ArrayUtils.shuffle(deck);
        return deck;
    }

    private init_cities(board: PandemicBoard): Map<string, CityState> {
        const map = new Map<string, CityState>();
        board.getCities().map(c => map.set(c.name, new CityState(c)));
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
