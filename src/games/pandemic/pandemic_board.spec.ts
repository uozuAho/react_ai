import { PandemicBoard } from "./pandemic_board";

describe('pandemic board', () => {
    it('cities are good', () => {
        const board = new PandemicBoard();

        const cities = board.getCities();
        expect(cities.length).toBe(48);
        for (const city of cities) {
            expect(city.name).toBeDefined();
        }
    })
})