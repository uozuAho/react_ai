import { PandemicGameState, LoseCondition } from './game_state';
import { IPandemicAction, EndTurnAction, InfectCityAction, ActionNames, OutbreakAction } from './game_actions';
import { ArrayUtils } from '../../libs/array/array_utils';

export type IActionHandler = (machine: PandemicStateMachine, action: IPandemicAction) => void;

export class PandemicStateMachine {

    private _state: PandemicGameState;
    private _handlers: Map<string, IActionHandler> = new Map([
        [ActionNames.END_TURN, endTurnHandler],
        [ActionNames.INFECT_CITY, infectCityHandler],
        [ActionNames.OUTBREAK, outbreakHandler]
    ]);

    constructor(state: PandemicGameState) {
        this._state = state;
    }

    // immutable: return a copy of internal state
    public get_state()                          { return this._state.clone(); }
    // immutable: use a copy of the given state
    public set_state(state: PandemicGameState)  { this._state = state.clone(); }

    // this is the only way to modify the state of the state machine
    public emit_action(action: IPandemicAction) {
        // tslint:disable-next-line:no-console
        // console.log(JSON.stringify(action));
        const handler = this.get_handler(action);
        handler(this, action);
    }

    private get_handler(action: IPandemicAction): IActionHandler {
        const handler = this._handlers.get(action.name);
        if (handler === undefined) {
            throw new Error('no handler for action ' + action.name);
        }
        return handler;
    }
}

export function endTurnHandler(machine: PandemicStateMachine, action: EndTurnAction) {
    let state = machine.get_state();
    const infection_rate = state.infection_rate;

    for (let i = 0; i < infection_rate; i++) {
        state = machine.get_state();

        if (state.infection_deck.length === 0) {
            state.lose_condition = LoseCondition.NoMoreInfectionCards;
            machine.set_state(state);
            return;
        }

        const card = state.infection_deck.pop()!;
        state.infection_discard_pile.push(card);

        machine.set_state(state);
        machine.emit_action(new InfectCityAction(card));
    }
}

function infectCityHandler(machine: PandemicStateMachine, action: InfectCityAction) {
    const state = machine.get_state();
    const city = state.get_city(action.city);

    const colour = action.colour ? action.colour : city.city.colour;

    if (city.num_cubes(colour) < 3) {
        if (state.unused_cubes.num_cubes(colour) === 0) {
            state.lose_condition = LoseCondition.NoMoreCubes;
        }
        else {
            state.unused_cubes.remove_cube(colour);
            city.add_cube(colour);
        }
        machine.set_state(state);
    }
    else {
        machine.emit_action(new OutbreakAction(action.city, colour, []));
    }
}

function outbreakHandler(machine: PandemicStateMachine, action: OutbreakAction) {

    let state = machine.get_state();

    state.outbreak_counter++;

    if (state.outbreak_counter === 8) {
        state.lose_condition = LoseCondition.MaxOutbreaks;
        machine.set_state(state);
        return;
    }

    const city = state.get_city(action.city);
    action.already_outbreaked.push(action.city);

    for (const neighbour of state.get_neighbours(city)) {
        state = machine.get_state();

        if (state.lost()) { break; }
        if (ArrayUtils.contains(action.already_outbreaked, neighbour.city.name)) { continue; }

        if (neighbour.num_cubes(action.colour) === 3) {
            machine.emit_action(new OutbreakAction(neighbour.city.name, action.colour, action.already_outbreaked));
        } else {
            machine.emit_action(new InfectCityAction(neighbour.city.name, action.colour));
        }
    }
}
