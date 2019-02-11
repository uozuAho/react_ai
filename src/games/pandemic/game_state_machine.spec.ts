import { PandemicBoard, all_colours, Colour } from "./pandemic_board";
import { PandemicGameState, LoseCondition } from './game_state';
import { EndTurnAction, InfectCityAction, IPandemicAction } from './game_actions';
import { IterUtils } from '../../../src/libs/array/iter_utils';
import { PandemicStateMachine, endTurnHandler } from './game_state_machine';

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

            const next_state = state_machine.emit_action(new EndTurnAction());

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
            const next_state = state_machine.emit_action(new InfectCityAction('Atlanta'));

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
