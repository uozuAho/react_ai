export const enum ActionNames {
    END_TURN = 'END TURN',
    INFECT_CITY = 'INFECT CITY'
};

export interface IPandemicAction {
    name: string;
}

export class EndTurnAction implements IPandemicAction {
    public name = ActionNames.END_TURN;
}

export class InfectCityAction implements IPandemicAction {
    public name = ActionNames.INFECT_CITY;

    constructor(public city: string) {}
}
