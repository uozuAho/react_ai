import { PandemicGameState, CityState } from './game_state';
import { IPandemicAction, ActionNames } from './game_actions';
import { Colour } from './pandemic_board';

export class RootReducer {

    public reduce = (state: PandemicGameState, action: IPandemicAction) => {
        switch (action.name) {
            case ActionNames.END_TURN:
                return onEndTurn(state, action);
            default:
                throw new Error("Unhandled action " + action.name);
        }
    }
}

function onEndTurn(state: PandemicGameState, action: IPandemicAction) {
    for (let i = 0; i < state.infection_rate; i++) {
        if (state.infection_deck.length === 0) {
            // todo: game over man!
        }
        const card = state.infection_deck.pop()!;
        const city = state.get_city(card);
        infect_city(state, city);
        state.infection_discard_pile.push(card);
    }
    return state;
}

/** Increase a city's cube count by 1 */
// exported for testing :(
export function infect_city(state: PandemicGameState, city: CityState, colour?: Colour, dont_infect?: CityState) {
    if (city === dont_infect) {
        return;
    }
    if (city.num_cubes(city.city.colour) < 3) {
        city.add_cube(colour);
    }
    else {
        // outbreak
        for (const neighbour of state.get_neighbours(city)) {
            infect_city(state, neighbour, city.city.colour, city);
        }
    }
}
