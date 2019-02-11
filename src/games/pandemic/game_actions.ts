import { Colour } from './pandemic_board';

export const enum ActionNames {
    END_TURN = 'END TURN',
    INFECT_CITY = 'INFECT CITY',
    OUTBREAK = 'OUTBREAK'
};

export interface IPandemicAction {
    name: string;
}

export class EndTurnAction implements IPandemicAction {
    public name = ActionNames.END_TURN;
}

export class InfectCityAction implements IPandemicAction {
    public name = ActionNames.INFECT_CITY;

    constructor(public city: string, public colour?: Colour) {}
}

export class OutbreakAction implements IPandemicAction {
    public name = ActionNames.OUTBREAK;

    constructor(public city: string, public colour: Colour, public already_outbreaked: string[]) {}
}
