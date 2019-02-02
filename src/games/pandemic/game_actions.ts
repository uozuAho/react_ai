export const enum ActionNames {
    END_TURN = 'END_TURN'
};

export interface IPandemicAction {
    name: string;
}

export class EndTurnAction implements IPandemicAction {
    public name = ActionNames.END_TURN;
}
