import { PandemicGameState, LoseCondition } from './game_state';
import { IPandemicAction, EndTurnAction, InfectCityAction, ActionNames } from './game_actions';

export type IStateChanger = (machine: PandemicStateMachine, action: IPandemicAction) => IterableIterator<PandemicGameState>;

export class PandemicStateMachine {

    private _state: PandemicGameState;
    private _handlers: Map<string, IStateChanger> = new Map([
        [ActionNames.END_TURN, endTurnHandler],
        [ActionNames.INFECT_CITY, infectCityHandler]
    ]);

    constructor(state: PandemicGameState) {
        this._state = state;
    }

    public get_state()                          { return this._state;  }
    public set_state(state: PandemicGameState)  { this._state = state; }

    public emit_action(action: IPandemicAction): PandemicGameState {
        const handler = this.get_handler(action);
        for (const state of handler(this, action)) {
            this._state = state;
        }
        return this._state;
    }

    private get_handler(action: IPandemicAction): IStateChanger {
        const handler = this._handlers.get(action.name);
        if (handler === undefined) {
            throw new Error('no handler for action ' + action.name);
        }
        return handler;
    }
}

export function* endTurnHandler(machine: PandemicStateMachine, action: EndTurnAction): IterableIterator<PandemicGameState> {
    const infection_rate = machine.get_state().infection_rate;

    for (let i = 0; i < infection_rate; i++) {
        const new_state = machine.get_state().clone();
        if (new_state.infection_deck.length === 0) {
            // todo: game over man!
        }
        const card = new_state.infection_deck.pop()!;
        new_state.infection_discard_pile.push(card);

        yield new_state;
        yield machine.emit_action(new InfectCityAction(card));
    }
}

function* infectCityHandler(machine: PandemicStateMachine, action: InfectCityAction): IterableIterator<PandemicGameState> {
    const old_state = machine.get_state();
    const new_state = old_state.clone();

    const new_city = new_state.get_city(action.city);

    const colour = action.colour ? action.colour : new_city.city.colour;

    if (new_city.num_cubes(colour) < 3) {
        if (new_state.unused_cubes.num_cubes(colour) === 0) {
            new_state.lose_condition = LoseCondition.NoMoreCubes;
        }
        else {
            new_state.unused_cubes.remove_cube(colour);
            new_city.add_cube(colour);
        }
        yield new_state;
    }
    else {
        // outbreak(state, city, colour, []);
    }
}
