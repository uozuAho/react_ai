import { PandemicBoard, all_colours, Colour } from "./pandemic_board";
import { PandemicGameState, LoseCondition } from './game_state';
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

        let no_cubes_state: PandemicGameState;

        beforeEach(() => {
            // infect city modifies state, so use this one
            no_cubes_state = initial_game_state.clone();
            remove_all_cubes(no_cubes_state);
        });

        it('fresh atlanta', () => {
            const atlanta = no_cubes_state.get_city('Atlanta');

            infect_city(no_cubes_state, atlanta);

            expect(atlanta.num_cubes(atlanta.city.colour)).toBe(1);
        });

        it('atlanta outbreak', () => {
            // note that this covers a border case - miami is a neighbour of atlanta
            const atlanta = no_cubes_state.get_city('Atlanta');
            const atlanta_colour = atlanta.city.colour;
            const neighbours = no_cubes_state.get_neighbours(atlanta);

            infect_city(no_cubes_state, atlanta);
            infect_city(no_cubes_state, atlanta);
            infect_city(no_cubes_state, atlanta);
            infect_city(no_cubes_state, atlanta);

            expect(atlanta.num_cubes(atlanta_colour)).toBe(3);
            for (const neighbour of neighbours) {
                expect(neighbour.num_cubes(atlanta_colour)).toBe(1);
            }
        });

        it('miami outbreak chain reaction', () => {
            // note that this covers a border case - miami is a neighbour of atlanta
            const miami = no_cubes_state.get_city('Miami');
            const mexico = no_cubes_state.get_city('Mexico City');
            const bogota = no_cubes_state.get_city('Bogota');
            const atlanta = no_cubes_state.get_city('Atlanta');
            const washington = no_cubes_state.get_city('Washington');
            const chicago = no_cubes_state.get_city('Chicago');
            const los_angeles = no_cubes_state.get_city('Los Angeles');
            const lima = no_cubes_state.get_city('Lima');
            const buenos_aires = no_cubes_state.get_city('Buenos Aires');
            const sao_paulo = no_cubes_state.get_city('Sao Paulo');
            const yellow: Colour = 'yellow';

            for (const city of [miami, mexico, bogota]) {
                infect_city(no_cubes_state, city);
                infect_city(no_cubes_state, city);
                infect_city(no_cubes_state, city);
            }

            // infect miami causes chain outbreak
            infect_city(no_cubes_state, miami);

            expect(miami.num_cubes(yellow)).toBe(3);
            expect(mexico.num_cubes(yellow)).toBe(3);
            expect(bogota.num_cubes(yellow)).toBe(3);

            expect(atlanta.num_cubes(yellow)).toBe(1);
            expect(washington.num_cubes(yellow)).toBe(1);
            expect(chicago.num_cubes(yellow)).toBe(1);
            expect(los_angeles.num_cubes(yellow)).toBe(1);
            expect(lima.num_cubes(yellow)).toBe(2);
            expect(buenos_aires.num_cubes(yellow)).toBe(1);
            expect(sao_paulo.num_cubes(yellow)).toBe(1);
        });

        it('should lose game when cubes run out', () => {
            const blue_cities = Array.from(no_cubes_state.get_cities()).filter(c => c.city.colour === "blue");
            // infect every blue city twice: 2 x 12 cities = 24 cubes: all blue cubes used
            for (const city of blue_cities) {
                infect_city(no_cubes_state, city);
                infect_city(no_cubes_state, city);
            }

            // infect any blue city
            const last_city = blue_cities[0];
            infect_city(no_cubes_state, last_city);

            // no cubes left - should have same number of cubes, and game is lost
            expect(last_city.num_cubes()).toBe(2);
            expect(no_cubes_state.lost()).toBe(true);
            expect(no_cubes_state.lose_condition).toBe(LoseCondition.NoMoreCubes);
        });
    });
});

function num_cubes_on_cities(state: PandemicGameState) {
    return IterUtils.sum(Array.from(state.get_cities()).map(c => c.num_cubes()));
}

function remove_all_cubes(state: PandemicGameState) {
    for (const city of state.get_cities()) {
        for (const colour of all_colours) {
            while (city.num_cubes(colour) > 0) {
                city.remove_cube(colour);
            }
        }
    }
}
