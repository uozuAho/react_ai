import { PandemicBoard } from "./pandemic_board";
import { PandemicGameState } from './game_state';
import { IterUtils } from '../../../src/libs/array/iter_utils';

describe('game state', () => {

    const board = new PandemicBoard();
    const state = new PandemicGameState(board);

    it('should have valid infection deck', () => {
        // should have drawn 9 infection cards
        expect(state.infection_deck.length).toBe(48 - 9);
        expect(state.infection_discard_pile.length).toBe(9);
        expect(state.infection_rate).toBe(2);
    });

    it('should have valid city states', () => {
        expect(state.city_states.size).toBe(48);

        const cube_counts = Array
            .from(state.city_states.values())
            .map(c => IterUtils.sum(c.cubes.values()));

        expect(cube_counts.filter(c => c === 3).length).toBe(3);
        expect(cube_counts.filter(c => c === 2).length).toBe(3);
        expect(cube_counts.filter(c => c === 1).length).toBe(3);
    });
});
