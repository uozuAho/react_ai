import { PandemicBoard, all_colours, Colour } from "./pandemic_board";
import { PandemicGameState, LoseCondition } from './game_state';
import { RootReducer } from './game_reducers';
import { EndTurnAction, InfectCityAction } from './game_actions';
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

        const infect_city = (state: PandemicGameState, city: string) => {
            return reducer.reduce(state, new InfectCityAction(city));
        }

        beforeEach(() => {
            // infect city modifies state, so use this one
            no_cubes_state = initial_game_state.clone();
            remove_all_cubes(no_cubes_state);
        });

        it('fresh atlanta', () => {
            const next_state = reducer.reduce(no_cubes_state, new InfectCityAction('Atlanta'));

            const atlanta = next_state.get_city('Atlanta');

            expect(atlanta.num_cubes(atlanta.city.colour)).toBe(1);
        });

        it('atlanta outbreak', () => {
            // note that this covers a border case - miami is a neighbour of atlanta
            let next_state = no_cubes_state;

            next_state = infect_city(next_state, 'Atlanta');
            next_state = infect_city(next_state, 'Atlanta');
            next_state = infect_city(next_state, 'Atlanta');
            next_state = infect_city(next_state, 'Atlanta');

            const atlanta = next_state.get_city('Atlanta');
            const neighbours = next_state.get_neighbours(atlanta);

            expect(atlanta.num_cubes(atlanta.city.colour)).toBe(3);
            for (const neighbour of neighbours) {
                expect(neighbour.num_cubes(atlanta.city.colour)).toBe(1);
            }
        });

        it('miami outbreak chain reaction', () => {
            let next_state = no_cubes_state;

            for (const city of ['Miami', 'Mexico City', 'Bogota']) {
                next_state = infect_city(next_state, city);
                next_state = infect_city(next_state, city);
                next_state = infect_city(next_state, city);
            }

            // infect miami causes chain outbreak
            next_state = infect_city(next_state, 'Miami');

            const miami = next_state.get_city('Miami');
            const mexico = next_state.get_city('Mexico City');
            const bogota = next_state.get_city('Bogota');
            const atlanta = next_state.get_city('Atlanta');
            const washington = next_state.get_city('Washington');
            const chicago = next_state.get_city('Chicago');
            const los_angeles = next_state.get_city('Los Angeles');
            const lima = next_state.get_city('Lima');
            const buenos_aires = next_state.get_city('Buenos Aires');
            const sao_paulo = next_state.get_city('Sao Paulo');
            const yellow: Colour = 'yellow';

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
            const blue_city_names = Array.from(no_cubes_state.get_cities())
                .filter(c => c.city.colour === "blue")
                .map(c => c.city.name);

            let next_state = no_cubes_state;

            // infect every blue city twice: 2 x 12 cities = 24 cubes: all blue cubes used
            for (const city of blue_city_names) {
                next_state = infect_city(next_state, city);
                next_state = infect_city(next_state, city);
            }

            // infect any blue city
            const last_city_name = blue_city_names[0];
            next_state = infect_city(next_state, last_city_name);

            const last_city = next_state.get_city(last_city_name);

            // no cubes left - should have same number of cubes, and game is lost
            expect(last_city.num_cubes()).toBe(2);
            expect(next_state.lost()).toBe(true);
            expect(next_state.lose_condition).toBe(LoseCondition.NoMoreCubes);
        });

        it('should lose game at max outbreaks', () => {
            let next_state = no_cubes_state;
            next_state.outbreak_counter = 7;

            next_state = infect_city(next_state, 'Atlanta');
            next_state = infect_city(next_state, 'Atlanta');
            next_state = infect_city(next_state, 'Atlanta');
            next_state = infect_city(next_state, 'Atlanta');

            expect(next_state.lost()).toBe(true);
            expect(next_state.lose_condition).toBe(LoseCondition.MaxOutbreaks);
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
