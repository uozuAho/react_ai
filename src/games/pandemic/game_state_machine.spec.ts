import { PandemicBoard, all_colours, Colour } from "./pandemic_board";
import { PandemicGameState, LoseCondition } from './game_state';
import { EndTurnAction, InfectCityAction } from './game_actions';
import { IterUtils } from '../../../src/libs/array/iter_utils';
import { PandemicStateMachine } from './game_state_machine';

describe('game state machine', () => {

    const board = new PandemicBoard();
    let initial_game_state: PandemicGameState;

    beforeEach(()=> {
        initial_game_state = PandemicGameState.createNew(board);
        remove_all_cubes(initial_game_state);
    });

    describe('after init', () => {

        it('end turn', () => {
            const state_machine = new PandemicStateMachine(initial_game_state);

            state_machine.emit_action(new EndTurnAction());
            const next_state = state_machine.get_state();

            expect(next_state.infection_deck.length)
                .toBe(initial_game_state.infection_deck.length - 2);

            expect(next_state.infection_discard_pile.length)
                .toBe(initial_game_state.infection_discard_pile.length + 2);

            expect(num_cubes_on_cities(next_state)).toBe(num_cubes_on_cities(initial_game_state) + 2);
        });
    });

    describe('empty board, infect city', () => {

        let no_cubes_state: PandemicGameState;
        let state_machine: PandemicStateMachine;

        beforeEach(() => {
            no_cubes_state = initial_game_state.clone();
            remove_all_cubes(no_cubes_state);
            state_machine = new PandemicStateMachine(no_cubes_state);
        });

        it('atlanta', () => {
            state_machine.emit_action(new InfectCityAction('Atlanta'));
            const next_state = state_machine.get_state();

            const atlanta = next_state.get_city('Atlanta');

            expect(atlanta.num_cubes(atlanta.city.colour)).toBe(1);
        });

        it('should outbreak after 4 infects', () => {
            const infect_atlanta = new InfectCityAction('Atlanta');

            state_machine.emit_action(infect_atlanta);
            state_machine.emit_action(infect_atlanta);
            state_machine.emit_action(infect_atlanta);
            state_machine.emit_action(infect_atlanta);

            const state = state_machine.get_state();
            const atlanta = state.get_city('Atlanta');
            const neighbours = state.get_neighbours(atlanta);

            expect(atlanta.num_cubes(atlanta.city.colour)).toBe(3);
            for (const neighbour of neighbours) {
                expect(neighbour.num_cubes(atlanta.city.colour)).toBe(1);
            }
        });

        it('miami outbreak chain reaction', () => {
            for (const city of ['Miami', 'Mexico City', 'Bogota']) {
                state_machine.emit_action(new InfectCityAction(city));
                state_machine.emit_action(new InfectCityAction(city));
                state_machine.emit_action(new InfectCityAction(city));
            }

            // infect miami causes chain outbreak
            state_machine.emit_action(new InfectCityAction('Miami'));

            const state = state_machine.get_state();

            const miami = state.get_city('Miami');
            const mexico = state.get_city('Mexico City');
            const bogota = state.get_city('Bogota');
            const atlanta = state.get_city('Atlanta');
            const washington = state.get_city('Washington');
            const chicago = state.get_city('Chicago');
            const los_angeles = state.get_city('Los Angeles');
            const lima = state.get_city('Lima');
            const buenos_aires = state.get_city('Buenos Aires');
            const sao_paulo = state.get_city('Sao Paulo');
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

            // infect every blue city twice: 2 x 12 cities = 24 cubes: all blue cubes used
            for (const city of blue_city_names) {
                state_machine.emit_action(new InfectCityAction(city));
                state_machine.emit_action(new InfectCityAction(city));
            }

            // infect any blue city
            const last_city_name = blue_city_names[0];
            state_machine.emit_action(new InfectCityAction(last_city_name));

            const state = state_machine.get_state();
            const last_city = state.get_city(last_city_name);

            // no cubes left - should have same number of cubes, and game is lost
            expect(last_city.num_cubes()).toBe(2);
            expect(state.lost()).toBe(true);
            expect(state.lose_condition).toBe(LoseCondition.NoMoreCubes);
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
