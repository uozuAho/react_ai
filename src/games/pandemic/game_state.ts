import { PandemicBoard, Colour, City } from './pandemic_board';
import { ArrayUtils } from '../../../src/libs/array/array_utils';
import { Assert } from '../../../src/libs/assert/Assert';

export class PandemicGameState {
    /** infection cards per turn */
    public infection_rate: number;
    /** city name[] */
    public infection_deck: string[];
    /** city name[] */
    public infection_discard_pile: string[];
    /** map of city name : city state */
    public city_states: Map<string, CityState>;

    constructor(board: PandemicBoard) {
        this.infection_deck = this.init_infection_deck(board);
        this.infection_discard_pile = [];
        this.infection_rate = 2;
        this.city_states = this.init_cities(board);
        this.do_initial_infection();
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
                const state = this.city_states.get(card);
                Assert.isTrue(!!state, "couldn't find city " + card);
                const colour = state!.city.colour;
                // todo: take cubes from cube pile
                state!.cubes.set(colour, j);
            }
        }
    }
}

export class CityState {
    public cubes: Map<Colour, number> = new Map([
        ["red" as Colour, 0],
        ["yellow" as Colour, 0],
        ["black" as Colour, 0],
        ["blue" as Colour, 0],
    ]);

    constructor(public city: City) {
    }
}
