import { GraphColoringGenerator } from "./coloring_generator";

describe('graph coloring generator', () => {
    it('should generate 5 unique colorings for 1 node 5 colors', () => {
        const colorings = generateColorings(1, 5);

        expect(colorings.length).toBe(5);
        expect(new Set(colorings).size).toBe(5);
    });

    it('should generate 25 unique colorings for 2 nodes 5 colors', () => {
        const colorings = generateColorings(2, 5);

        expect(colorings.length).toBe(25);
        expect(new Set(colorings).size).toBe(25);
    });

    it('should generate 4^3 unique colorings for 3 nodes 4 colors', () => {
        const colorings = generateColorings(3, 4);

        expect(colorings.length).toBe(4**3);
        expect(new Set(colorings).size).toBe(4**3);
    });
});

function generateColorings(num_nodes: number, num_colors: number): number[][] {
    const colorings = [];
    for (const coloring of GraphColoringGenerator.allColorings(num_nodes, num_colors)) {
        colorings.push(coloring.slice()); // save a copy! don't save reference to internal array
    }
    return colorings;
}
