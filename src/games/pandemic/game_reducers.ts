import { PandemicGameState, CityState, LoseCondition } from './game_state';
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
    const new_state = state.clone();

    for (let i = 0; i < new_state.infection_rate; i++) {
        if (new_state.infection_deck.length === 0) {
            // todo: game over man!
        }
        const card = new_state.infection_deck.pop()!;
        const city = new_state.get_city(card);
        infect_city(new_state, city);
        new_state.infection_discard_pile.push(card);
    }

    return new_state;
}

/** Increase a city's cube count by 1. Note: MODIFIES STATE */
// exported for testing :(
export function infect_city(state: PandemicGameState, city: CityState, colour?: Colour, dont_infect?: CityState) {
    colour = colour ? colour : city.city.colour;

    if (city === dont_infect) {
        return;
    }
    if (city.num_cubes(colour) < 3) {
        if (state.unused_cubes.num_cubes(colour) === 0) {
            state.lose_condition = LoseCondition.NoMoreCubes;
        }
        else {
            state.unused_cubes.remove_cube(colour);
            city.add_cube(colour);
        }
    }
    else {
        // outbreak
        for (const neighbour of state.get_neighbours(city)) {
            infect_city(state, neighbour, colour, city);
        }
    }
}
