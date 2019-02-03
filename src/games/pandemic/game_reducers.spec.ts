import { PandemicBoard } from "./pandemic_board";
import { PandemicGameState } from './game_state';
import { RootReducer, infect_city } from './game_reducers';
import { EndTurnAction } from './game_actions';
import { IterUtils } from '../../../src/libs/array/iter_utils';

describe('game reducers', () => {

    const board = new PandemicBoard();
    const reducer = new RootReducer();
    let game_state = PandemicGameState.createNew(board);

    beforeEach(() => {
        // reducers modify state (cos I'm lazy), so reset it here
        game_state = PandemicGameState.createNew(board);
    });

    describe('after init', () => {

        it('end turn', () => {
            const nextState = reducer.reduce(game_state, new EndTurnAction());

            expect(nextState.infection_deck.length).toBe(48 - 9 - 2);
            expect(nextState.infection_discard_pile.length).toBe(9 + 2);
            expect(num_cubes_on_cities(nextState)).toBe(9 + 6 + 3 + 2);
        });
    });

    describe('infect city', () => {
        it('fresh atlanta', () => {
            const city = game_state.get_city('Atlanta');

            infect_city(game_state, city);

            expect(city.num_cubes(city.city.colour)).toBe(1);
        });

        // todo: this one sometimes breaks with maximum stack size. check again after making state immutable
        it('atlanta outbreak', () => {
            const atlanta = game_state.get_city('Atlanta');
            const atlanta_colour = atlanta.city.colour;
            const neighbours = game_state.get_neighbours(atlanta);

            infect_city(game_state, atlanta);
            infect_city(game_state, atlanta);
            infect_city(game_state, atlanta);
            infect_city(game_state, atlanta);

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
