import { PandemicBoard } from "./pandemic_board";
import { PandemicGameState } from './game_state';
import { RootReducer, infect_city } from './game_reducers';
import { EndTurnAction } from './game_actions';
import { IterUtils } from '../../../src/libs/array/iter_utils';

describe('game reducers', () => {

    const board = new PandemicBoard();
    const reducer = new RootReducer();
    const initial_game_state = PandemicGameState.createNew(board);

    describe('after init', () => {

        it('end turn', () => {
            const old_state = initial_game_state;

            const next_state = reducer.reduce(initial_game_state, new EndTurnAction());

            expect(next_state.infection_deck.length)
                .toBe(old_state.infection_deck.length - 2);

            expect(next_state.infection_discard_pile.length)
                .toBe(old_state.infection_discard_pile.length + 2);

            expect(num_cubes_on_cities(next_state)).toBe(num_cubes_on_cities(old_state) + 2);
        });
    });

    describe('infect city', () => {

        let next_state: PandemicGameState;

        beforeEach(() => {
            // infect city modifies state, so use this one
            next_state = initial_game_state.clone();
        });

        it('fresh atlanta', () => {
            const atlanta = next_state.get_city('Atlanta');

            infect_city(next_state, atlanta);

            expect(atlanta.num_cubes(atlanta.city.colour)).toBe(1);
        });

        it('atlanta outbreak', () => {
            const atlanta = next_state.get_city('Atlanta');
            const atlanta_colour = atlanta.city.colour;
            const neighbours = next_state.get_neighbours(atlanta);

            infect_city(next_state, atlanta);
            infect_city(next_state, atlanta);
            infect_city(next_state, atlanta);
            infect_city(next_state, atlanta);

            expect(atlanta.num_cubes(atlanta_colour)).toBe(3);
            for (const neighbour of neighbours) {
                expect(neighbour.num_cubes(atlanta_colour)).toBe(1);
            }
        });
    });
});

function num_cubes_on_cities(state: PandemicGameState) {
    return IterUtils.sum(Array.from(state.get_cities()).map(c => c.num_cubes()));
}
