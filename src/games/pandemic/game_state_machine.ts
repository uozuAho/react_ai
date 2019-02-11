import { PandemicGameState, LoseCondition } from './game_state';
import { IPandemicAction, EndTurnAction, InfectCityAction, ActionNames, OutbreakAction } from './game_actions';
import { ArrayUtils } from '../../libs/array/array_utils';

export type IStateChanger = (machine: PandemicStateMachine, action: IPandemicAction) => IterableIterator<PandemicGameState>;

export class PandemicStateMachine {

    private _state: PandemicGameState;
    private _handlers: Map<string, IStateChanger> = new Map([
        [ActionNames.END_TURN, endTurnHandler],
        [ActionNames.INFECT_CITY, infectCityHandler],
        [ActionNames.OUTBREAK, outbreakHandler]
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
        yield machine.emit_action(new OutbreakAction(action.city, colour, []));
    }
}

function* outbreakHandler(machine: PandemicStateMachine, action: OutbreakAction): IterableIterator<PandemicGameState> {

    const state = machine.get_state();
    const new_state = state.clone();

    new_state.outbreak_counter++;

    if (new_state.outbreak_counter === 8) {
        new_state.lose_condition = LoseCondition.MaxOutbreaks;
    }

    yield new_state;

    const city = state.get_city(action.city);

    for (const neighbour of state.get_neighbours(city)) {
        if (state.lost()) { break; }
        if (ArrayUtils.contains(action.already_outbreaked, neighbour.city.name)) { continue; }

        if (neighbour.num_cubes(action.colour) === 3) {
            const already_outbreaked = action.already_outbreaked.slice().concat([action.city]);
            machine.emit_action(new OutbreakAction(neighbour.city.name, action.colour, already_outbreaked));
        } else {
            machine.emit_action(new InfectCityAction(neighbour.city.name, action.colour));
        }
    }
}
